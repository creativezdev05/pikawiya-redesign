'use client';

import { useEffect, useRef } from 'react';

interface DotGridBackgroundProps {
  dotColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  orbitSpeed?: number;
  impactRadius?: number;
  scaleOnHover?: number;
  enableRevolve?: boolean;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  className?: string;
}

interface Dot {
  bx: number;
  by: number;
  inclination: number;
  ascension: number;
  phase: number;
  speedMult: number;
}

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function resolveVar(raw: string, el: Element): string {
  const s = raw.trim();
  if (!s.startsWith('var(')) return s;
  const inner = s.slice(4, -1).trim();
  const commaIdx = inner.indexOf(',');
  const varName = (commaIdx !== -1 ? inner.slice(0, commaIdx) : inner).trim();
  const fallback = commaIdx !== -1 ? inner.slice(commaIdx + 1).trim() : '';
  try {
    const resolved = getComputedStyle(el).getPropertyValue(varName).trim();
    if (resolved) return resolved;
  } catch {
    // ignore, fall through to fallback
  }
  if (fallback) return resolveVar(fallback, el);
  return '#888888';
}

function parseColor(raw: string, el: Element) {
  const color = resolveVar(raw, el);
  if (color.startsWith('rgb')) {
    const m = color.match(/[\d.]+/g) || [];
    return { r: Number(m[0]) || 0, g: Number(m[1]) || 0, b: Number(m[2]) || 0 };
  }
  let h = color.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  if (isNaN(n)) return { r: 136, g: 136, b: 136 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function DotGridBackground({
  dotColor = '#6366f1',
  dotSize = 3,
  dotSpacing = 28,
  orbitSpeed = 1.5,
  impactRadius = 100,
  scaleOnHover = 1.8,
  enableRevolve = true,
  style,
  width = '100%',
  height = '100%',
  className,
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cfgRef = useRef({
    dotColor,
    dotSize,
    dotSpacing,
    orbitSpeed,
    impactRadius,
    scaleOnHover,
    enableRevolve,
  });
  cfgRef.current = {
    dotColor,
    dotSize,
    dotSpacing,
    orbitSpeed,
    impactRadius,
    scaleOnHover,
    enableRevolve,
  };
  const dotsRef = useRef<Dot[]>([]);
  const spacingSnapRef = useRef(dotSpacing);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };
    let hovering = false;
    let leaveTs = 0;
    let prevTs = 0;
    let raf = 0;
    let globalAngle = 0;

    function buildDots() {
      const sp = cfgRef.current.dotSpacing;
      spacingSnapRef.current = sp;
      dotsRef.current = [];
      const cols = Math.ceil(W / sp) + 2;
      const rows = Math.ceil(H / sp) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dotsRef.current.push({
            bx: c * sp,
            by: r * sp,
            inclination: Math.random() * Math.PI,
            ascension: Math.random() * Math.PI * 2,
            phase: Math.random() * Math.PI * 2,
            speedMult: 0.7 + Math.random() * 0.6,
          });
        }
      }
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // The canvas sits behind page content (-z-10), so it never receives its
    // own pointer events — track the cursor at the document level instead
    // and project it onto the canvas's own coordinate space.
    function handleMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      hovering = true;
    }
    function handleLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
      hovering = false;
      leaveTs = performance.now();
    }
    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas!.getBoundingClientRect();
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      hovering = true;
    }
    function handleTouchEnd() {
      hovering = false;
      leaveTs = performance.now();
    }
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('touchstart', handleTouchMove, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    function loop(ts: number) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((ts - (prevTs || ts)) / 1000, 0.05);
      prevTs = ts;
      const cfg = cfgRef.current;
      if (spacingSnapRef.current !== cfg.dotSpacing) buildDots();
      globalAngle += cfg.orbitSpeed * dt;
      ctx!.clearRect(0, 0, W, H);
      const rgb = parseColor(cfg.dotColor, canvas!);
      const mx = mouse.x;
      const my = mouse.y;
      const timeSinceLeave = hovering ? 0 : Math.max(0, ts - leaveTs) / 1000;
      const decay = hovering ? 1 : smoothstep(Math.max(0, 1 - timeSinceLeave * 1.5));

      for (const d of dotsRef.current) {
        const dx = d.bx - mx;
        const dy = d.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const inRange = dist < cfg.impactRadius && dist > 0;
        let x = d.bx;
        let y = d.by;
        let scale = 1;
        let alpha = 0.3;

        if (inRange) {
          const t = dist / cfg.impactRadius;
          const inf = smoothstep(1 - t) * decay;

          if (cfg.enableRevolve) {
            // Orbital radius scales with distance from cursor edge
            const orbitR = (1 - t) * cfg.dotSpacing * 0.7 * inf;
            // Angle along this dot's orbit
            const theta = globalAngle * d.speedMult + d.phase;
            // 3-D orbit: parametric ellipse in a tilted plane, projected to 2-D.
            const cosA = Math.cos(d.ascension);
            const sinA = Math.sin(d.ascension);
            const cosI = Math.cos(d.inclination);
            const sinI = Math.sin(d.inclination);
            const lx = Math.cos(theta);
            const ly = Math.sin(theta) * cosI;
            const lz = Math.sin(theta) * sinI; // +1 = toward viewer, -1 = away

            const ox = (lx * cosA - ly * sinA) * orbitR;
            const oy = (lx * sinA + ly * cosA) * orbitR;
            x = d.bx + ox;
            y = d.by + oy;

            // Depth cue: dots "behind" the plane are slightly smaller and dimmer
            const depthScale = 0.75 + 0.25 * ((lz + 1) * 0.5); // 0.75 - 1.0
            scale = (1 + (cfg.scaleOnHover - 1) * inf) * depthScale;
            alpha = (0.3 + 0.7 * inf) * depthScale;
          } else {
            scale = 1 + (cfg.scaleOnHover - 1) * inf;
            alpha = 0.3 + 0.7 * inf;
          }
        }

        const r = (cfg.dotSize / 2) * scale;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx!.fill();
      }
    }

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('touchstart', handleTouchMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width, height, ...style }}
    />
  );
}

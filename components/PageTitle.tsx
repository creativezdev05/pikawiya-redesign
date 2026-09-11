type PageTitleProps = {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Force white-to-ochre blend for titles sitting on dark surfaces. */
  onDark?: boolean;
};

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export default function PageTitle({
  children,
  as: Tag = "h1",
  className = "",
  onDark = false,
}: PageTitleProps) {
  const text = normalize(children);
  const delay = -((text.length % 7) * 0.45);

  return (
    <Tag
      className={`title-blend${onDark ? " title-blend--on-dark" : ""} ${className}`.trim()}
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </Tag>
  );
}

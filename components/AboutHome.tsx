import React from 'react';
import { Heart, Compass, Award, Lightbulb, Users, Flame } from 'lucide-react';
import NextImage from 'next/image';
import CulturalPattern from './CulturalPattern';

export default function AboutSection() {
  const values = [
    { name: 'Believe', icon: Heart, desc: 'We are making a difference together.' },
    { name: 'Initiative', icon: Lightbulb, desc: 'We develop new programs and services in response to unmet needs.' },
    { name: 'Persistence', icon: Flame, desc: 'Where others give up, we reach out.' },
    { name: 'Respect', icon: Users, desc: 'We treat others in the community and workplace with respect.' },
    { name: 'Consultation', icon: Compass, desc: 'We engage our community to understand your needs.' },
    { name: 'Honour', icon: Award, desc: 'Our service/our history reflect upon the past, learn from it and promote change.' },
  ];

  const visionPoints = [
    "We provide holistic health care services that set a benchmark for other ACCHOs.",
    "We are embraced by our workers, external bodies, and the wider community.",
    "We foster an environment of diversity and harmony.",
    "We support the living preferences of our people wherever they live.",
    "We aspire to be part of an Aboriginal community that is healthy at all ages and across generations.",
    "We demonstrate good governance and exceed the expectations of our funding bodies.",
    "We are fiscally responsible, with sustainable growth and revenue to ensure that we have the right staff to deliver our services."
  ];

  return (
    <section className="relative overflow-hidden bg-[#000D1F] py-24 px-6 md:px-12 lg:px-20 text-sand">
      <CulturalPattern variant="about" />
      <div aria-hidden="true" className="cultural-background cultural-background--about">
        <NextImage src="/assets/home/dot-pattern-dark.webp" alt="" fill sizes="100vw" />
      </div>
      <div className="absolute inset-0 z-0 bg-[#000D1F]/78" />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto mb-24 space-y-6">
          <span className="inline-flex items-center gap-3 text-ochre uppercase tracking-[0.22em] text-xs font-semibold"><span className="h-px w-10 bg-ochre" /> Our Story</span>
          <h2 className="max-w-3xl text-5xl md:text-7xl font-bold tracking-normal leading-[0.95] text-white">What We Are All About</h2>
          <p className="max-w-2xl text-sand/75 text-lg md:text-xl leading-relaxed">
            Pika Wiya Health Service is guided by community, culture, and a commitment to better health for Aboriginal and Torres Strait Islander people.
          </p>
        </div>

        <section className="relative overflow-hidden bg-white text-earth -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20 py-16 border-y border-ochre/30">
          <CulturalPattern variant="about" className="cultural-pattern--light" />
          <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-0 items-stretch border-y border-earth/15">
            <div className="p-8 md:p-14 flex flex-col justify-center space-y-6">
            <span className="text-ochre uppercase tracking-widest text-xs font-semibold">Mission Statement</span>
            <h3 className="text-3xl md:text-5xl font-bold leading-tight text-earth">
              Empowering community through health, dignity and culture
            </h3>
            <p className="text-earth/75 text-lg leading-relaxed">
              Pika Wiya Health Service Aboriginal Corporation will provide a culturally appropriate service to Aboriginal and Torres Strait Islander people, addressing preventative, promotive and curative aspects of health, which encourages our community to achieve greater dignity and quality of life equal with all Australians.
            </p>
            </div>

            <div className="relative min-h-[440px] overflow-hidden border border-ochre/30 group">
            <NextImage
              src="/assets/about/Rachael-Schmerl.jpeg"
              alt="Rachael Schmerl, Chief Executive Officer of Pika Wiya Health Service"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/10 to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-ochre text-xs font-semibold uppercase tracking-widest">Rachael Schmerl</span>
                <p className="text-lg font-semibold mt-1">Chief Executive Officer</p>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="-mx-6 md:-mx-12 lg:-mx-20 bg-white text-earth px-6 md:px-12 lg:px-20 py-20 space-y-10 relative overflow-hidden">
          <CulturalPattern variant="vision" className="cultural-pattern--light" />
          <div className="relative z-10 max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-3 text-ochre uppercase tracking-widest text-xs font-semibold"><span className="h-px w-10 bg-ochre" /> Looking ahead</span>
            <h3 className="text-4xl md:text-6xl font-bold text-[#000D1F]">Our Vision</h3>
            <p className="text-earth/70">Setting benchmarks in holistic Aboriginal healthcare.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visionPoints.map((point, index) => (
              <div key={index} className="bg-white/80 border-t-2 border-ochre/60 p-6 space-y-4 shadow-sm hover:-translate-y-1 hover:border-ochre transition">
                <span className="text-[#000D1F]/35 font-bold text-3xl">0{index + 1}</span>
                <p className="text-earth/75 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        <section className="bg-[#000D1F] text-sand -mx-6 md:-mx-12 lg:-mx-20 px-6 md:px-12 lg:px-20 py-20 space-y-10 relative overflow-hidden border-y border-ochre/30">
          <CulturalPattern variant="values" />
          <div aria-hidden="true" className="cultural-background cultural-background--values">
            <NextImage src="/assets/home/dot-pattern-dark.webp" alt="" fill sizes="100vw" />
          </div>
          <div className="absolute inset-0 z-0 bg-[#000D1F]/78" />
          <div className="relative z-10 max-w-7xl mx-auto space-y-10">
            <div className="max-w-2xl space-y-3">
              <span className="text-ochre uppercase tracking-widest text-xs font-semibold">How we work</span>
              <h3 className="text-4xl md:text-6xl font-bold text-white">Our Values</h3>
              <p className="text-sand/75">The principles guiding every program and interaction.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((val) => {
                const IconComponent = val.icon;
                return (
                  <div key={val.name} className="bg-white/5 border border-sand/20 p-6 space-y-4 hover:bg-ochre/10 hover:border-ochre/70 hover:-translate-y-1 transition">
                    <div className="w-12 h-12 rounded-lg bg-ochre/20 flex items-center justify-center text-ochre">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{val.name}</h4>
                      <p className="text-sand/70 text-sm mt-1 leading-relaxed">{val.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="bg-ochre text-white border border-ochre-dark p-8 md:p-14 max-w-5xl mx-auto backdrop-blur-sm">
          <span className="text-white/75 uppercase tracking-widest text-xs font-semibold">Our Purpose</span>
          <p className="text-3xl md:text-5xl font-bold mt-3 leading-tight max-w-4xl">
            &quot;To provide health care our way to our people so our community is healthy at every age.&quot;
          </p>
        </div>

      </div>
    </section>
  );
}
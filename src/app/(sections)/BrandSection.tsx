'use client';

import { useLayoutEffect, useRef } from "react";

import AnimatedText from "../(components)/AnimatedText";
import { gsap, registerGSAPPlugins } from "../lib/gsapConfig";

const BrandSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useLayoutEffect(() => {
    registerGSAPPlugins();

    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "center center",
            scrub: true,
          },
        },
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "center 40%",
            scrub: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
      }}
      className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#fefefe] to-[#f5f5f5] px-6 py-24 text-center text-zinc-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.6),_transparent_60%)]" />
      <div className="relative flex w-full max-w-4xl flex-col items-center gap-8">
        <AnimatedText
          text="Nara Skincare"
          className="text-xs uppercase tracking-[0.7rem] text-zinc-500"
        />
        <div
          ref={(node) => {
            logoRef.current = node;
          }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-5xl font-serif tracking-[0.2rem] text-zinc-900">
            Tallow Nara
          </div>
          <p className="max-w-2xl text-base text-zinc-600">
            Ritual modern yang terinspirasi dari warisan perawatan kulit Nusantara,
            menghadirkan kelembapan kaya nutrisi namun terasa ringan.
          </p>
        </div>
        <a
          ref={(node) => {
            ctaRef.current = node;
          }}
          href="#"
          className="rounded-full border border-zinc-900 px-8 py-3 text-sm uppercase tracking-[0.4rem] transition hover:bg-zinc-900 hover:text-white"
        >
          Temukan Rahasianya
        </a>
      </div>
    </section>
  );
};

export default BrandSection;


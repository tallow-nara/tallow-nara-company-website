/** @format */

"use client";

import { useLayoutEffect, useRef } from "react";

import AnimatedText from "../(components)/AnimatedText";
import { gsap, registerGSAPPlugins } from "../lib/gsapConfig";

const ProductRevealScene = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bottleRef = useRef<HTMLDivElement | null>(null);
  const shineRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    registerGSAPPlugins();

    if (!sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      timeline
        .fromTo(
          bottleRef.current,
          { opacity: 0, scale: 0.8, y: 120 },
          { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: "power3.out" }
        )
        .fromTo(
          shineRef.current,
          { opacity: 0, rotate: -15 },
          { opacity: 1, rotate: 5, duration: 1.2, ease: "power1.inOut" },
          "-=0.6"
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
          "-=0.8"
        );

      gsap.fromTo(
        shineRef.current,
        { opacity: 0, xPercent: -140 },
        {
          opacity: 1,
          xPercent: 100,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
      }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#f7d9a8] via-[#f7f1e9] to-[#fefefe] px-6 text-zinc-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_65%)]" />
      <div className="relative flex w-full max-w-6xl flex-col items-center gap-12 text-center sm:flex-row sm:text-left">
        <div
          ref={(node) => {
            copyRef.current = node;
          }}
          className="flex flex-1 flex-col gap-6"
        >
          <AnimatedText
            text="Produk Pelembap"
            className="text-sm uppercase tracking-[0.4rem] text-zinc-600"
          />
          <h3 className="text-4xl font-bold sm:text-5xl">
            Lapisan akhir yang menutup nutrisi alami kulit.
          </h3>
          <p className="text-lg text-zinc-600">
            Setiap tetes mengandung lipid utuh, bekerja serasi dengan barrier
            kulit untuk memberikan efek glowing alami tanpa rasa berat.
          </p>
        </div>
        <div className="relative flex flex-1 items-center justify-center gap-10">
          <div
            ref={(node) => {
              bottleRef.current = node;
            }}
            data-model-anchor
            data-model-key="product"
            className="relative flex h-72 w-72 items-center justify-center rounded-full bg-linear-to-b from-white/80 to-white/40 shadow-2xl"
          >
            <div
              ref={(node) => {
                shineRef.current = node;
              }}
              className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0 blur-2xl"
            />
            <div aria-hidden className="relative h-[85%] w-[55%] opacity-0" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductRevealScene;

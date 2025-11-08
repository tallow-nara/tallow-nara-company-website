/** @format */

"use client";

import { useLayoutEffect, useRef } from "react";

import AnimatedText from "../(components)/AnimatedText";
import ThreeModelCanvas from "../(components)/ThreeModelCanvas";
import { gsap, registerGSAPPlugins } from "../lib/gsapConfig";

const OriginScene = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

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
          pin: true,
        },
      });

      timeline
        .fromTo(
          imageWrapperRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1.05, duration: 1.4, ease: "power2.out" }
        )
        .to(
          imageWrapperRef.current,
          { opacity: 0, scale: 1.1, duration: 1, ease: "power3.inOut" },
          "+=0.2"
        )
        .fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1.1, duration: 1.2, ease: "sine.inOut" },
          0.2
        )
        .to(
          glowRef.current,
          { opacity: 0, scale: 1.2, duration: 1, ease: "power1.in" },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
      }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#fbf5ec] to-[#f0e4d3] px-6"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 text-center">
        <div
          ref={(node) => {
            glowRef.current = node;
          }}
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(248,235,210,0.9),transparent_60%)]"
        />

        <AnimatedText
          text="Sapi Pilihan Nusantara"
          className="text-sm uppercase tracking-[0.5rem] text-zinc-600"
        />
        <h1 className="max-w-3xl text-4xl font-semibold text-zinc-900 sm:text-5xl">
          Sumber nutrisi alami dimulai dari sapi yang dirawat dengan penuh rasa
          hormat.
        </h1>
        <AnimatedText
          text="Perjalanan pelembap ini diawali dari peternakan keluarga, tempat ritual perawatan tradisional masih dijaga."
          className="max-w-2xl text-base text-zinc-600"
          delay={0.2}
        />
        <div
          ref={(node) => {
            imageWrapperRef.current = node;
          }}
          className="relative h-64 w-64"
        >
          <div className="pointer-events-none absolute -inset-6 rounded-full bg-white/20 blur-3xl" />
          <ThreeModelCanvas
            className="relative h-full w-full"
            modelPath="/assets/cow_1k.glb"
            modelScale={0.005}
            modelPosition={[0, 0, 0]}
            modelRotation={[0, Math.PI / 12, 0]}
            cameraPosition={[0.12, 0.4, 3.4]}
            autoRotateSpeed={0.0012}
          />
        </div>
      </div>
    </section>
  );
};

export default OriginScene;

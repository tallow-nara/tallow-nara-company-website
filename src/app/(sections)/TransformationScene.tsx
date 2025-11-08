/** @format */

"use client";

import { useLayoutEffect, useRef } from "react";

import AnimatedText from "../(components)/AnimatedText";
import ThreeModelCanvas from "../(components)/ThreeModelCanvas";
import { gsap, registerGSAPPlugins } from "../lib/gsapConfig";

const TransformationScene = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const meltTrailRef = useRef<HTMLDivElement | null>(null);

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
          particlesRef.current,
          { opacity: 0, y: 120, scale: 0.7, rotate: -4 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 1.4,
            ease: "power2.out",
          }
        )
        .to(particlesRef.current, {
          y: -160,
          scale: 1.2,
          filter: "blur(2px)",
          duration: 1.8,
          ease: "power1.inOut",
        })
        .fromTo(
          meltTrailRef.current,
          { opacity: 0, height: 0 },
          { opacity: 1, height: "100%", duration: 1.2, ease: "power1.in" },
          0.6
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
      }}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-linear-to-b from-[#f0e4d3] to-[#f7d9a8] px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_45%)]" />
      <div className="relative flex w-full max-w-6xl flex-col items-center gap-10 text-center">
        <AnimatedText
          text="Lemak Tallow Emas"
          className="text-sm uppercase tracking-[0.4rem] text-zinc-700"
        />
        <h2 className="max-w-3xl text-3xl font-bold text-zinc-900 sm:text-5xl">
          Lemak pilihan meleleh perlahan, memisahkan lapisan paling murni.
        </h2>
        <AnimatedText
          text="Kami mengawal proses penyulingan suhu rendah agar molekul aktif tetap utuh."
          className="max-w-2xl text-base text-zinc-700"
          delay={0.15}
        />
        <div className="relative flex h-72 w-full max-w-3xl items-center justify-center">
          <div
            ref={(node) => {
              meltTrailRef.current = node;
            }}
            className="absolute inset-y-6 w-36 rounded-full bg-gradient-to-b from-white/70 via-white/30 to-transparent"
          />
          <div
            ref={(node) => {
              particlesRef.current = node;
            }}
            className="relative h-60 w-60"
          >
            <div className="pointer-events-none absolute -inset-5 rounded-full bg-white/30 blur-3xl" />
            <ThreeModelCanvas
              className="relative h-full w-full"
              modelPath="/assets/fat_1k.glb"
              modelScale={0.95}
              modelPosition={[0, -0.25, 0]}
              modelRotation={[0.3, Math.PI / 8, 0]}
              cameraPosition={[0.15, 0.28, 2.9]}
              autoRotateSpeed={0.0015}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationScene;

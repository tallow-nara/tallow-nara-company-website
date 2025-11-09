/** @format */

"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger, registerGSAPPlugins } from "../lib/gsapConfig";

type ModelKey = "origin" | "transformation" | "product";

type HighlightConfig = {
  title: string;
  description: string;
  gradient: string;
  glow: string;
  accent: string;
};

const HIGHLIGHT_CONFIGS: Record<ModelKey, HighlightConfig> = {
  origin: {
    title: "Sumber Alami",
    description: "Sapi keluarga dan pakan organik menjaga kemurnian tallow.",
    gradient: "linear-gradient(135deg,#fdf0da 0%,#f5d4a5 45%,#fbd4c1 100%)",
    glow: "rgba(247,215,173,0.6)",
    accent: "#f7d9a8",
  },
  transformation: {
    title: "Ritual Peleburan",
    description: "Lemak meleleh perlahan, menyisakan sari emas paling halus.",
    gradient: "linear-gradient(135deg,#fde7cf 0%,#f4cfae 55%,#f0b999 100%)",
    glow: "rgba(240,185,153,0.55)",
    accent: "#f3b995",
  },
  product: {
    title: "Lapisan Akhir",
    description: "Balm lembut menyegel hidrasi dan memantulkan kilau alami.",
    gradient: "linear-gradient(135deg,#fff4e6 0%,#fbe1ca 50%,#ffd6c0 100%)",
    glow: "rgba(255,214,192,0.65)",
    accent: "#ffd6c0",
  },
};

const parseNumber = (value?: string, fallback = 0) => {
  if (value == null) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseOffset = (value?: string): [number, number] => {
  if (!value) {
    return [0, 0];
  }

  const parts = value.split(",").map((part) => Number(part.trim()));
  return [
    Number.isFinite(parts[0]) ? parts[0]! : 0,
    Number.isFinite(parts[1]) ? parts[1]! : 0,
  ];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const calculateDuration = (distance: number) =>
  clamp(0.25 + distance / 900, 0.35, 0.85);

const ScrollLinkedModel = () => {
  const followerRef = useRef<HTMLDivElement | null>(null);
  const activeAnchorRef = useRef<HTMLElement | null>(null);
  const activeKeyRef = useRef<ModelKey>("origin");
  const lastActivationRef = useRef(0);
  const [activeKey, setActiveKey] = useState<ModelKey>("origin");

  const activeConfig = HIGHLIGHT_CONFIGS[activeKey];

  useEffect(() => {
    registerGSAPPlugins();

    if (typeof window === "undefined") {
      return;
    }

    const ctx = gsap.context(() => {
      const follower = followerRef.current;

      if (!follower) {
        return;
      }

      const anchors = gsap.utils.toArray<HTMLElement>("[data-model-anchor]");

      if (!anchors.length) {
        return;
      }

      gsap.set(follower, { opacity: 0 });

      let positionTween: gsap.core.Tween | null = null;

      const animateToAnchor = (
        anchor: HTMLElement,
        options: { immediate?: boolean } = {}
      ) => {
        if (!followerRef.current) {
          return;
        }

        const { immediate = false } = options;
        const rect = anchor.getBoundingClientRect();

        const targetWidth =
          parseNumber(anchor.dataset.modelWidth, rect.width) ||
          follower.offsetWidth ||
          1;
        const targetHeight =
          parseNumber(anchor.dataset.modelHeight, rect.height) ||
          follower.offsetHeight ||
          1;
        const [offsetX, offsetY] = parseOffset(anchor.dataset.modelOffset);

        const targetX = rect.left + rect.width / 2 - targetWidth / 2 + offsetX;
        const targetY = rect.top + rect.height / 2 - targetHeight / 2 + offsetY;

        const followerRect = follower.getBoundingClientRect();
        const distance = Math.hypot(
          targetX - (followerRect.left ?? 0),
          targetY - (followerRect.top ?? 0)
        );
        const duration = immediate ? 0 : calculateDuration(distance);

        positionTween?.kill();
        positionTween = gsap.to(followerRef.current, {
          x: targetX,
          y: targetY,
          width: targetWidth,
          height: targetHeight,
          duration,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const activateAnchor = (
        anchor: HTMLElement,
        options: { immediate?: boolean } = {}
      ) => {
        const { immediate = false } = options;

        if (!immediate) {
          const now = performance.now();
          if (now - lastActivationRef.current < 220) {
            return;
          }
          lastActivationRef.current = now;
        }

        activeAnchorRef.current = anchor;
        animateToAnchor(anchor, { immediate });

        const nextKey = anchor.dataset.modelKey as ModelKey | undefined;

        if (
          nextKey &&
          nextKey in HIGHLIGHT_CONFIGS &&
          nextKey !== activeKeyRef.current
        ) {
          activeKeyRef.current = nextKey;
          setActiveKey(nextKey);
        }

        gsap.to(follower, {
          opacity: 1,
          duration: immediate ? 0 : 0.25,
          ease: "power2.out",
        });
      };

      const deactivateAnchor = (anchor: HTMLElement) => {
        if (activeAnchorRef.current !== anchor) {
          return;
        }

        activeAnchorRef.current = null;
        gsap.to(follower, { opacity: 0, duration: 0.3, ease: "power2.out" });
      };

      const triggers = anchors.map((anchor) =>
        ScrollTrigger.create({
          trigger: anchor,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => activateAnchor(anchor, { immediate: true }),
          onEnterBack: () => activateAnchor(anchor, { immediate: true }),
          onLeave: () => deactivateAnchor(anchor),
          onLeaveBack: () => deactivateAnchor(anchor),
          onUpdate: () => {
            if (activeAnchorRef.current === anchor) {
              animateToAnchor(anchor, { immediate: true });
            }
          },
        })
      );

      const initialAnchor = activeAnchorRef.current ?? anchors[0];
      activateAnchor(initialAnchor, { immediate: true });

      const refreshHandler = () => {
        if (activeAnchorRef.current) {
          animateToAnchor(activeAnchorRef.current, { immediate: true });
        }
      };

      ScrollTrigger.addEventListener("refresh", refreshHandler);

      const resizeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => {
              if (activeAnchorRef.current) {
                animateToAnchor(activeAnchorRef.current, { immediate: true });
              }
            })
          : null;

      anchors.forEach((anchor) => resizeObserver?.observe(anchor));

      const handleResize = () => {
        if (activeAnchorRef.current) {
          animateToAnchor(activeAnchorRef.current, { immediate: true });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        triggers.forEach((trigger) => trigger.kill());
        ScrollTrigger.removeEventListener("refresh", refreshHandler);
        resizeObserver?.disconnect();
        window.removeEventListener("resize", handleResize);
        positionTween?.kill();
      };
    });

    return () => ctx.revert();
  }, []);

  if (!activeConfig) {
    return null;
  }

  return (
    <div
      ref={followerRef}
      className="pointer-events-none fixed left-0 top-0 z-30 flex h-64 w-64 items-center justify-center md:h-72 md:w-72"
      aria-hidden
    >
      <div className="relative h-full w-full">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-white/5 blur-2xl" />
        <div className="relative h-full w-full overflow-hidden rounded-[3rem] border border-white/30 bg-white/5 p-6 text-white shadow-[0_45px_120px_rgba(15,23,42,0.25)] backdrop-blur">
          <div
            className="absolute inset-0 opacity-90"
            style={{ background: activeConfig.gradient }}
          />
          <div
            className="absolute -inset-6 blur-3xl"
            style={{ background: activeConfig.glow }}
            aria-hidden
          />
          <div
            className="absolute inset-3 rounded-[2.5rem] border opacity-60"
            style={{ borderColor: activeConfig.accent }}
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-xs uppercase tracking-[0.6rem] text-white/70">
              {activeConfig.title}
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              {activeConfig.description}
            </p>
            <div className="mt-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.8rem] text-white/60">
              <span className="h-px w-10 bg-white/40" aria-hidden />
              ritual
              <span className="h-px w-10 bg-white/40" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollLinkedModel;

/** @format */

"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger, registerGSAPPlugins } from "../lib/gsapConfig";
import ThreeModelCanvas from "./ThreeModelCanvas";

type Vec3 = [number, number, number];

type ModelConfig = {
  modelPath: string;
  modelScale?: number | Vec3;
  modelPosition?: Vec3;
  modelRotation?: Vec3;
  cameraPosition?: Vec3;
  autoRotateSpeed?: number;
};

type ModelKey = "origin" | "transformation" | "product";

// Jangan diubah lagi config ini
const MODEL_CONFIGS: Record<ModelKey, ModelConfig> = {
  origin: {
    modelPath: "/assets/cow_1k.glb",
    modelScale: 0.006,
    modelPosition: [0, 0, 0],
    modelRotation: [0, Math.PI / 12, 0],
    cameraPosition: [0.12, 0.4, 3.4],
    autoRotateSpeed: 0.0012,
  },
  transformation: {
    modelPath: "/assets/fat_1k.glb",
    modelScale: 2,
    modelPosition: [0, 0.2, 0],
    modelRotation: [0.3, Math.PI / 8, 0],
    cameraPosition: [0.15, 0.28, 2.9],
    autoRotateSpeed: 0.0015,
  },
  product: {
    modelPath: "/assets/cream_1k.glb",
    modelScale: 25,
    modelPosition: [0.2, 0.35, 0],
    modelRotation: [0.05, Math.PI / 5, 0],
    cameraPosition: [0.25, 0.35, 2.8],
    autoRotateSpeed: 0.0025,
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

const ScrollLinkedModel = () => {
  const followerRef = useRef<HTMLDivElement | null>(null);
  const activeAnchorRef = useRef<HTMLElement | null>(null);
  const activeKeyRef = useRef<ModelKey>("origin");
  const [activeKey, setActiveKey] = useState<ModelKey>("origin");

  const activeConfig = MODEL_CONFIGS[activeKey];

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

        positionTween?.kill();
        positionTween = gsap.to(followerRef.current, {
          x: targetX,
          y: targetY,
          width: targetWidth,
          height: targetHeight,
          duration: immediate ? 0 : 0.6,
          ease: "power3.out",
        });
      };

      const activateAnchor = (
        anchor: HTMLElement,
        options: { immediate?: boolean } = {}
      ) => {
        const { immediate = false } = options;
        activeAnchorRef.current = anchor;
        animateToAnchor(anchor, { immediate });

        const nextKey = anchor.dataset.modelKey as ModelKey | undefined;

        if (
          nextKey &&
          nextKey in MODEL_CONFIGS &&
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
        <ThreeModelCanvas
          className="relative h-full w-full"
          modelPath={activeConfig.modelPath}
          modelScale={activeConfig.modelScale}
          modelPosition={activeConfig.modelPosition}
          modelRotation={activeConfig.modelRotation}
          cameraPosition={activeConfig.cameraPosition}
          autoRotateSpeed={activeConfig.autoRotateSpeed}
        />
      </div>
    </div>
  );
};

export default ScrollLinkedModel;

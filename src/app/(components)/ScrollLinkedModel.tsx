/** @format */

"use client";

import { useLayoutEffect, useRef, useState } from "react";

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
    modelScale: 1,
    modelPosition: [0, -0.25, 0],
    modelRotation: [0.3, Math.PI / 8, 0],
    cameraPosition: [0.15, 0.28, 2.9],
    autoRotateSpeed: 0.0015,
  },
  product: {
    modelPath: "/assets/cream_1k.glb",
    modelScale: 12,
    modelPosition: [0, 0, 0],
    modelRotation: [0.05, Math.PI / 5, 0],
    cameraPosition: [0.25, 0.35, 2.8],
    autoRotateSpeed: 0.0025,
  },
};

const ScrollLinkedModel = () => {
  const followerRef = useRef<HTMLDivElement | null>(null);
  const activeAnchorRef = useRef<HTMLElement | null>(null);
  const activeKeyRef = useRef<ModelKey>("origin");
  const [activeKey, setActiveKey] = useState<ModelKey>("origin");

  const activeConfig = MODEL_CONFIGS[activeKey];

  useLayoutEffect(() => {
    registerGSAPPlugins();

    if (typeof window === "undefined") {
      return;
    }

    const ctx = gsap.context(() => {
      if (!followerRef.current) {
        return;
      }

      const anchors = gsap.utils.toArray<HTMLElement>("[data-model-anchor]");

      if (!anchors.length) {
        return;
      }

      const moveToAnchor = (
        anchor: HTMLElement,
        options: { immediate?: boolean } = {}
      ) => {
        if (!followerRef.current) {
          return;
        }

        const { immediate = false } = options;
        const followerWidth = followerRef.current.offsetWidth || 1;
        const followerHeight = followerRef.current.offsetHeight || 1;
        const rect = anchor.getBoundingClientRect();

        const targetX = rect.left + rect.width / 2 - followerWidth / 2;
        const targetY = rect.top + rect.height / 2 - followerHeight / 2;

        gsap.to(followerRef.current, {
          x: targetX,
          y: targetY,
          duration: immediate ? 0 : 1,
          ease: "power3.out",
        });

        const nextKey = anchor.dataset.modelKey as ModelKey | undefined;

        if (
          nextKey &&
          nextKey in MODEL_CONFIGS &&
          nextKey !== activeKeyRef.current
        ) {
          activeKeyRef.current = nextKey;
          setActiveKey(nextKey);
        }

        activeAnchorRef.current = anchor;
      };

      const triggers = anchors.map((anchor) =>
        ScrollTrigger.create({
          trigger: anchor,
          start: "top center",
          end: "bottom center",
          onEnter: () => moveToAnchor(anchor),
          onEnterBack: () => moveToAnchor(anchor),
        })
      );

      moveToAnchor(activeAnchorRef.current ?? anchors[0], { immediate: true });

      const refreshHandler = () => {
        if (activeAnchorRef.current) {
          moveToAnchor(activeAnchorRef.current, { immediate: true });
        }
      };

      ScrollTrigger.addEventListener("refresh", refreshHandler);

      return () => {
        triggers.forEach((trigger) => trigger.kill());
        ScrollTrigger.removeEventListener("refresh", refreshHandler);
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

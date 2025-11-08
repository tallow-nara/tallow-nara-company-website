/** @format */

"use client";

import { motion } from "framer-motion";

import ThreeModelCanvas from "./ThreeModelCanvas";

type ThreeProductModelProps = {
  className?: string;
  modelPath?: string;
  variant?: "card" | "plain";
};

const DEFAULT_MODEL_PATH = "/assets/cream_1k.glb";

const ThreeProductModel = ({
  className = "",
  modelPath = DEFAULT_MODEL_PATH,
  variant = "card",
}: ThreeProductModelProps) => {
  const isCard = variant === "card";
  const baseClass = isCard
    ? "relative flex h-64 w-32 flex-col items-center justify-end overflow-hidden rounded-[3rem] border border-white/30 bg-gradient-to-b from-white/80 via-white/50 to-white/10 p-4 text-center shadow-2xl backdrop-blur"
    : "relative flex h-full w-full items-center justify-center overflow-hidden";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`${baseClass} ${className}`}
    >
      {isCard ? (
        <>
          <div className="pointer-events-none absolute inset-x-2 top-6 h-6 rounded-full bg-white/70 blur-md" />
          <div className="pointer-events-none absolute inset-x-4 top-12 h-16 rounded-full bg-linear-to-r from-white/30 to-white/10 blur-2xl" />
        </>
      ) : null}
      <ThreeModelCanvas
        className="relative h-full w-full"
        modelPath={modelPath}
        modelScale={0.95}
        modelPosition={[0, -0.6, 0]}
        modelRotation={[0.05, Math.PI / 5, 0]}
        cameraPosition={[0.25, 0.35, 2.8]}
        autoRotateSpeed={0.0025}
      />
    </motion.div>
  );
};

export default ThreeProductModel;

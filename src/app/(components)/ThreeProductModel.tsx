/** @format */

"use client";

import { motion } from "framer-motion";

type ThreeProductModelProps = {
  className?: string;
  variant?: "card" | "plain";
  title?: string;
  description?: string;
};

const DEFAULT_TITLE = "Radiant Tallow";
const DEFAULT_DESCRIPTION =
  "Balm akhir yang menyegel nutrisi dari lemak tallow emas.";

const ThreeProductModel = ({
  className = "",
  variant = "card",
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
}: ThreeProductModelProps) => {
  const isCard = variant === "card";
  const baseClass = isCard
    ? "relative flex h-64 w-32 flex-col items-center justify-end overflow-hidden rounded-[3rem] border border-white/30 bg-gradient-to-b from-white/80 via-white/50 to-white/10 p-4 text-center shadow-2xl backdrop-blur"
    : "relative flex h-full w-full items-center justify-center overflow-hidden rounded-[3rem]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
      className={`${baseClass} ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-linear-to-b from-[#fff7ed] via-[#f9e3cc] to-[#f4c29e]" />
        <div className="absolute inset-3 rounded-[2rem] border border-white/40" />
        <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent)] blur-3xl" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-zinc-800">
          <p className="text-[0.65rem] uppercase tracking-[0.5rem] text-zinc-500">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-zinc-700">
            {description}
          </p>
          <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/20 text-[0.7rem] font-semibold tracking-[0.4rem] text-zinc-600">
            TN
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreeProductModel;

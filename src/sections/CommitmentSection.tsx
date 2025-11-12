/** @format */

"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./CommitmentSection.module.css";

const ease = [0.45, 0.05, 0.2, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease },
  },
};

const impactHighlights = [
  {
    title: "Petani lokal",
    icon: "🌾",
    description: "Kemitraan langsung dengan keluarga petani & peternak untuk bahan tallow dan botanikal.",
    value: 48,
    suffix: "+",
    footnote: "keluarga diberdayakan",
  },
  {
    title: "Hewan terlindungi",
    icon: "🐄",
    description: "Lemak sapi diperoleh dari peternak yang menerapkan animal welfare dan zero waste.",
    value: 120,
    suffix: "+",
    footnote: "sapi dirawat etis",
  },
  {
    title: "Hutan lestari",
    icon: "🌳",
    description: "Panen tengkawang mengikuti musim jatuh alami, menjaga 340 hektar hutan tetap rindang.",
    value: 340,
    suffix: "ha",
    footnote: "wilayah hutan dijaga",
  },
  {
    title: "Tanpa uji hewan",
    icon: "❌",
    description: "Seluruh formula diuji dermatologis & 100% cruelty-free.",
    value: 100,
    suffix: "%",
    footnote: "cruelty-free forever",
  },
];

function useAnimatedCounter(target: number, shouldStart: boolean) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 120, damping: 20 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (shouldStart) {
      motionValue.set(target);
    }
  }, [shouldStart, target, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) =>
      setValue(Math.round(latest)),
    );
    return () => unsubscribe();
  }, [springValue]);

  return value;
}

function ImpactCard({
  icon,
  title,
  description,
  value,
  suffix,
  footnote,
}: (typeof impactHighlights)[number]) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });
  const animatedValue = useAnimatedCounter(value, isInView);

  return (
    <motion.article
      ref={cardRef}
      className={styles.card}
      variants={itemVariants}
      whileHover={{ y: -6 }}
    >
      <span className={styles.cardIcon}>{icon}</span>
      <div className={styles.stat}>
        <strong>
          {animatedValue}
          <span>{suffix}</span>
        </strong>
        <span className={styles.footnote}>{footnote}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.article>
  );
}

export function CommitmentSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.6]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const planetSpin = useTransform(scrollYProgress, [0, 1], ["0deg", "15deg"]);

  return (
    <motion.section
      ref={sectionRef}
      className={styles.commitment}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className={styles.backgroundImage}>
        <motion.div
          className={styles.backgroundOverlay}
          style={{ opacity: overlayOpacity }}
        />
      </div>

      <div className={styles.inner}>
        <header className={styles.header}>
          <motion.span className={styles.eyebrow} variants={itemVariants}>
            Sustainability & Impact
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Lebih dari Sekadar Skincare
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            “Setiap produk yang Anda pilih membantu menjaga hutan, menguatkan petani & peternak
            lokal, serta melindungi keanekaragaman hayati.” Kami menjahit dampak positif mulai dari
            ladang hingga ke tanganmu.
          </motion.p>
          <motion.div className={styles.actions} variants={itemVariants}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              Pelajari Dampak Kami
            </motion.button>
          </motion.div>
        </header>

        <div className={styles.grid}>
          {impactHighlights.map((impact) => (
            <ImpactCard key={impact.title} {...impact} />
          ))}
        </div>
      </div>

      <motion.div className={styles.badge} style={{ y: badgeY }}>
        Gentle Ethics
      </motion.div>
      <motion.div className={styles.planet} style={{ rotate: planetSpin }}>
        <span />
      </motion.div>
    </motion.section>
  );
}

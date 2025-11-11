/** @format */

"use client";

import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./CommitmentSection.module.css";

const ease = [0.45, 0.05, 0.2, 1] as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.12 * custom, ease },
  }),
};

const impactIcons = [
  {
    icon: "🌾",
    title: "Petani Lokal",
    detail: "Kemitraan langsung dengan penghasil kelapa, tengkawang, dan rempah Nusantara.",
  },
  {
    icon: "🐄",
    title: "Hewan Terlindungi",
    detail: "Tallow diperoleh dari peternak etis yang memaksimalkan setiap bagian hewan.",
  },
  {
    icon: "🌳",
    title: "Hutan Lestari",
    detail: "Sebagian keuntungan dialokasikan untuk rehabilitasi hutan Kalimantan.",
  },
  {
    icon: "🐇",
    title: "Tanpa Uji Hewan",
    detail: "Seluruh batch diuji secara dermatologis tanpa melibatkan hewan.",
  },
];

const impactMetrics = [
  {
    label: "Petani & peternak mitra",
    value: 120,
    suffix: "+",
    detail: "keluarga diberdayakan di Jawa, Kalimantan, dan Sumatera.",
  },
  {
    label: "Hektar hutan yang dijaga",
    value: 75,
    suffix: " ha",
    detail: "melalui program adopsi pohon tengkawang dan lavender.",
  },
  {
    label: "Batch mikro tanpa uji hewan",
    value: 240,
    suffix: "+",
    detail: "diproduksi setiap tahun di studio bersertifikasi BPOM.",
  },
];

export function CommitmentSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-150px" });
  const [counts, setCounts] = useState(() => impactMetrics.map(() => 0));

  useEffect(() => {
    if (!isInView) {
      return;
    }

    let frame: number;
    const start = performance.now();
    const duration = 1800;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCounts(
        impactMetrics.map((metric) =>
          Math.round(metric.value * progress),
        ),
      );
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  return (
    <motion.section
      ref={sectionRef}
      className={styles.commitment}
      data-scroll-scene="commitment"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className={styles.backgroundImage}>
        <div className={styles.backgroundOverlay} />
      </div>

      <motion.div
        className={styles.globe}
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      />

      <div className={styles.inner}>
        <header className={styles.header}>
          <motion.span className={styles.eyebrow} variants={variants}>
            Sustainability & Impact
          </motion.span>
          <motion.h2 className={styles.title} variants={variants} custom={1}>
            Lebih dari Sekadar Skincare
          </motion.h2>
          <motion.p className={styles.description} variants={variants} custom={2}>
            Setiap produk yang Anda pilih membantu menjaga hutan, menguatkan petani & peternak lokal,
            serta melindungi keanekaragaman hayati Nusantara.
          </motion.p>
        </header>

        <div className={styles.metrics}>
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className={styles.metricCard}
              variants={variants}
              custom={index + 3}
            >
              <span className={styles.metricValue}>
                {counts[index]}
                <span className={styles.metricSuffix}>{metric.suffix}</span>
              </span>
              <span className={styles.metricLabel}>{metric.label}</span>
              <p>{metric.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className={styles.grid}>
          {impactIcons.map((impact, index) => (
            <motion.article
              key={impact.title}
              className={styles.card}
              variants={variants}
              custom={index + 6}
              whileHover={{ y: -6 }}
            >
              <span className={styles.icon}>{impact.icon}</span>
              <h3>{impact.title}</h3>
              <p>{impact.detail}</p>
            </motion.article>
          ))}
        </div>

        <motion.button
          className={styles.ctaButton}
          variants={variants}
          custom={10}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Pelajari Dampak Kami
        </motion.button>
      </div>
    </motion.section>
  );
}

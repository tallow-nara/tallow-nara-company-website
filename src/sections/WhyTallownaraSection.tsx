/** @format */

"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import styles from "./WhyTallownaraSection.module.css";

const easeInOut = [0.42, 0, 0.2, 1] as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.1 * custom, ease: easeInOut },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, delay: 0.1 * custom, ease: easeInOut },
  }),
};

const pillars = [
  {
    title: "Alam sebagai sumber penyembuhan",
    description:
      "Bahan-bahan kami dipilih dari hutan, laut, dan kebun Nusantara yang dirawat dengan penuh hormat.",
    icon: "🌿",
    detail: "Kelembutan alami untuk kulit rapuh dan sensitif.",
  },
  {
    title: "Keberlanjutan ekosistem",
    description:
      "Setiap panen mendukung petani, peternak, dan penyerbuk yang menjaga keseimbangan alam.",
    icon: "🐝",
    detail: "Kemitraan langsung memastikan praktik tanam dan ternak yang lestari.",
  },
  {
    title: "Kelembutan untuk kulit sensitif",
    description:
      "Formula bebas bahan keras, memprioritaskan tekstur yang nyaman untuk bayi hingga dewasa.",
    icon: "🧴",
    detail: "Proses slow-crafted menjaga potensi nutrisi tetap utuh.",
  },
  {
    title: "Cinta & tanggung jawab sosial",
    description:
      "Tallownara adalah gerakan kecil yang menguatkan komunitas ibu, perajin, dan UMKM daerah.",
    icon: "💚",
    detail: "Setiap pembelian mendukung beasiswa anak petani dan program tanam pohon.",
  },
];

export function WhyTallownaraSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setCursor({ x, y });
    },
    [],
  );

  return (
    <motion.section
      ref={sectionRef}
      className={styles.why}
      data-scroll-scene="why"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      onMouseMove={handleMouseMove}
    >
      <div
        className={styles.cursorGlow}
        style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
        aria-hidden="true"
      />
      <motion.div className={styles.parallaxLayer} style={{ y: parallaxY }}>
        <span className={`${styles.parallaxLeaf} ${styles.leafOne}`} />
        <span className={`${styles.parallaxLeaf} ${styles.leafTwo}`} />
      </motion.div>

      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            variants={headerVariants}
            custom={0}
          >
            Why Tallownara
          </motion.span>

          <motion.h2
            className={styles.title}
            variants={headerVariants}
            custom={1}
          >
            Mengapa Tallownara Hadir
          </motion.h2>

          <motion.p
            className={styles.description}
            variants={headerVariants}
            custom={2}
          >
            Kami percaya bahwa perawatan sejati dimulai dari menghormati bumi
            tempat kita berpijak. Filosofi Tallownara bertumpu pada harmoni
            antara ibu, anak, dan alam yang saling menyembuhkan.
          </motion.p>

          <motion.span
            className={styles.divider}
            variants={headerVariants}
            custom={3}
          />
        </div>

        <div className={styles.grid}>
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              className={styles.card}
              variants={cardVariants}
              custom={index + 1}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <div className={styles.iconCircle} aria-hidden="true">
                {pillar.icon}
              </div>
              <h3 className={styles.cardTitle}>{pillar.title}</h3>
              <p className={styles.cardDescription}>{pillar.description}</p>
              <p className={styles.cardDetail}>{pillar.detail}</p>
              <Image
                src="https://placehold.co/500x350/fffdf7/c6d2ae?text=Botanical+Texture"
                alt="Botanical texture"
                width={500}
                height={350}
                className={styles.cardTexture}
                unoptimized
              />
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

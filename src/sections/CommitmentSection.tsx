/** @format */

"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
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

const commitments = [
  {
    title: "Tanpa Paraben, Pewarna Sintetis, Minyak Sawit",
    detail: "Formula kami murni dari tallow, botanical oils, serta ekstrak alami yang bersahabat dengan kulit sensitif.",
  },
  {
    title: "Tidak Diuji pada Hewan",
    detail: "Produk Tallownara melalui uji klinis dermatologis tanpa melibatkan hewan percobaan.",
  },
  {
    title: "Mendukung Petani & Peternak Lokal",
    detail: "Tallow Tuban, tengkawang Kalimantan, dan lavender Tasikmalaya kami peroleh secara fair-trade.",
  },
  {
    title: "Produksi Bersertifikat BPOM",
    detail: "Setiap batch dibuat dalam fasilitas higienis, teruji, dan tercatat resmi.",
  },
];

export function CommitmentSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.6]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -20]);

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
            Commitment
          </motion.span>
          <motion.h2 className={styles.title} variants={itemVariants}>
            Komitmen Kami
          </motion.h2>
          <motion.p className={styles.description} variants={itemVariants}>
            Kami menjaga setiap ritual perawatan Tallownara tetap etis, bersih, dan penuh empati
            terhadap bumi serta komunitas yang merawatnya.
          </motion.p>
        </header>

        <div className={styles.grid}>
          {commitments.map((commitment) => (
            <motion.article
              key={commitment.title}
              className={styles.card}
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className={styles.cardGlow} />
              <h3>{commitment.title}</h3>
              <p>{commitment.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <motion.div className={styles.badge} style={{ y: badgeY }}>
        Gentle Ethics
      </motion.div>
    </motion.section>
  );
}

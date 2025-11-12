/** @format */

"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
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
      "Kami hanya mengambil secukupnya dan mengembalikan sisanya, memastikan setiap bahan membawa manfaat tanpa meninggalkan luka pada bumi.",
    icon: "🌿",
    detail: "Bahan-bahan dipanen musiman dan diproses dalam batch kecil.",
  },
  {
    title: "Keberlanjutan & ekosistem",
    description:
      "Kerja sama dengan petani, peternak, dan penyuling lokal menjaga rantai pasok tetap adil sekaligus melindungi biodiversitas Nusantara.",
    icon: "🐝",
    detail: "Pendanaan ulang untuk program penanaman tengkawang dan pakan ternak alami.",
  },
  {
    title: "Kelembutan untuk kulit sensitif",
    description:
      "Formula Tallownara minim bahan, tanpa pewangi sintetis, dan meresap seperti pelukan hangat agar kulit sensitif merasa aman.",
    icon: "🧴",
    detail: "Setiap produk diuji pada sukarelawan dengan skin barrier rapuh.",
  },
  {
    title: "Cinta & tanggung jawab sosial",
    description:
      "Kami percaya kecantikan sejati lahir saat komunitas ikut tumbuh—dari upah adil hingga dukungan untuk ibu-ibu peracik.",
    icon: "💚",
    detail: "Sebagian keuntungan dialokasikan untuk kelas literasi dan wirausaha ibu.",
  },
];

export function WhyTallownaraSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <motion.section
      ref={sectionRef}
      className={styles.why}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
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
            Philosophy
          </motion.span>

          <motion.h2 className={styles.title} variants={headerVariants} custom={1}>
            Mengapa Tallownara Hadir
          </motion.h2>

          <motion.p
            className={styles.description}
            variants={headerVariants}
            custom={2}
          >
            Kami percaya bahwa perawatan sejati dimulai dari menghormati bumi tempat kita berpijak.
            Filosofi Tallownara hadir untuk menghadirkan kelembutan di kulit sekaligus menumbuhkan
            kehidupan yang lebih seimbang di Nusantara.
          </motion.p>

          <motion.span className={styles.divider} variants={headerVariants} custom={3} />
          <motion.p className={styles.subtitle} variants={headerVariants} custom={4}>
            Empat pilar Tallownara
          </motion.p>
        </div>

        <div className={styles.grid}>
          {pillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              className={styles.card}
              variants={cardVariants}
              custom={index + 1}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
              <span className={styles.cardIcon}>{pillar.icon}</span>
              <h3 className={styles.cardTitle}>{pillar.title}</h3>
              <p className={styles.cardDescription}>{pillar.description}</p>
              <p className={styles.cardDetail}>{pillar.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

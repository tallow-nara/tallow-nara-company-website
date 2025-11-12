/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./CertificationSection.module.css";

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 * custom, ease: [0.45, 0.05, 0.2, 1] },
  }),
};

const badges = [
  {
    label: "BPOM",
    icon: "✅",
    description: "Diproduksi dalam fasilitas higienis dengan batch kecil yang terstandar.",
  },
  {
    label: "Organik",
    icon: "🌱",
    description: "Bahan utama berasal dari kebun tanpa pestisida sintetis dan panen musiman.",
  },
  {
    label: "Halal",
    icon: "🕋",
    description: "Proses peracikan mengikuti tata cara halal dan transparan.",
  },
  {
    label: "Cruelty-Free",
    icon: "🐇",
    description: "Tidak ada uji coba pada hewan dan bahan ditelusuri hingga sumbernya.",
  },
];

export function CertificationSection() {
  return (
    <motion.section
      className={styles.certification}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span className={styles.eyebrow} variants={badgeVariants}>
            Quality Proof
          </motion.span>
          <motion.h2 className={styles.title} variants={badgeVariants} custom={1}>
            Dibuat dengan Hati dan Standar Tinggi
          </motion.h2>
          <motion.p className={styles.description} variants={badgeVariants} custom={2}>
            Setiap produk Tallownara dibuat dalam batch kecil, diawasi langsung oleh ibu-ibu peracik,
            kemudian melewati pengujian keamanan kulit dan dokumentasi yang transparan.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {badges.map((badge, index) => (
            <motion.article
              key={badge.label}
              className={styles.card}
              variants={badgeVariants}
              custom={index + 3}
              whileHover={{ y: -6 }}
            >
              <span className={styles.icon}>{badge.icon}</span>
              <h3>{badge.label}</h3>
              <p>{badge.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

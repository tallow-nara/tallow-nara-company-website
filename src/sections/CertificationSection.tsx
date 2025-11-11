/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./CertificationSection.module.css";

const variants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 * custom, ease: [0.42, 0, 0.2, 1] },
  }),
};

const badges = [
  { title: "BPOM", icon: "✅", description: "Terdaftar & diawasi batch demi batch." },
  { title: "Organik", icon: "🌱", description: "Botanikal berasal dari kebun tanpa pestisida keras." },
  { title: "Halal", icon: "🕋", description: "Diproduksi sesuai standar halal & higienitas." },
  { title: "Cruelty-Free", icon: "🐇", description: "Tidak ada uji coba pada hewan." },
];

const qualityPoints = [
  "Produksi batch kecil menjaga kesegaran & konsistensi.",
  "Setiap alat disterilkan dan dicatat dalam log kualitas.",
  "Bahan disimpan pada suhu terkontrol untuk menjaga potensi.",
];

export function CertificationSection() {
  return (
    <motion.section
      className={styles.certification}
      data-scroll-scene="certification"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span className={styles.eyebrow} variants={variants}>
            Certification & Quality
          </motion.span>
          <motion.h2 className={styles.title} variants={variants} custom={1}>
            Dibuat dengan hati dan standar tinggi
          </motion.h2>
          <motion.p className={styles.description} variants={variants} custom={2}>
            Setiap produk Tallownara dibuat dalam batch kecil di studio higienis bersertifikasi.
            Kami memastikan bahan alami terbaik siap menyapa kulit dan hati Anda.
          </motion.p>
        </div>

        <motion.div className={styles.badgeGrid} variants={variants} custom={3}>
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              className={styles.badge}
              variants={variants}
              custom={index + 4}
            >
              <span className={styles.badgeIcon}>{badge.icon}</span>
              <h3>{badge.title}</h3>
              <p>{badge.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.ul className={styles.qualityList} variants={variants} custom={8}>
          {qualityPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
}

/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import styles from "./CTASection.module.css";

const variants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.15 * custom, ease: [0.42, 0, 0.2, 1] },
  }),
};

export function CTASection() {
  return (
    <motion.section
      className={styles.cta}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div className={styles.inner} variants={variants}>
        <motion.span className={styles.eyebrow} variants={variants} custom={0}>
          Join the Movement
        </motion.span>
        <motion.h2 className={styles.title} variants={variants} custom={1}>
          Bagian dari Perubahan
        </motion.h2>
        <motion.p className={styles.description} variants={variants} custom={2}>
          “Melalui setiap pembelian, Anda turut menumbuhkan kehidupan yang lebih selaras dengan bumi.”
          Kami mengundangmu menjadi penjaga kelembutan bersama Tallownara.
        </motion.p>
        <motion.div className={styles.actions} variants={variants} custom={3}>
          <motion.button
            className={`${styles.button} ${styles.primary}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Gabung Komunitas Tallownara
          </motion.button>
          <motion.button
            className={`${styles.button} ${styles.secondary}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Ikuti Kami di Instagram
          </motion.button>
        </motion.div>
        <motion.div
          className={styles.sprout}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.42, 0, 0.2, 1], delay: 0.3 }}
        >
          <span className={styles.seed} />
          <span className={styles.leaf} />
          <span className={styles.leaf} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

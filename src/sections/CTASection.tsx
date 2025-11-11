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
  const actions = [
    { label: "Gabung Komunitas Tallownara", variant: styles.primary, href: "#" },
    { label: "Ikuti Kami di Instagram", variant: styles.secondary, href: "#" },
  ];

  return (
    <motion.section
      className={styles.cta}
      data-scroll-scene="cta"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div
        className={styles.sprout}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.42, 0, 0.2, 1] }}
      >
        <span className={styles.leaf} />
        <span className={styles.leaf} />
        <span className={styles.seed} />
      </motion.div>
      <motion.div className={styles.inner} variants={variants}>
        <motion.span className={styles.eyebrow} variants={variants} custom={0}>
          Join the Movement
        </motion.span>
        <motion.h2 className={styles.title} variants={variants} custom={1}>
          Bergabunglah dalam gerakan perawatan lembut yang menumbuhkan kehidupan lebih selaras
          dengan bumi.
        </motion.h2>
        <motion.p className={styles.description} variants={variants} custom={2}>
          Melalui setiap pembelian, Anda turut menumbuhkan program pemberdayaan ibu, petani,
          dan penanaman pohon di daerah sumber bahan kami.
        </motion.p>
        <motion.div className={styles.actions} variants={variants} custom={3}>
          {actions.map((action) => (
            <motion.a
              key={action.label}
              href={action.href}
              className={`${styles.button} ${action.variant}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              {action.label}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

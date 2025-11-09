/** @format */

"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import styles from "./HeroSection.module.css";

const cubicEase = [0.25, 0.1, 0.25, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: custom, ease: cubicEase },
  }),
};

const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: cubicEase },
  },
};

export function HeroSection() {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <motion.section
      className={styles.hero}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={styles.background} style={{ y: parallaxY }}>
        <div className={styles.backgroundGradient} />
        <div className={`${styles.cloud} ${styles.cloudOne}`} />
        <div className={`${styles.cloud} ${styles.cloudTwo}`} />
        <div className={`${styles.leaf} ${styles.leafOne}`} />
        <div className={`${styles.leaf} ${styles.leafTwo}`} />
      </motion.div>

      <div className={styles.inner}>
        <div className={styles.content}>
          <motion.div variants={fadeUp} custom={0}>
            <div className={styles.logo}>
              <span className={styles.logoDot} />
              Tallownara
            </div>
          </motion.div>

          <motion.h1 className={styles.heading} variants={fadeUp} custom={0.1}>
            Lahir dari Cinta Seorang Ibu
          </motion.h1>

          <motion.p
            className={styles.description}
            variants={fadeUp}
            custom={0.2}
          >
            Terinspirasi dari perjalanan seorang ibu di Bogor yang menemukan
            perawatan alami untuk anaknya, Tallownara menghadirkan kelembutan
            alam Nusantara dalam setiap sentuhan.
          </motion.p>

          <motion.div
            className={styles.ctaGroup}
            variants={fadeUp}
            custom={0.3}
          >
            <motion.button
              className={`${styles.button} ${styles.primaryButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Now
            </motion.button>
            <motion.button
              className={`${styles.button} ${styles.secondaryButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Our Story
            </motion.button>
          </motion.div>
        </div>

        <div className={styles.visuals}>
          <motion.div
            className={styles.illustrationFrame}
            variants={fadeUp}
            custom={0.2}
          >
            <Image
              src="https://placehold.co/700x500"
              alt="Ilustrasi ibu dan anak Tallownara"
              fill
              className={styles.illustration}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          </motion.div>

          <motion.div className={styles.productCard} variants={zoomIn}>
            <span className={styles.floatingBadge}>Handcrafted in Bogor</span>
            <div className={styles.productImageWrapper}>
              <Image
                src="https://placehold.co/400x400"
                alt="Tallownara hero product"
                width={280}
                height={280}
                className={styles.productImage}
                unoptimized
              />
            </div>
            <p className={styles.productLabel}>Sabun Lembut Tallownara</p>
            <p className={styles.productNote}>
              Diformulasikan dari tallow, madu, dan botanikal Nusantara.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

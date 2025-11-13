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

const storyHighlight = {
  label: "Natural Ritual",
  title: "Tallownara Story",
  description:
    "Perpaduan tallow Nusantara, illipe, dan rempah yang meneduhkan untuk menghadirkan jeda hening di sela hari.",
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

      <motion.div
        className={`${styles.cornerLogo}`}
        variants={fadeUp}
        custom={0}
      >
        <Image
          src="/assets/logo-landscape.png"
          alt="Tallownara logo"
          width={200}
          height={200}
          className={styles.logoImage}
          priority
        />
      </motion.div>

      <div className={styles.inner}>
        <div className={styles.content}>
          <motion.h1 className={styles.heading} variants={fadeUp} custom={0.1}>
            “From the treasures of Nusantara’s biodiversity, lovingly made for
            your hands.”
          </motion.h1>

          <motion.p
            className={styles.description}
            variants={fadeUp}
            custom={0.2}
          >
            Tallownara menghadirkan sabun, balm, dan lotion dengan cahaya pagi
            Bogor, tallow Tuban, serta botanikal Kalimantan yang sarat makna.
            Semua dimulai dari kasih seorang ibu yang mencari perawatan paling
            lembut bagi buah hatinya.
          </motion.p>

          <motion.p className={styles.tagline} variants={fadeUp} custom={0.25}>
            “Dari alam Nusantara, kembali ke kulitmu dengan penuh cinta.”
          </motion.p>
        </div>

        <div className={styles.visuals}>
          <motion.div
            className={styles.visualFocus}
            variants={fadeUp}
            custom={0.15}
          >
            <div className={styles.illustrationFrame}>
              <Image
                src="/assets/product/ProductTallow.jpg"
                alt="Ilustrasi kisah Tallownara"
                fill
                className={styles.illustration}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>

            <div className={styles.storyCard}>
              <span className={styles.storyLabel}>{storyHighlight.label}</span>
              <h3 className={styles.storyTitle}>{storyHighlight.title}</h3>
              <p className={styles.storyCopy}>{storyHighlight.description}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

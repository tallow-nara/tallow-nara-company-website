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
  const productHighlights = [
    {
      title: "Sabun Artisan",
      detail: "Membersihkan tanpa mengganggu skin barrier bayi & ibu.",
    },
    {
      title: "Comfort Balm",
      detail: "Mengatasi kulit kering dengan tekstur lembut meleleh.",
    },
    {
      title: "Lavender Lotion",
      detail: "Aroma Tasikmalaya yang menenangkan ritual malam.",
    },
  ];

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <motion.section
      className={styles.hero}
      data-scroll-scene="hero"
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
          <motion.span className={styles.kicker} variants={fadeUp} custom={0.05}>
            Dari Alam untuk Kulitmu
          </motion.span>

          <motion.h1 className={styles.heading} variants={fadeUp} custom={0.1}>
            Sentuhan lembut yang lahir dari kekayaan hayati Nusantara
          </motion.h1>

          <motion.p className={styles.tagline} variants={fadeUp} custom={0.15}>
            From the treasures of Nusantara’s biodiversity, lovingly made for your hands.
          </motion.p>

          <motion.p
            className={styles.description}
            variants={fadeUp}
            custom={0.25}
          >
            Terinspirasi oleh perjalanan seorang ibu dari Bogor hingga
            Tasikmalaya, Tallownara memadukan tallow, botanikal tropis, dan
            cahaya pagi yang menenangkan menjadi ritual perawatan yang hangat
            bagi keluarga Anda.
          </motion.p>

          <motion.ul className={styles.productHighlights} variants={fadeUp} custom={0.3}>
            {productHighlights.map((highlight) => (
              <li key={highlight.title}>
                <strong>{highlight.title}</strong>
                <span>{highlight.detail}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className={styles.ctaGroup}
            variants={fadeUp}
            custom={0.35}
          >
            <motion.button
              className={`${styles.button} ${styles.primaryButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Temukan Produk Kami
            </motion.button>
            <motion.button
              className={`${styles.button} ${styles.secondaryButton}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Pelajari Kisah Kami
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
            <span className={styles.floatingBadge}>
              Sabun · Balm · Lotion
            </span>
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
            <p className={styles.productLabel}>Seri Botanical Tallownara</p>
            <p className={styles.productNote}>
              Diformulasikan dari tallow Tuban, illipe Kalimantan, dan lavender
              Tasikmalaya.
            </p>
            <div className={styles.productChips}>
              {["Radiant Glow", "Calming Touch", "Slow-crafted"].map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

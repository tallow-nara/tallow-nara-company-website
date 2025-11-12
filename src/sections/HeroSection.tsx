/** @format */

"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
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

const floatingCards: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 * custom, ease: cubicEase },
  }),
};

const heroProducts = [
  {
    name: "Bogor Tallow Soap",
    description: "Sabun padat lembut dengan busa creamy dan aroma daun jeruk.",
    image: "https://placehold.co/420x520/fcf7ee/2e2b26?text=Soap",
    badge: "Sabun",
  },
  {
    name: "Illipe Comfort Balm",
    description: "Balm serbaguna yang menenangkan kulit kering & sensitif.",
    image: "https://placehold.co/420x520/f4efe7/2e2b26?text=Balm",
    badge: "Balm",
  },
  {
    name: "Lavender Dew Lotion",
    description: "Lotion ringan dengan lavender Tasikmalaya untuk malam damai.",
    image: "https://placehold.co/420x520/f4f1fa/2e2b26?text=Lotion",
    badge: "Lotion",
  },
];

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
          <motion.span className={styles.eyebrow} variants={fadeUp} custom={0}>
            Dari Alam untuk Kulitmu
          </motion.span>
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
              src="https://placehold.co/700x500/f6f1e8/996544?text=Tallownara+Story"
              alt="Ilustrasi kisah Tallownara"
              fill
              className={styles.illustration}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              unoptimized
            />
          </motion.div>

          <div className={styles.productCluster}>
            {heroProducts.map((product, index) => (
              <motion.article
                key={product.name}
                className={styles.productCard}
                variants={floatingCards}
                custom={index + 1}
                whileHover={{ y: -6, rotate: 0 }}
              >
                <motion.span
                  className={styles.cardBadge}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  {product.badge}
                </motion.span>
                <div className={styles.productImageWrapper}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={260}
                    height={320}
                    className={styles.productImage}
                    unoptimized
                  />
                </div>
                <h3 className={styles.productLabel}>{product.name}</h3>
                <p className={styles.productNote}>{product.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

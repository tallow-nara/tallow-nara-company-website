/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import styles from "./ProductHighlightSection.module.css";

const cubicEase = [0.45, 0.05, 0.2, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: cubicEase },
  },
};

const products = [
  {
    name: "Bogor Tallow Soap",
    category: "Sabun Padat",
    description:
      "Membersihkan dengan lembut tanpa menghilangkan lapisan pelindung kulit bayi dan ibu.",
    benefits: ["Menutrisi dengan tallow organik", "Menjaga kelembapan alami", "Aroma lavender menenangkan"],
    image: "https://placehold.co/400x400/eee4d6/2e2b26?text=Sabun",
    cta: "View Details",
  },
  {
    name: "Illipe Comfort Balm",
    category: "Balm",
    description:
      "Balm multifungsi yang meredakan kulit kering sekaligus melindungi dari iritasi ringan.",
    benefits: ["Mentega Illipe Kalimantan", "Tanpa petroleum & parafin", "Tekstur meleleh di kulit"],
    image: "https://placehold.co/400x400/f1eadc/2e2b26?text=Balm",
    cta: "Add to Cart",
  },
  {
    name: "Lavender Dew Lotion",
    category: "Lotion",
    description:
      "Krim losion ringan dengan sentuhan lavender Tasikmalaya untuk ritual malam yang menenangkan.",
    benefits: ["Menyerap cepat tanpa lengket", "Kaya antioksidan & humektan", "Cocok untuk kulit sensitif"],
    image: "https://placehold.co/400x400/f5f1e8/2e2b26?text=Lotion",
    cta: "View Details",
  },
];

export function ProductHighlightSection() {
  return (
    <motion.section
      className={styles.products}
      data-scroll-scene="highlight"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span className={styles.eyebrow} variants={cardVariants}>
            Product Highlight
          </motion.span>
          <motion.h2 className={styles.title} variants={cardVariants}>
            Kelembutan Alami yang Menyentuh
          </motion.h2>
          <motion.p className={styles.description} variants={cardVariants}>
            Setiap produk Tallownara lahir dari tangan ibu yang penuh kasih, menggabungkan
            tallow, botanikal Nusantara, dan proses artisan untuk menjaga kulit keluarga Anda.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              className={styles.card}
              variants={cardVariants}
              custom={index}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <div className={styles.visual}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className={styles.image}
                  unoptimized
                />
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                <p className={styles.cardDescription}>{product.description}</p>

                <ul className={styles.benefits}>
                  {product.benefits.map((benefit) => (
                    <li key={benefit}>
                      <span />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={styles.button}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {product.cta}
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

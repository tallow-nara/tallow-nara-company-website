/** @format */

"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
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
    longDescription:
      "Sabun handmade dengan kombinasi tallow Tuban, minyak kelapa Sumatera, dan madu hutan untuk menjaga skin barrier keluarga.",
    benefits: [
      { label: "Barrier Relief", detail: "Tallow organik + madu menjaga lapisan lipid.", icon: "🛡️" },
      { label: "Calming Lather", detail: "Lavender Tasik menenangkan pikiran.", icon: "🌸" },
      { label: "Zero Stripping", detail: "pH seimbang untuk kulit bayi.", icon: "💧" },
    ],
    image: "https://placehold.co/400x400/eee4d6/2e2b26?text=Sabun",
    ritual: "Busakan lembut, pijat perlahan, bilas dengan air hangat.",
    testimonial: {
      quote: "Kulit anak saya yang sensitif tidak lagi memerah setelah mandi.",
      author: "Alya – Bogor",
    },
  },
  {
    name: "Illipe Comfort Balm",
    category: "Balm",
    description:
      "Balm multifungsi yang meredakan kulit kering sekaligus melindungi dari iritasi ringan.",
    longDescription:
      "Mentega tengkawang berpadu dengan minyak biji anggur untuk melembapkan area kasar, bibir, hingga bekas luka ringan.",
    benefits: [
      { label: "Forest Butter", detail: "Illipe Kalimantan mengunci hidrasi 24 jam.", icon: "🌳" },
      { label: "Healing Touch", detail: "Infused chamomile untuk meredakan iritasi.", icon: "🪶" },
      { label: "Travel Friendly", detail: "Bisa diaplikasikan dari kepala hingga kaki.", icon: "🧳" },
    ],
    image: "https://placehold.co/400x400/f1eadc/2e2b26?text=Balm",
    ritual: "Hangatkan di telapak tangan, tekan ke area kering saat dibutuhkan.",
    testimonial: {
      quote: "Bagus sekali untuk ruam dan siku pecah-pecah keluargaku.",
      author: "Dinda – Bandung",
    },
  },
  {
    name: "Lavender Dew Lotion",
    category: "Lotion",
    description:
      "Krim losion ringan dengan sentuhan lavender Tasikmalaya untuk ritual malam yang menenangkan.",
    longDescription:
      "Lotion airy dengan hyaluronic acid nabati dan lavender Tasikmalaya yang memanjakan kulit sebelum tidur.",
    benefits: [
      { label: "Featherlight", detail: "Tekstur watery cream menyerap cepat.", icon: "☁️" },
      { label: "Sleep Ritual", detail: "Lavender membantu tubuh rileks.", icon: "🌙" },
      { label: "Glow Finish", detail: "Squalane memberi kilau sehat tanpa rasa lengket.", icon: "✨" },
    ],
    image: "https://placehold.co/400x400/f5f1e8/2e2b26?text=Lotion",
    ritual: "Aplikasikan usai mandi sore, lanjutkan dengan pijatan singkat di bahu.",
    testimonial: {
      quote: "Rasanya seperti pelukan hangat sebelum tidur.",
      author: "Zahra – Jakarta",
    },
  },
];

export function ProductHighlightSection() {
  const [activeProduct, setActiveProduct] =
    useState<(typeof products)[number] | null>(null);

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
              whileHover={{ y: -8, rotateX: 2 }}
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
                    <li key={benefit.label}>
                      <button
                        type="button"
                        className={styles.benefitChip}
                        data-tooltip={benefit.detail}
                        aria-label={benefit.detail}
                      >
                        <span className={styles.benefitIcon}>{benefit.icon}</span>
                        {benefit.label}
                      </button>
                    </li>
                  ))}
                </ul>

                <motion.button
                  className={styles.button}
                  onClick={() => setActiveProduct(product)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Lihat Detail
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProduct && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProduct(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: cubicEase }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={() => setActiveProduct(null)}
                aria-label="Tutup detail produk"
              >
                ✕
              </button>
              <span className={styles.modalCategory}>{activeProduct.category}</span>
              <h3>{activeProduct.name}</h3>
              <p>{activeProduct.longDescription}</p>
              <div className={styles.modalRitual}>
                <h4>Ritual</h4>
                <p>{activeProduct.ritual}</p>
              </div>
              <blockquote className={styles.modalTestimonial}>
                “{activeProduct.testimonial.quote}”
                <cite>{activeProduct.testimonial.author}</cite>
              </blockquote>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

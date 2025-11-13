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
    name: "Tallow Balm",
    category: "Balm",
    description:
      "A Daily moisturizer, face cream, baby lotion, deep conditioning treatment for hair, sunburn and diaper rash.",
    benefits: ["Beef tallow from 100% grass fed cows", "Organic certified extra virgin olive oil", "true lavender essential oil"],
    image: "/assets/product/ProductTallow.jpg",
    accent: "#f0e3d4",
    detail: {
      intro:
        "Enjoy our small-batch made, grass-fed, tallow balm. The texture is light, allowing the balm to absorb right on skin contact. We always package in reusable glass jars.",
      ritual: "Apply a small amount on your dry area to provide occlusive, nourishing protective layer to your skin and seal in your skincare for optimal results.",
      testimonial: {
        quote: "Pembelian kedua langsung upsize 100ml, Pekan lalu beli size 30ml karena cobain dulu yaa ges. Alhamdulillah anakku cocok, eksim di kakinya membaik dengan izin Allah",
        author: "Review · Shopee",
      },
    },
  },
  {
    name: "Tallow Soap",
    category: "Soap",
    description:
      "A gentle cleansing bar that moisturizes and soothes the skin without stripping its natural moisture barrier.",
    benefits: ["100% Grass-fed Beef Tallow", "Natural Cold Process Soap", "SLS/SLES & Toxin-Free"],
    image: "/assets/product/TallowSoap.png",
    accent: "#f7e8d8",
    detail: {
      intro:
        "Menggabungkan illipe butter Kalimantan, minyak kelapa Sumatera, dan calendula yang merawat kulit sensitif.",
      ritual: "Ambil seujung kuku, hangatkan di tangan, lalu tepuk pelan pada area kering atau iritasi.",
      testimonial: {
        quote: "Area siku dan pipi bayi saya kembali lembap dalam tiga hari.",
        author: "Mita · Jakarta",
      },
    },
  },
];

export function ProductHighlightSection() {
  const [selectedProduct, setSelectedProduct] =
    useState<(typeof products)[number] | null>(null);

  return (
    <motion.section
      className={styles.products}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={containerVariants}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span className={styles.eyebrow} variants={cardVariants}>
            Product Showcase
          </motion.span>
          <motion.h2 className={styles.title} variants={cardVariants}>
            Perawatan dari Hati
          </motion.h2>
          <motion.p className={styles.description} variants={cardVariants}>
            Menampilkan tekstur, aroma, serta cara kerja produk unggulan Tallownara agar kamu dapat
            memilih ritual yang paling lembut untuk kulitmu.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              className={styles.card}
              variants={cardVariants}
              custom={index}
              whileHover={{ y: -10, rotateX: 1, rotateY: -1 }}
              transition={{ type: "spring", stiffness: 150, damping: 18 }}
            >
              <div
                className={styles.visual}
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.85), ${product.accent})`,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={420}
                  height={420}
                  className={styles.image}
                  unoptimized
                />
                <span className={styles.categoryBadge}>{product.category}</span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                <p className={styles.cardDescription}>{product.description}</p>

                <div className={styles.benefits}>
                  {product.benefits.map((benefit) => (
                    <span key={benefit} className={styles.benefitTag} title={benefit}>
                      {benefit}
                    </span>
                  ))}
                </div>

                <motion.button
                  className={styles.button}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedProduct(product)}
                >
                  Lihat Detail
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: cubicEase }}
              style={{ borderColor: selectedProduct.accent }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className={styles.modalClose}
                onClick={() => setSelectedProduct(null)}
                aria-label="Tutup detail produk"
              >
                ×
              </button>
              <div className={styles.modalContent}>
                <div className={styles.modalVisual}>
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={360}
                    height={360}
                    unoptimized
                  />
                </div>
                <div className={styles.modalText}>
                  <span className={styles.modalCategory}>{selectedProduct.category}</span>
                  <h3>{selectedProduct.name}</h3>
                  <p>{selectedProduct.detail.intro}</p>
                  <div className={styles.modalRitual}>
                    <strong>Ritual penggunaan</strong>
                    <p>{selectedProduct.detail.ritual}</p>
                  </div>
                  <blockquote className={styles.modalTestimonial}>
                    “{selectedProduct.detail.testimonial.quote}”
                    <cite>{selectedProduct.detail.testimonial.author}</cite>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

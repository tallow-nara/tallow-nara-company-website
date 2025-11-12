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
      "Sabun artisan dengan lapisan busa creamy, membersihkan lembut tanpa membuat kulit terasa kering.",
    benefits: ["Vitamin A, D, E, K", "Busa creamy", "Aroma daun jeruk"],
    image: "https://placehold.co/420x420/f5eee4/2e2b26?text=Tallow+Soap",
    accent: "#f0e3d4",
    detail: {
      intro:
        "Diproses dingin 6 minggu agar nutrisi tallow Tuban tetap utuh. Cocok untuk bayi hingga dewasa.",
      ritual: "Busakan di telapak tangan, pijat lembut dan biarkan busa bekerja 60 detik sebelum dibilas.",
      testimonial: {
        quote: "Kulit anak saya tidak lagi bersisik setelah mandi dengan sabun ini.",
        author: "Rani · Bogor",
      },
    },
  },
  {
    name: "Illipe Comfort Balm",
    category: "Balm",
    description:
      "Balm serbaguna yang meleleh begitu menyentuh kulit, menenangkan ruam, gigitan serangga, hingga bibir pecah.",
    benefits: ["Mentega tengkawang", "Zero petroleum", "Barrier repair"],
    image: "https://placehold.co/420x420/f2eadf/2e2b26?text=Comfort+Balm",
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
  {
    name: "Lavender Dew Lotion",
    category: "Lotion",
    description:
      "Lotion ringan dengan humektan nabati dan lavender Tasikmalaya yang membantu kulit beristirahat di malam hari.",
    benefits: ["Cepat meresap", "Relaksasi aroma", "Hydra-lock 8 jam"],
    image: "https://placehold.co/420x420/ede8f4/2e2b26?text=Lavender+Dew",
    accent: "#e7e0f1",
    detail: {
      intro:
        "Tekstur water-cream dengan sentuhan minyak lavender yang menenangkan pikiran sekaligus menjaga kelembapan.",
      ritual: "Gunakan setelah mandi sore, pijat dari kaki ke atas untuk membantu sirkulasi.",
      testimonial: {
        quote: "Tidur saya lebih pulas dan kulit terasa kenyal saat bangun.",
        author: "Nadia · Bandung",
      },
    },
  },
  {
    name: "Sunlit Veil Hand Butter",
    category: "Limited Batch",
    description:
      "Krim tangan dengan minyak bunga matahari dan lilin lebah, melindungi kulit dari keringnya AC.",
    benefits: ["Melting texture", "Shea & tallow", "Proteksi harian"],
    image: "https://placehold.co/420x420/fdf4e6/2e2b26?text=Hand+Butter",
    accent: "#fdeedc",
    detail: {
      intro:
        "Dipadukan dengan minyak bunga kenanga untuk aroma lembut yang bertahan lama tanpa menyengat.",
      ritual: "Oleskan sebanyak biji jagung, gosok perlahan hingga menyerap. Ulangi kapan pun dibutuhkan.",
      testimonial: {
        quote: "Tidak lengket sama sekali dan kuku terlihat sehat.",
        author: "Dara · Surabaya",
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

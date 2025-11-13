/** @format */

"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./TestimonialsSection.module.css";

const fadeVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.45, 0.05, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.6, ease: [0.45, 0.05, 0.2, 1] },
  },
};

const testimonials = [
  {
    name: "Alya Rahmania",
    location: "Bogor, Jawa Barat",
    role: "Ibu dari dua anak",
    quote:
      "Anak saya yang punya kulit sensitif jadi lebih tenang setelah pakai balm Tallownara. Tidak ada lagi rasa perih setelah mandi.",
    image: "https://placehold.co/300x300/e5ded1/2e2b26?text=Alya",
  },
  {
    name: "Dinda Prameswari",
    location: "Bandung, Jawa Barat",
    role: "Pecinta produk natural",
    quote:
      "Tallow Balm benar-benar melembapkan tanpa rasa lengket. Saya suka karena komitmennya pada komunitas lokal.",
    image: "https://placehold.co/300x300/f1ebe2/2e2b26?text=Dinda",
  },
  {
    name: "Zahra Aminah",
    location: "Jakarta Selatan",
    role: "Health Coach",
    quote:
      "Tallow Balm membuat kulit saya tenang setelah aktivitas luar ruangan. Teksturnya ringan tapi hasilnya bertahan lama.",
    image: "https://placehold.co/300x300/efe8da/2e2b26?text=Zahra",
  },
  {
    name: "Aditya Dirgantara",
    location: "Depok, Jawa Barat",
    role: "Ayah & fotografer",
    quote:
      "Produk Tallownara membuat rutinitas keluarga kami lebih mindful. Anak saya tidak lagi menolak balur lotion karena aromanya alami.",
    image: "https://placehold.co/300x300/eadfcc/2e2b26?text=Adi",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex],
    [activeIndex],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className={styles.testimonials}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: [0.45, 0.05, 0.2, 1] }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Testimonials</span>
          <h2>Cerita dari Mereka</h2>
          <p>
            Cerita para ibu, ayah, dan sahabat kulit sensitif tentang bagaimana ritus Tallownara
            membawa ketenangan baru di rumah mereka.
          </p>
        </div>

        <div className={styles.carousel}>
          <div className={styles.avatarStack}>
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                onClick={() => setActiveIndex(index)}
                className={`${styles.avatarButton} ${index === activeIndex ? styles.active : ""}`}
                aria-label={`Pilih testimoni ${testimonial.name}`}
              >
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className={styles.avatarImage}
                  unoptimized
                />
              </button>
            ))}
          </div>

          <div className={styles.content}>
            <AnimatePresence mode="wait">
              <motion.article
                key={activeTestimonial.name}
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={styles.card}
              >
                <Image
                  src={activeTestimonial.image}
                  alt={activeTestimonial.name}
                  width={120}
                  height={120}
                  className={styles.cardAvatar}
                  unoptimized
                />
                <p className={styles.quote}>&ldquo;{activeTestimonial.quote}&rdquo;</p>
                <div className={styles.meta}>
                  <strong>{activeTestimonial.name}</strong>
                  <span>{activeTestimonial.role}</span>
                  <span>{activeTestimonial.location}</span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className={styles.leafOne} />
      <div className={styles.leafTwo} />
    </motion.section>
  );
}

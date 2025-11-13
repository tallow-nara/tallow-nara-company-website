/** @format */

"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./IngredientsImpactSection.module.css";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.1 * custom, ease: [0.42, 0, 0.2, 1] },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      delay: 0.1 * custom,
      ease: [0.42, 0, 0.2, 1],
    },
  }),
};

const cards = [
  {
    title: "Lemak Sapi Tuban",
    subtitle:
      "Kaya vitamin A, D, E, K, melembapkan sekaligus memperkuat skin barrier.",
    impact:
      "Menghargai seluruh bagian ternak milik peternak kecil sehingga tidak ada limbah tersisa.",
    image: "/assets/LemakSapi.png",
    accent: "linear-gradient(135deg, #f8efe4 0%, #f3dcc4 100%)",
    icon: "💧",
    highlights: [
      "Regenerasi kulit sensitif",
      "Memberikan lapisan pelindung alami",
    ],
  },
  {
    title: "Mentega Tengkawang Kalimantan",
    subtitle:
      "Butter illipe yang mengunci kelembapan dan menjaga elastisitas kulit.",
    impact:
      "Panen hanya saat buah jatuh agar hutan tetap lestari dan satwa terjaga.",
    image: "/assets/Mentega.png",
    accent: "linear-gradient(135deg, #f2f8ec 0%, #deeed4 100%)",
    icon: "♻️",
    highlights: ["Tekstur melting", "Menjaga ekosistem hutan hujan"],
  },
  {
    title: "Minyak Kelapa Sumatera",
    subtitle:
      "Cold-pressed, kaya asam laurat anti inflamasi untuk kulit rentan iritasi.",
    impact:
      "Menguatkan rantai pasok petani pesisir dan memelihara tanah subur.",
    image: "/assets/MinyakKelapa.png",
    accent: "linear-gradient(135deg, #fef4ec 0%, #f9dcc6 100%)",
    icon: "🧘‍♀️",
    highlights: [
      "Kembali menenangkan kulit merah",
      "Menghaluskan tekstur kulit",
    ],
  },
  {
    title: "Minyak Lavender Artisan Bogor",
    subtitle:
      "Aroma floral yang menenangkan pikiran dan mendukung tidur berkualitas.",
    impact:
      "Ditanam oleh komunitas perempuan, menarik lebah penyerbuk dan meningkatkan kesejahteraan.",
    image: "/assets/Lavender.png",
    accent: "linear-gradient(135deg, #fef4ec 0%, #f9dcc6 100%)",
    icon: "🌸",
    highlights: ["Aromaterapi natural", "Membantu kulit beristirahat"],
  },
];

export function IngredientsImpactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const floatingY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (sliderRef.current) {
        gsap.fromTo(
          sliderRef.current,
          { x: -40 },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      className={styles.impact}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.span
        className={`${styles.floatingIcon} ${styles.iconOne}`}
        style={{ y: floatingY }}
        aria-hidden="true"
      >
        🌍
      </motion.span>
      <motion.span
        className={`${styles.floatingIcon} ${styles.iconTwo}`}
        style={{ y: floatingY }}
        aria-hidden="true"
      >
        🍃
      </motion.span>

      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            variants={headerVariants}
            custom={0}
          >
            Ingredient Impact
          </motion.span>
          <motion.h2
            className={styles.title}
            variants={headerVariants}
            custom={1}
          >
            Rahasia Alam Nusantara
          </motion.h2>
          <motion.p
            className={styles.description}
            variants={headerVariants}
            custom={2}
          >
            Setiap bahan utama kami punya cerita tentang kelembutan kulit
            sekaligus keberlanjutan bumi. Dari tallow Tuban hingga lavender
            Bogor, semuanya dirawat dengan penuh kasih.
          </motion.p>
        </div>

        <div className={styles.sliderWrapper}>
          <motion.div
            ref={sliderRef}
            className={styles.slider}
            variants={headerVariants}
            custom={3}
          >
            {cards.map((card, index) => (
              <motion.article
                key={card.title}
                className={styles.card}
                variants={cardVariants}
                custom={index + 1}
                whileHover={{ y: -8, rotate: -0.5 }}
              >
                <div
                  className={styles.cardImageWrapper}
                  style={{ background: card.accent }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className={styles.cardImage}
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 420px"
                  />
                  <span className={styles.cardIcon}>{card.icon}</span>
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
                <ul className={styles.cardHighlights}>
                  {card.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className={styles.impactText}>{card.impact}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

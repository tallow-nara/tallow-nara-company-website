/** @format */

"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import styles from "./WhyTallownaraSection.module.css";

const easeInOut = [0.42, 0, 0.2, 1] as const;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.1 * custom, ease: easeInOut },
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, delay: 0.1 * custom, ease: easeInOut },
  }),
};

const ingredients = [
  {
    title: "Lemak Sapi Tuban (Tallow Organik)",
    description:
      "Kaya vitamin A, D, E, dan K yang membantu meregenerasi kulit sensitif dan menjaga lapisan pelindungnya tetap kuat.",
    image: "https://placehold.co/600x400",
    tag: "Mineral-rich",
  },
  {
    title: "Mentega Illipe Kalimantan (Tengkawang Butter)",
    description:
      "Mengunci hidrasi, menjaga elastisitas kulit, sekaligus mendukung pelestarian hutan hujan Kalimantan melalui panen berkelanjutan.",
    image: "https://placehold.co/600x400",
    tag: "Forest Kind",
  },
  {
    title: "Minyak Kelapa Simeulue (Virgin Coconut Oil)",
    description:
      "Dik cold-press dari pulau Simeulue untuk menenangkan peradangan, melawan mikroba alami, dan menghadirkan kilau sehat.",
    image: "https://placehold.co/600x400",
    tag: "Island Pure",
  },
  {
    title: "Minyak Lavender Tasikmalaya",
    description:
      "Aroma lembut yang merilekskan pikiran, sekaligus membantu kulit beristirahat dan pulih di malam hari.",
    image: "https://placehold.co/600x400",
    tag: "Calming",
  },
];

export function WhyTallownaraSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <motion.section
      ref={sectionRef}
      className={styles.why}
      data-scroll-scene="why"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className={styles.parallaxLayer} style={{ y: parallaxY }}>
        <span className={`${styles.parallaxLeaf} ${styles.leafOne}`} />
        <span className={`${styles.parallaxLeaf} ${styles.leafTwo}`} />
      </motion.div>

      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            variants={headerVariants}
            custom={0}
          >
            Why Tallownara
          </motion.span>

          <motion.h2 className={styles.title} variants={headerVariants} custom={1}>
            Mengapa Tallownara Hadir
          </motion.h2>

          <motion.p
            className={styles.description}
            variants={headerVariants}
            custom={2}
          >
            Di tengah kekayaan hayati Nusantara, kami menemukan harmoni antara alam
            dan manusia. Tallownara memadukan bahan alami dari petani dan peternak
            lokal — membawa kebaikan yang lembut untuk kulit sekaligus menjaga bumi
            tetap seimbang.
          </motion.p>

          <motion.span className={styles.divider} variants={headerVariants} custom={3} />
        </div>

        <div className={styles.grid}>
          {ingredients.map((ingredient, index) => (
            <motion.article
              key={ingredient.title}
              className={styles.card}
              variants={cardVariants}
              custom={index + 1}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <div className={styles.cardImageWrapper}>
                <Image
                  src={`${ingredient.image}?text=${encodeURIComponent(ingredient.title)}`}
                  alt={ingredient.title}
                  width={600}
                  height={400}
                  className={styles.cardImage}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className={styles.iconLeaf} />
              </div>
              <span className={styles.tag}>
                <span className={styles.tagDot} />
                {ingredient.tag}
              </span>
              <h3 className={styles.cardTitle}>{ingredient.title}</h3>
              <p className={styles.cardDescription}>{ingredient.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

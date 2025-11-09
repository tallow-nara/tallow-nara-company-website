/** @format */

"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
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
    transition: { duration: 0.85, delay: 0.1 * custom, ease: [0.42, 0, 0.2, 1] },
  }),
};

const cards = [
  {
    title: "Lemak Sapi Tuban",
    benefit: "Kaya vitamin A, D, E, K untuk menutrisi kulit sensitif secara alami.",
    impact: "Memanfaatkan seluruh bagian hewan sehingga mengurangi limbah pangan.",
    image: "https://placehold.co/500x400",
    accent: "linear-gradient(135deg, #f8efe4 0%, #f3dcc4 100%)",
    icon: "🌱",
  },
  {
    title: "Mentega Illipe Kalimantan",
    benefit:
      "Melembapkan dan menjaga elastisitas kulit, membantu mencegah penuaan dini.",
    impact: "Mendukung panen tengkawang berkelanjutan dan melindungi habitat orangutan.",
    image: "https://placehold.co/500x400",
    accent: "linear-gradient(135deg, #f2f8ec 0%, #deeed4 100%)",
    icon: "🌿",
  },
  {
    title: "Minyak Kelapa Simeulue",
    benefit: "Menghidrasi kulit dan memperkuat lapisan pelindung alami.",
    impact:
      "Menghidupkan pertanian tradisional yang menjaga kesuburan tanah dan ekosistem pesisir.",
    image: "https://placehold.co/500x400",
    accent: "linear-gradient(135deg, #fef4ec 0%, #f9dcc6 100%)",
    icon: "🌊",
  },
  {
    title: "Minyak Lavender Tasikmalaya",
    benefit: "Menjadi teman relaksasi yang menenangkan kulit dan pikiran.",
    impact: "Menarik lebah penyerbuk dan mendukung pertanian ramah lingkungan.",
    image: "https://placehold.co/500x400",
    accent: "linear-gradient(135deg, #f7f2fb 0%, #eadcf5 100%)",
    icon: "🫶",
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
          },
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
          <motion.span className={styles.eyebrow} variants={headerVariants} custom={0}>
            Ingredient Impact
          </motion.span>
          <motion.h2 className={styles.title} variants={headerVariants} custom={1}>
            Jejak Kebaikan dari Alam Nusantara
          </motion.h2>
          <motion.p className={styles.description} variants={headerVariants} custom={2}>
            Setiap bahan yang kami gunakan membawa cerita — tentang hutan yang dijaga,
            tanah yang disuburkan, dan kehidupan yang diberdayakan. Melalui Tallownara,
            kebaikan alam tidak hanya menyentuh kulit, tetapi juga menjaga bumi yang
            kita cintai.
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
                whileHover={{ y: -5 }}
              >
                <div
                  className={styles.cardImageWrapper}
                  style={{ background: card.accent }}
                >
                  <Image
                    src={`${card.image}?text=${encodeURIComponent(card.title)}`}
                    alt={card.title}
                    width={500}
                    height={400}
                    className={styles.cardImage}
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 420px"
                  />
                </div>
                <span className={styles.label}>
                  <span className={styles.labelDot} />
                  {card.icon} bahan alami
                </span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.benefit}>{card.benefit}</p>
                <p className={styles.impactText}>{card.impact}</p>
              </motion.article>
            ))}
          </motion.div>
          <div className={styles.sliderHint}>
            <span className={styles.hintDot} />
            Geser untuk menjelajah dampak setiap bahan
          </div>
        </div>
      </div>
    </motion.section>
  );
}

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
import styles from "./StorySection.module.css";

const cubicEase = [0.45, 0.05, 0.2, 1] as const;

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: cubicEase },
  },
};

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: 0.15 * custom, ease: cubicEase },
  }),
};

const illustrationVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: cubicEase },
  },
};

const quoteVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: cubicEase, delay: 0.4 },
  },
};

const storyParagraphs = [
  "Di kota hujan Bogor, seorang ibu menyaksikan anaknya berjuang melawan dermatitis atopik.",
  "Dalam pencarian akan perawatan kulit yang aman, ia menemukan kekuatan bahan-bahan alami Nusantara — dari tallow organik hingga minyak kelapa murni.",
  "Dari perjalanan itu, lahirlah Tallownara, sebuah persembahan lembut untuk keluarga dan bumi.",
];

export function StorySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const backgroundBlend = useTransform(
    scrollYProgress,
    [0, 1],
    ["#f8f6f1", "#edf1e0"],
  );
  const accentGlow = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgba(201, 209, 167, 0.25)", "rgba(201, 209, 167, 0.45)"],
  );

  return (
    <motion.section
      ref={sectionRef}
      className={styles.story}
      style={{ background: backgroundBlend }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div className={styles.transitionCurve}>
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 64L48 69.3C96 75 192 85 288 82.7C384 80 480 64 576 58.7C672 53 768 59 864 69.3C960 80 1056 96 1152 96C1248 96 1344 80 1392 72L1440 64V0H0Z"
            fill="#f6f3ec"
          />
        </svg>
      </div>

      <motion.div
        className={styles.backgroundLayer}
        style={{ background: accentGlow }}
      />

      <div className={styles.inner}>
        <div className={styles.textColumn}>
          <motion.span className={styles.eyebrow} variants={paragraphVariants}>
            Origin Story
          </motion.span>

          <motion.h2 className={styles.title} variants={titleVariants}>
            Lahir dari Cinta Seorang Ibu
          </motion.h2>

          <div className={styles.paragraphGroup}>
            {storyParagraphs.map((text, index) => (
              <motion.p
                key={text}
                variants={paragraphVariants}
                custom={index + 1}
              >
                {text}
              </motion.p>
            ))}
          </div>

          <motion.blockquote className={styles.quote} variants={quoteVariants}>
            Dari cinta seorang ibu, lahirlah kelembutan yang menyembuhkan.
          </motion.blockquote>
        </div>

        <motion.div className={styles.visualColumn} variants={illustrationVariants}>
          <div className={styles.illustrationFrame}>
            <Image
              src="https://placehold.co/700x500"
              alt="Ilustrasi ibu dan anak Tallownara di Bogor"
              width={700}
              height={500}
              className={styles.illustration}
              unoptimized
            />

            <span className={`${styles.dew} ${styles.dewOne}`} />
            <span className={`${styles.dew} ${styles.dewTwo}`} />
            <span className={styles.leaf} />
          </div>
        </motion.div>
      </div>

      <div className={styles.curveDivider}>
        <svg viewBox="0 0 1440 110" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 40L48 52C96 64 192 88 288 91.5C384 95 480 79 576 64C672 49 768 35 864 37.5C960 40 1056 60 1152 66.5C1248 73 1344 66 1392 62.5L1440 59V110H0Z"
            fill="#f6f3ec"
          />
        </svg>
      </div>
    </motion.section>
  );
}

/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import styles from "./HeroProductListSection.module.css";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: custom, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const heroProducts = [
  {
    name: "Bogor Tallow Soap",
    description: "Sabun padat lembut dengan busa creamy dan aroma daun jeruk.",
    image: "https://placehold.co/400x300?text=Soap",
    badge: "Sabun",
    accent: "#f5ede2",
  },
  {
    name: "Illipe Comfort Balm",
    description: "Balm serbaguna untuk kulit kering & sensitif kapan pun dibutuhkan.",
    image: "https://placehold.co/400x300?text=Balm",
    badge: "Balm",
    accent: "#f3eddf",
  },
  {
    name: "Lavender Dew Lotion",
    description: "Lotion ringan beraroma lavender Tasikmalaya untuk malam damai.",
    image: "https://placehold.co/400x300?text=Lotion",
    badge: "Lotion",
    accent: "#f0ecf6",
  },
];

export function HeroProductListSection() {
  return (
    <motion.section
      className={styles.section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <motion.span className={styles.eyebrow} variants={fadeUp} custom={0}>
            Koleksi ringan
          </motion.span>
          <motion.h2 className={styles.title} variants={fadeUp} custom={0.05}>
            Tekstur yang lembut & bernapas lega
          </motion.h2>
          <motion.p className={styles.description} variants={fadeUp} custom={0.1}>
            Tiga formulasi inti Tallownara yang menjaga kulit tetap lembap, wangi natural, dan
            terasa ringan di setiap ritual pagi maupun malam.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {heroProducts.map((product, index) => (
            <motion.article
              key={product.name}
              className={styles.card}
              variants={fadeUp}
              custom={0.15 + index * 0.05}
              whileHover={{ y: -6 }}
            >
              <div
                className={styles.imageShell}
                style={{
                  background: `linear-gradient(160deg, rgba(255,255,255,0.95), ${product.accent})`,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={320}
                  height={220}
                  className={styles.image}
                  unoptimized
                />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.badge}>{product.badge}</span>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                <p className={styles.cardCopy}>{product.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

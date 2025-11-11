/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import { useCallback } from "react";
import styles from "./FooterSection.module.css";

const variants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.1 * custom, ease: [0.42, 0, 0.2, 1] },
  }),
};

const socials = [
  { label: "Instagram", link: "#", handle: "@tallownara" },
  { label: "TikTok", link: "#", handle: "@tallownara" },
  { label: "Shopee", link: "#", handle: "tallownara.official" },
  { label: "Tokopedia", link: "#", handle: "tallownara" },
];

export function FooterSection() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.footer
      className={styles.footer}
      data-scroll-scene="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <motion.div className={styles.inner} variants={variants}>
        <div className={styles.brand}>
          <motion.span className={styles.logo} variants={variants} custom={0}>
            Tallownara
          </motion.span>
          <motion.p className={styles.tagline} variants={variants} custom={1}>
            “Nurture your skin, honor the earth.”
          </motion.p>
          <motion.p className={styles.mission} variants={variants} custom={2}>
            Stay in touch with nature dan rasakan kelembutan ritual yang lahir dari kasih seorang ibu.
          </motion.p>
        </div>

        <motion.form className={styles.newsletter} variants={variants} custom={3}>
          <label htmlFor="newsletter-email">
            Dapatkan tips alami & promo eksklusif.
          </label>
          <div className={styles.inputGroup}>
            <input
              id="newsletter-email"
              type="email"
              placeholder="nama@email.com"
              required
            />
            <button type="submit">Berlangganan</button>
          </div>
        </motion.form>

        <motion.div className={styles.columns} variants={variants} custom={4}>
          <div>
            <h4>Studio</h4>
            <p>Jl. Hujan Rintik No. 11<br />Bogor 16143, Jawa Barat</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>hello@tallownara.com</p>
            <p>+62 812 3456 7890</p>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.link} aria-label={social.label}>
                    {social.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className={styles.bottom} variants={variants} custom={5}>
        <span>&copy; 2025 Tallownara Mubaraka. All Rights Reserved.</span>
        <span>“Nurture your skin, honor the earth.”</span>
        <motion.button
          className={styles.topButton}
          onClick={scrollToTop}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.topLeaf} aria-hidden="true" />
          Kembali ke atas
        </motion.button>
      </motion.div>
    </motion.footer>
  );
}

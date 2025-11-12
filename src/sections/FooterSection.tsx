/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
import { FormEvent } from "react";
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
  { label: "Shopee", link: "#", handle: "Shopee Mall" },
  { label: "Tokopedia", link: "#", handle: "Tallownara Store" },
];

export function FooterSection() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className={styles.footer}
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
          <motion.p className={styles.description} variants={variants} custom={2}>
            Terinspirasi dari perjalanan seorang ibu di Bogor, kami merawat kulit dengan kebaikan alam
            Nusantara yang lembut dan penuh kasih.
          </motion.p>
        </div>

        <motion.div className={styles.info} variants={variants} custom={3}>
          <div>
            <h4>Bogor Studio</h4>
            <p>Jl. Hujan Rintik No. 11</p>
            <p>Bogor 16143 · Indonesia</p>
          </div>
          <div>
            <h4>Hubungi Kami</h4>
            <p>hello@tallownara.com</p>
            <p>+62 812 3456 7890</p>
          </div>
          <div>
            <h4>Ikuti</h4>
            <ul>
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.link}>{social.label}</a>
                  <span>{social.handle}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p>Dapatkan tips alami &amp; promo eksklusif.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input type="email" placeholder="Email kamu" aria-label="Email kamu" required />
              <button type="submit">Kirim</button>
            </form>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className={styles.bottom} variants={variants} custom={4}>
        <span>&copy; {new Date().getFullYear()} Tallownara Mubaraka. All Rights Reserved.</span>
        <motion.button
          className={styles.scrollTop}
          onClick={scrollTop}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Back to top</span>
          <span className={styles.leaf} />
        </motion.button>
      </motion.div>
    </motion.footer>
  );
}

/** @format */

"use client";

import { motion, type Variants } from "framer-motion";
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
  { label: "Email", link: "mailto:hello@tallownara.com", handle: "hello@tallownara.com" },
];

export function FooterSection() {
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
            Lembut, hangat, dan bersumber dari alam Bogor. Ritual kulit yang lahir dari cinta
            seorang ibu untuk keluarga dan bumi.
          </motion.p>
        </div>

        <motion.div className={styles.info} variants={variants} custom={2}>
          <div>
            <h4>Bogor, Jawa Barat</h4>
            <p>Jl. Hujan Rintik No. 11, Bogor 16143</p>
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
                  <a href={social.link}>{social.handle}</a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className={styles.bottom} variants={variants} custom={3}>
        <span>&copy; {new Date().getFullYear()} Tallownara. All rights reserved.</span>
        <span>“Where love meets the wild earth.”</span>
      </motion.div>
    </motion.footer>
  );
}

'use client';

import { motion } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

const AnimatedText = ({ text, className = "", delay = 0 }: AnimatedTextProps) => {
  return (
    <motion.p
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {text}
    </motion.p>
  );
};

export default AnimatedText;


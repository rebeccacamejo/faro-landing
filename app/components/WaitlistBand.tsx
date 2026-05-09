"use client";

import { motion, useReducedMotion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";

interface Props {
  headingId: string;
  headingText: string;
  subheadText: string;
}

export default function WaitlistBand({ headingId, headingText, subheadText }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="bg-navy"
      initial={{ scaleY: reduced ? 1 : 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: reduced ? 0 : 0.8, ease: [0.4, 0, 0.2, 1] }}
      style={{ transformOrigin: "center" }}
    >
      <div className="max-w-[1100px] mx-auto px-6 py-24 md:py-32">
        <motion.div
          className="max-w-lg mx-auto text-center mb-10"
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.8 }}
        >
          <h2
            id={headingId}
            className="font-serif text-[36px] md:text-[48px] text-cream mb-4"
          >
            {headingText}
          </h2>
          <p className="font-sans text-lg text-cream/70">{subheadText}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.9 }}
        >
          <WaitlistForm />
        </motion.div>
      </div>
    </motion.div>
  );
}

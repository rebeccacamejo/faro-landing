"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FAQItem = { q: string; a: string };
type FAQSection = { title: string; slug: string; items: FAQItem[] };

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex-shrink-0 ml-4 w-5 h-5" aria-hidden="true">
      <span className="absolute inset-0 flex items-center justify-center text-brass">
        <span className="absolute block w-4 h-[1.5px] bg-current rounded-full transition-all duration-200" />
        <span
          className="absolute block w-[1.5px] h-4 bg-current rounded-full transition-all duration-200"
          style={{ opacity: open ? 0 : 1, transform: open ? "scaleY(0)" : "scaleY(1)" }}
        />
      </span>
    </span>
  );
}

function AccordionItem({ item, id }: { item: FAQItem; id: string }) {
  const [open, setOpen] = useState(false);
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-brass/20">
      <button
        id={id}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-6 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <span
          className={[
            "font-serif text-[18px] leading-snug transition-colors duration-150",
            open ? "text-navy" : "text-navy group-hover:text-terracotta",
          ].join(" ")}
        >
          {item.q}
        </span>
        <PlusMinusIcon open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={id}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p className="font-sans text-base text-charcoal pb-6" style={{ lineHeight: 1.7 }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQAccordion({ sections }: { sections: FAQSection[] }) {
  return (
    <div className="space-y-14">
      {sections.map((section) => (
        <section key={section.slug} aria-labelledby={`section-${section.slug}`}>
          <h2
            id={`section-${section.slug}`}
            className="font-serif text-[28px] text-navy mb-2"
          >
            {section.title}
          </h2>
          <div>
            {section.items.map((item, i) => (
              <AccordionItem
                key={i}
                item={item}
                id={`faq-${section.slug}-${i}`}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

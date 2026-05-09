"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const AGENT_COLORS: Record<string, string> = {
  ChatGPT: "#10a37f",
  Perplexity: "#20b8cd",
  Claude: "#d97757",
  Gemini: "#4285f4",
};

const CYCLE_MS = 2800;

const SLOTS = [
  { y: 0,  scale: 1,    opacity: 1,    zIndex: 3 },
  { y: 14, scale: 0.97, opacity: 0.55, zIndex: 2 },
  { y: 28, scale: 0.94, opacity: 0.28, zIndex: 1 },
] as const;

type Card = { agent: string; query: string };
type Slot = { id: number; cardIndex: number };

interface Props {
  cards: Card[];
  searchingText: string;
  liveLabel: string;
}

export default function LivePrompts({ cards, searchingText, liveLabel }: Props) {
  const prefersReduced = useReducedMotion();
  const total = cards.length;

  const idRef = useRef(3);
  const nextCardRef = useRef(3 % total);
  const [isPaused, setIsPaused] = useState(false);
  const [queue, setQueue] = useState<Slot[]>([
    { id: 0, cardIndex: 0 },
    { id: 1, cardIndex: 1 },
    { id: 2, cardIndex: 2 % total },
  ]);

  useEffect(() => {
    const onVis = () => setIsPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const id = setInterval(() => {
      const cardIndex = nextCardRef.current;
      nextCardRef.current = (cardIndex + 1) % total;
      const newId = idRef.current++;
      setQueue((prev) => [...prev.slice(1), { id: newId, cardIndex }]);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [prefersReduced, isPaused, total]);

  return (
    <div
      role="region"
      aria-label={liveLabel}
      aria-live="polite"
      aria-atomic="false"
      className="relative h-[220px] w-full"
    >
      <AnimatePresence initial={false}>
        {queue.map((slot, slotIndex) => {
          const target = SLOTS[slotIndex];
          const card = cards[slot.cardIndex];
          return (
            <motion.div
              key={slot.id}
              initial={prefersReduced ? false : { y: 56, opacity: 0, scale: 0.94 }}
              animate={{
                y: target.y,
                scale: target.scale,
                opacity: target.opacity,
              }}
              exit={prefersReduced ? {} : { y: -32, opacity: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: target.zIndex,
              }}
            >
              <CardView card={card} searchingText={searchingText} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function CardView({ card, searchingText }: { card: Card; searchingText: string }) {
  const color = AGENT_COLORS[card.agent] ?? "#888";
  return (
    <div className="rounded-xl border border-black/[0.07] bg-white px-5 py-4 shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ background: color }}
        />
        <span className="font-sans text-xs font-medium text-charcoal/50">
          {card.agent}
        </span>
      </div>
      <p className="mb-4 font-serif text-[17px] leading-snug text-navy">
        &ldquo;{card.query}&rdquo;
      </p>
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-terracotta"
        />
        <span className="font-sans text-xs text-charcoal/40">{searchingText}</span>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { ProductGrid } from "@/components/store/ProductGrid";
import type { SeedProduct as Product } from "@/types/index";

interface Props {
  products: Product[];
}

export default function HeroTiltCard({ products }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const springX = useSpring(tilt.x, { stiffness: 150, damping: 20 });
  const springY = useSpring(tilt.y, { stiffness: 150, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - 0.5) * 10;
    const y = ((e.clientY - top)  / height - 0.5) * 10;
    setTilt({ x: -y, y: x });
  };

  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className="relative cursor-pointer rounded-3xl border border-white/60 bg-white/90 p-6 shadow-card-hover backdrop-blur-md transition-shadow duration-300 hover:shadow-green md:p-8"
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-forest-500 via-gold-400 to-sage-400" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-forest-800">
            Today&apos;s picks
          </h2>
          <p className="mt-0.5 text-sm text-forest-600/60">
            Freshly selected for you
          </p>
        </div>
        <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-forest-700">
          New in
        </span>
      </div>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>

      {/* Subtle inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-forest-500/[0.03] to-gold-300/[0.05]" />
    </motion.div>
  );
}
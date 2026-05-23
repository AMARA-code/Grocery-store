"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Sparkles, SlidersHorizontal, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductRow, Category } from "@/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CategoryFilters } from "@/components/store/CategoryFilters";
import { ProductGrid } from "@/components/store/ProductGrid";

/* ─────────────────────────────────────────
   SCROLL-LINKED SHOPPING CHARACTER
───────────────────────────────────────── */
function ShoppingCharacter() {
  const { scrollY } = useScroll();
  const xRaw      = useTransform(scrollY, [0, 2000], ["-10%", "110%"]);
  const x         = useSpring(xRaw, { stiffness: 60, damping: 18 });
  const armAngle  = useTransform(scrollY, [0,200,400,600,800,1000,1200,1400,1600,1800,2000], [0,20,-20,20,-20,20,-20,20,-20,20,0]);
  const armSpring = useSpring(armAngle, { stiffness: 80, damping: 12 });
  const wheelRot  = useTransform(scrollY, [0, 2000], [0, 720]);
  const wheelSpr  = useSpring(wheelRot, { stiffness: 60, damping: 14 });
  const headTilt  = useTransform(scrollY, [0,300,600,900,1200,1500,1800], [0,-8,8,-5,10,-8,0]);
  const headSpr   = useSpring(headTilt, { stiffness: 100, damping: 15 });
  const legFront  = useTransform(scrollY, [0,150,300,450,600,750,900,1050,1200,1350,1500,1650,1800,2000], [0,28,-28,28,-28,28,-28,28,-28,28,-28,28,-28,0]);
  const legSpr    = useSpring(legFront, { stiffness: 90, damping: 12 });
  const legBack   = useTransform(legSpr, v => -v);

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 overflow-hidden" style={{ height: 130 }} aria-hidden>
      <motion.div style={{ x, bottom: 0, position: "absolute" }} className="will-change-transform">
        <motion.div animate={{ y: [0,-6,0,-4,0] }} transition={{ repeat: Infinity, duration: 0.55, ease: "easeInOut" }}>
          <svg width="96" height="120" viewBox="0 0 96 120" fill="none">
            <ellipse cx="42" cy="116" rx="22" ry="4" fill="rgba(0,0,0,0.08)" />
            <g transform="translate(52,72)">
              <rect x="0" y="4" width="32" height="18" rx="3" fill="#fff" stroke="#e5793a" strokeWidth="1.5"/>
              <path d="M-8 0 L0 0 L4 22" stroke="#e5793a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <circle cx="10" cy="3" r="4" fill="#4ade80"/><circle cx="18" cy="2" r="3.5" fill="#f97316"/><circle cx="25" cy="4" r="3" fill="#fbbf24"/>
              <motion.g style={{ rotate: wheelSpr, originX:"6px", originY:"24px" }}>
                <circle cx="6" cy="24" r="5" fill="white" stroke="#e5793a" strokeWidth="1.5"/>
                <line x1="6" y1="20" x2="6" y2="28" stroke="#e5793a" strokeWidth="1"/><line x1="2" y1="24" x2="10" y2="24" stroke="#e5793a" strokeWidth="1"/>
              </motion.g>
              <motion.g style={{ rotate: wheelSpr, originX:"26px", originY:"24px" }}>
                <circle cx="26" cy="24" r="5" fill="white" stroke="#e5793a" strokeWidth="1.5"/>
                <line x1="26" y1="20" x2="26" y2="28" stroke="#e5793a" strokeWidth="1"/><line x1="22" y1="24" x2="30" y2="24" stroke="#e5793a" strokeWidth="1"/>
              </motion.g>
            </g>
            <rect x="20" y="42" width="28" height="30" rx="8" fill="#f97316"/>
            <rect x="26" y="46" width="16" height="2" rx="1" fill="#fff" opacity="0.4"/>
            <motion.g style={{ rotate: armSpring, originX:"24px", originY:"46px" }}>
              <rect x="12" y="44" width="10" height="5" rx="2.5" fill="#fcd9b5" transform="rotate(-15 12 44)"/>
            </motion.g>
            <motion.g style={{ rotate: armSpring, originX:"44px", originY:"46px" }}>
              <path d="M44 48 Q52 52 54 74" stroke="#fcd9b5" strokeWidth="7" strokeLinecap="round" fill="none"/>
              <circle cx="54" cy="74" r="4.5" fill="#fcd9b5"/>
            </motion.g>
            <motion.g style={{ rotate: legSpr, originX:"34px", originY:"70px" }}>
              <rect x="28" y="70" width="9" height="26" rx="4.5" fill="#2d5a3d"/>
              <ellipse cx="32" cy="96" rx="8" ry="4" fill="#1a3d28"/>
            </motion.g>
            <motion.g style={{ rotate: legBack, originX:"38px", originY:"70px" }}>
              <rect x="33" y="70" width="9" height="26" rx="4.5" fill="#2d5a3d"/>
              <ellipse cx="38" cy="96" rx="8" ry="4" fill="#1a3d28"/>
            </motion.g>
            <rect x="29" y="34" width="10" height="10" rx="5" fill="#fcd9b5"/>
            <motion.g style={{ rotate: headSpr, originX:"34px", originY:"26px" }}>
              <circle cx="34" cy="24" r="18" fill="#fcd9b5"/>
              <path d="M17 20 Q20 5 34 6 Q48 5 51 20" fill="#3b1f0a"/>
              <path d="M17 18 Q16 10 22 8" stroke="#3b1f0a" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <circle cx="27" cy="22" r="2.8" fill="white"/><circle cx="41" cy="22" r="2.8" fill="white"/>
              <circle cx="28" cy="23" r="1.5" fill="#3b1f0a"/><circle cx="42" cy="23" r="1.5" fill="#3b1f0a"/>
              <circle cx="28.8" cy="22.2" r="0.6" fill="white"/><circle cx="42.8" cy="22.2" r="0.6" fill="white"/>
              <path d="M27 29 Q34 35 41 29" stroke="#c0784a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <circle cx="22" cy="28" r="4" fill="#f97316" opacity="0.25"/><circle cx="46" cy="28" r="4" fill="#f97316" opacity="0.25"/>
              <path d="M14 18 Q34 4 54 18" fill="#e5793a"/>
              <rect x="12" y="16" width="44" height="5" rx="2.5" fill="#e5793a"/>
              <rect x="28" y="6" width="12" height="4" rx="2" fill="#c0512a"/>
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FLOATING SPARKLES
───────────────────────────────────────── */
function FloatingSparkle({ delay = 0, x = "50%", size = 16 }: { delay?: number; x?: string; size?: number }) {
  return (
    <motion.div
      style={{ left: x, position: "absolute", top: 0 }}
      animate={{ y: [0, -40, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
      transition={{ repeat: Infinity, duration: 3 + delay, delay, ease: "easeInOut" }}
      className="pointer-events-none"
    >
      <Sparkles className="text-brand-orange/40" style={{ width: size, height: size }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   HERO IMAGE CAROUSEL (right side)
───────────────────────────────────────── */
const heroImages = [
  { src: "/hero2.jpg",  label: "Farm Fresh"    },
  { src: "/hero3.jpg",  label: "Organic Picks" },
  { src: "/hero4.jpg",  label: "Daily Harvest" },
];
const thumbnailImages = [
  { src: "/hero3.jpg" },
  { src: "/hero4.jpg" },
];

function HeroImagePanel() {
  const [active,    setActive]    = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };
  const prev = () => goTo((active - 1 + heroImages.length) % heroImages.length);
  const next = () => goTo((active + 1) % heroImages.length);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setActive(i => (i + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const variants = {
    enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0, scale: 0.96 }),
  };

  return (
    <div className="relative h-full flex flex-col gap-3">
      {/* Rating badge */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-white/95 shadow-md px-3 py-1.5 backdrop-blur-sm">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold text-stone-800">4.9</span>
        <span className="text-xs text-stone-400">/ 5.0</span>
      </div>

      {/* Main image */}
      <div className="relative flex-1 overflow-hidden rounded-2xl min-h-[220px]">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div key={active} custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0">
            <img src={heroImages[active].src} alt={heroImages[active].label}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
                {heroImages[active].label}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md text-stone-600 hover:bg-white transition"
          aria-label="Previous image">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md text-stone-600 hover:bg-white transition"
          aria-label="Next image">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Thumbnails + availability */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {thumbnailImages.map((img, i) => (
            <button key={i} onClick={() => goTo(i + 1)}
              className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all ${
                active === i + 1 ? "border-brand-orange shadow-orange" : "border-transparent opacity-70 hover:opacity-100"
              }`}>
              <img src={img.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 shadow-sm ml-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">All items in stock</span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${active === i ? "w-5 bg-brand-orange" : "w-1.5 bg-stone-300"}`}
            aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-stone-100 bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-stone-100" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-stone-100 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/2" />
            <div className="h-5 bg-orange-50 rounded w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN CATALOG
───────────────────────────────────────── */
export function ProductsCatalog() {
  const searchParams  = useSearchParams();
  const search        = searchParams.get("search") ?? "";
  const categoryParam = searchParams.get("category") ?? "All";

  const [allProducts,      setAllProducts]      = useState<ProductRow[]>([]);
  const [loading,          setLoading]          = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(categoryParam as Category | "All");
  const [showFilters,      setShowFilters]      = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParam as Category | "All");
  }, [categoryParam]);

  /* Fetch from Supabase */
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setAllProducts(data as ProductRow[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() =>
    allProducts.filter(p => {
      const matchCat  = selectedCategory === "All" || p.category === selectedCategory;
      const term      = search.toLowerCase();
      const matchSrch = !term || p.name.toLowerCase().includes(term)
        || (p.description ?? "").toLowerCase().includes(term)
        || (p.category    ?? "").toLowerCase().includes(term);
      return matchCat && matchSrch;
    }),
    [allProducts, selectedCategory, search]
  );

  return (
    <div className="relative space-y-0 pb-36">
      <ShoppingCharacter />

      {/* ── Hero banner: old split layout ── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-green-50 border border-orange-100 mb-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-orange/8 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-green-200/30 blur-2xl" />
        <div className="pointer-events-none absolute right-1/3 bottom-0 h-36 w-36 rounded-full bg-amber-200/40 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <FloatingSparkle delay={0}   x="5%"  size={14} />
          <FloatingSparkle delay={0.8} x="18%" size={10} />
          <FloatingSparkle delay={2.1} x="42%" size={9}  />
        </div>
        <svg className="pointer-events-none absolute left-3 top-3 opacity-20" width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M2 18 L2 2 L18 2" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* LEFT: text */}
          <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 py-10 sm:py-14">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6, ease:[0.22,1,0.36,1] }} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-orange border border-brand-orange/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-orange opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-orange" />
                  </span>
                  Now Delivering
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-charcoal leading-[1.08]">
                Your Grocery Shop,<br />
                <em className="not-italic text-brand-orange">Delivered to You.</em>
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-brand-orange/30" />
                <div className="h-1.5 w-1.5 rounded-full bg-brand-orange/50" />
                <div className="h-px w-10 bg-brand-orange/30" />
              </div>
              <p className="max-w-sm text-sm sm:text-base text-stone-500 leading-relaxed">
                Browse products across every category — fresh produce, dairy, bakery, snacks and more. Add to cart and we'll deliver to your door.&nbsp;🛒
              </p>
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.6, delay:0.15, ease:[0.22,1,0.36,1] }}
                className="flex flex-wrap gap-3 pt-1">
                {[
                  { icon:"🛒", label:"Wide Selection"      },
                  { icon:"⚡", label:"Same-Day Delivery"  },
                  { icon:"📦", label:"Free Delivery"      },
                  { icon:"🔒", label:"Secure Checkout"    },
                ].map(f => (
                  <div key={f.label}
                    className="flex items-center gap-1.5 rounded-full bg-white/80 border border-orange-100 px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all">
                    <span>{f.icon}</span>{f.label}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT: carousel */}
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.7, delay:0.1, ease:[0.22,1,0.36,1] }}
            className="relative hidden lg:flex flex-col p-4 sm:p-6 min-h-[340px]">
            <HeroImagePanel />
          </motion.div>
        </div>
      </div>

      {/* ── Mobile filter toggle only ── */}
      <div className="mb-4 flex justify-end sm:hidden">
        <button type="button" onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-500 shadow-sm transition hover:border-brand-orange hover:text-brand-orange">
          {showFilters ? <X className="h-3.5 w-3.5" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
          {showFilters ? "Hide filters" : "Filter"}
        </button>
      </div>

      {/* ── Filters desktop ── */}
      <div className="mb-8 hidden sm:block">
        <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* ── Filters mobile ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div key="mob-filters" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }} className="mb-6 overflow-hidden sm:hidden">
            <CategoryFilters selected={selectedCategory}
              onSelect={cat => { setSelectedCategory(cat); setShowFilters(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Product grid ── */}
      {loading ? <SkeletonGrid /> : (
        <motion.div key={`${selectedCategory}-${search}`}
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}>
          <ProductGrid products={filtered} />
        </motion.div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="text-6xl">🥲</span>
          <h3 className="font-display text-xl font-bold text-stone-700">Nothing found</h3>
          <p className="text-sm text-stone-400 max-w-xs">Try a different category or clear your search.</p>
        </motion.div>
      )}
    </div>
  );
}
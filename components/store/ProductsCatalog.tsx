"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ArrowRight } from "lucide-react";
import type { ProductRow, Category } from "@/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CategoryFilters } from "@/components/store/CategoryFilters";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Badge } from "@/components/ui/Badge";

/* ─────────────────────────────────────────
   WALKING CHARACTER
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
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-0 overflow-hidden" style={{ height: 130 }} aria-hidden>
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
   PREMIUM HERO
───────────────────────────────────────── */
function HeroBanner({ count }: { count: number }) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl sm:rounded-3xl" style={{ minHeight: 260 }}>
      <div className="absolute inset-0 bg-[#0f1a0f]" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(234,88,12,0.28) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-[380px] w-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 65%)" }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      {[
        { e:"🍎", top:"12%", right:"8%",  size:"text-3xl", delay:0   },
        { e:"🥦", top:"55%", right:"18%", size:"text-2xl", delay:0.6 },
        { e:"🥕", top:"20%", right:"28%", size:"text-xl",  delay:1.2 },
        { e:"🍋", top:"70%", right:"5%",  size:"text-2xl", delay:0.3 },
        { e:"🫐", top:"8%",  right:"42%", size:"text-lg",  delay:1.8 },
      ].map((o, i) => (
        <motion.span key={i} className={`pointer-events-none absolute ${o.size} select-none`}
          style={{ top: o.top, right: o.right }}
          animate={{ y:[0,-12,0], rotate:[-4,4,-4], opacity:[0.55,0.9,0.55] }}
          transition={{ repeat: Infinity, duration: 3.5 + i*0.4, delay: o.delay, ease:"easeInOut" }}>
          {o.e}
        </motion.span>
      ))}
      <div className="relative z-10 flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-14 lg:max-w-[70%]">
        <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }} className="mb-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
            </span>
            In Stock Now
          </span>
        </motion.div>
        <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1, ease:[0.22,1,0.36,1] }}
          className="font-display font-bold leading-[1.06] text-white" style={{ fontSize:"clamp(28px,4.5vw,60px)" }}>
          Fresh Groceries,<br />
          <span style={{ background:"linear-gradient(90deg,#fb923c 0%,#f97316 40%,#fbbf24 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Curated for You.
          </span>
        </motion.h1>
        <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.2 }}
          className="mt-4 max-w-sm text-sm sm:text-base text-stone-400 leading-relaxed">
          {count}+ hand-picked products from local farms and artisan producers.
        </motion.p>
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55, delay:0.3 }}
          className="mt-6 flex flex-wrap gap-2.5">
          {[
            { icon:"🥦", label:"Always Fresh",      accent:"border-green-700/40 bg-green-900/30 text-green-300"   },
            { icon:"⚡", label:"Same-Day Delivery", accent:"border-amber-700/40 bg-amber-900/30 text-amber-300"   },
            { icon:"🌿", label:"100% Organic",      accent:"border-emerald-700/40 bg-emerald-900/30 text-emerald-300"},
            { icon:"🔒", label:"Secure Checkout",   accent:"border-sky-700/40 bg-sky-900/30 text-sky-300"         },
          ].map(f => (
            <span key={f.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${f.accent}`}>
              <span>{f.icon}</span>{f.label}
            </span>
          ))}
        </motion.div>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="mt-7 flex items-center gap-2 text-xs font-semibold text-stone-500">
          <span>Scroll to browse</span>
          <motion.div animate={{ x:[0,5,0] }} transition={{ repeat:Infinity, duration:1.4, ease:"easeInOut" }}>
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background:"linear-gradient(90deg,transparent,rgba(249,115,22,0.6),rgba(34,197,94,0.4),transparent)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON GRID
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

  /* Sync category from URL */
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
        || (p.category  ?? "").toLowerCase().includes(term);
      return matchCat && matchSrch;
    }),
    [allProducts, selectedCategory, search]
  );

  return (
    <div className="relative space-y-0 pb-36">
      <ShoppingCharacter />
      <HeroBanner count={allProducts.length} />

      {/* Toolbar */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.25 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-700">
            {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
          </span>
          {search && <Badge variant="outline">"{search}"</Badge>}
          {selectedCategory !== "All" && <Badge variant="outline">{selectedCategory}</Badge>}
        </div>
        <button type="button" onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-stone-600 shadow-sm transition hover:border-brand-orange hover:text-brand-orange sm:hidden">
          {showFilters ? <X className="h-3.5 w-3.5" /> : <SlidersHorizontal className="h-3.5 w-3.5" />}
          {showFilters ? "Hide" : "Filters"}
        </button>
      </motion.div>

      {/* Filters — desktop */}
      <div className="mb-8 hidden sm:block">
        <CategoryFilters selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Filters — mobile */}
      <AnimatePresence>
        {showFilters && (
          <motion.div key="mob-filters" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
            exit={{ opacity:0, height:0 }} className="mb-6 overflow-hidden sm:hidden">
            <CategoryFilters selected={selectedCategory} onSelect={cat => { setSelectedCategory(cat); setShowFilters(false); }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? <SkeletonGrid /> : (
        <motion.div key={`${selectedCategory}-${search}`}
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}>
          <ProductGrid products={filtered} />
        </motion.div>
      )}

      {/* Empty */}
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
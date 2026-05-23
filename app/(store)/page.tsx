"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView, type Variants } from "framer-motion";
import { products } from "@/src/data/products";
import { ProductGrid } from "@/components/store/ProductGrid";
import { Button } from "@/components/ui/Button";

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const SLIDES = [
  { src: "/hero.jpg",  label: "Fresh groceries, delivered daily" },
  { src: "/hero1.jpg", label: "Thousands of products, one place" },
  { src: "/hero2.jpg", label: "Quality you can taste" },
  { src: "/hero3.jpg", label: "Everything your kitchen needs" },
  { src: "/hero4.jpg", label: "Freshness, redefined" },
];

const MARQUEE = [
  "🥦 Fresh Vegetables", "🍊 Seasonal Fruits", "🥛 Dairy & Eggs",
  "🍞 Artisan Bakery", "🐟 Premium Seafood", "🫙 Pantry Staples",
  "🥩 Quality Meats", "🫒 Olive Oil & More",
];

const CATEGORIES = [
  { image: "/lettuce-romaine-head.jpg", label: "Fruits & Vegetables", count: "120+ items", accent: "#16a34a" },
  { image: "/croissant-pack.jpg",       label: "Bakery",              count: "45+ items",  accent: "#d97706" },
  { image: "/whole-milk.jpg",           label: "Dairy & Eggs",        count: "60+ items",  accent: "#0284c7" },
  { image: "/salmon-fillets.jpg",       label: "Meat & Seafood",      count: "55+ items",  accent: "#e11d48" },
  { image: "/Basmati-Rice.jpg",         label: "Pantry",              count: "80+ items",  accent: "#ea580c" },
  { image: "/Cola-Drink.jpg",           label: "Beverages",           count: "40+ items",  accent: "#0d9488" },
];

const WHY_US = [
  { icon: "🌿", title: "100% Fresh",     desc: "Every product is carefully selected and quality-checked before it reaches your door. Freshness is our promise." },
  { icon: "⚡", title: "Lightning Fast", desc: "Same-day delivery in selected areas. Order by noon, get it by evening — guaranteed." },
  { icon: "🏷️", title: "Best Prices",   desc: "We offer competitive prices across all categories with weekly deals and member-exclusive discounts." },
  { icon: "♻️", title: "Zero Waste",     desc: "Eco-friendly packaging, minimal plastic, and a commitment to a greener planet." },
  { icon: "🔒", title: "Safe Payments",  desc: "Bank-grade security on every transaction. Your data is always protected." },
  { icon: "💬", title: "24/7 Support",   desc: "Our team is always here. Chat, call, or email — we respond in minutes, not hours." },
];

const TESTIMONIALS = [
  { name: "Ayesha Khan",   role: "Home Chef",         avatar: "AK", text: "FreshCart has completely changed how I shop. The produce is incredibly fresh and delivery is always on time. I've cancelled my supermarket membership!" },
  { name: "Omar Siddiqui", role: "Fitness Trainer",   avatar: "OS", text: "As someone who's very particular about food quality, FreshCart is the only grocery service I trust. The selection is outstanding and prices are great." },
  { name: "Sara Malik",    role: "Busy Mom of Three", avatar: "SM", text: "Saves me hours every week. The app is beautiful, the food is fresh, and my kids actually eat more vegetables now. Highly recommend!" },
];

/* ══════════════════════════════════════════
   VARIANTS
══════════════════════════════════════════ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const slideRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function Corner({ className }: { className?: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className={className}>
      <path d="M2 24 L2 2 L24 2" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
      <div className="h-px w-8 bg-brand-orange" />
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand-orange">{children}</span>
    </motion.div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-brand-charcoal leading-[1.08]">
      {children}
    </motion.h2>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const next = useCallback(() => setCurrent(p => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, paused]);

  return (
    <div className="space-y-16 sm:space-y-20 md:space-y-28 overflow-x-hidden w-full min-w-0">

      {/* ════════════════════════════
          1. HERO
      ════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
        style={{ minHeight: "clamp(480px, 60vw, 700px)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image src={SLIDES[current].src} alt={SLIDES[current].label} fill priority className="object-cover object-center" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#fdf8f2]/95 via-[#fdf8f2]/65 to-[#fdf8f2]/10 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#fdf8f2]/55 via-transparent to-transparent pointer-events-none" />

        <Corner className="absolute top-4 left-4 z-20 text-brand-orange/50" />
        <Corner className="absolute top-4 right-4 z-20 text-brand-orange/50 rotate-90" />
        <Corner className="absolute bottom-14 left-4 z-20 text-brand-orange/50 -rotate-90" />
        <Corner className="absolute bottom-14 right-4 z-20 text-brand-orange/50 rotate-180" />

        <div className="absolute right-6 top-1/2 z-20 hidden lg:flex" style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}>
          <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-stone-400">Premium Selection</span>
        </div>

        <motion.div
          style={{ y: textY, paddingTop: "clamp(56px, 9vw, 100px)", paddingBottom: "clamp(72px, 11vw, 110px)" }}
          className="relative z-20 flex flex-col justify-center lg:max-w-[60%] px-5 sm:px-8 lg:px-12"
        >
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 sm:space-y-6">
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="h-px w-8 bg-brand-orange" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-brand-orange">Fresh · Fast · Affordable</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display font-bold leading-[1.05] text-brand-charcoal"
              style={{ fontSize: "clamp(32px, 5.5vw, 80px)" }}
            >
              Grocery<br />Shopping,{" "}
              <em className="text-shimmer not-italic">Reimagined.</em>
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="max-w-sm text-base sm:text-lg leading-relaxed text-stone-600 font-light"
              >
                {SLIDES[current].label}.<br />
                <span className="text-sm text-stone-400">From crisp vegetables to artisan bread — delivered to your door.</span>
              </motion.p>
            </AnimatePresence>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Button href="/products" variant="primary">Start Shopping</Button>
              <Button href="/contact" variant="secondary">Contact us</Button>
            </motion.div>

            <motion.p variants={fadeUp} className="flex items-center gap-2 text-sm text-stone-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
              </span>
              Same-day delivery on selected areas
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Stats card — large screens only */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:block"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/70 overflow-hidden w-52 xl:w-56">
            {[
              { icon: "🛒", value: "Happy Customers", label: "THOUSANDS SERVED" },
              { icon: "⭐", value: "4.9 / 5 ★",       label: "RATING" },
              { icon: "🚀", value: "3hr Delivery",     label: "AVG. DELIVERY TIME" },
            ].map((s, i) => (
              <div key={s.label} className={`flex items-center gap-3 px-4 py-3.5 ${i < 2 ? "border-b border-stone-100" : ""}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base bg-orange-50">{s.icon}</span>
                <div>
                  <p className="text-base font-bold text-brand-charcoal leading-none">{s.value}</p>
                  <p className="text-[9px] tracking-[0.14em] text-stone-400 mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-3 justify-end">
            {SLIDES.map((slide, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative w-10 h-7 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === current ? "border-brand-orange scale-110 shadow-md" : "border-transparent opacity-55 hover:opacity-80"}`}
              >
                <Image src={slide.src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Slide controls */}
        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-3">
          <button onClick={prev} className="w-8 h-8 rounded-full border border-stone-300 bg-white/70 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:bg-white transition-all">‹</button>
          <div className="flex gap-1.5 items-center">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-[6px] bg-brand-orange" : "w-[6px] h-[6px] bg-stone-300 hover:bg-stone-400"}`} />
            ))}
          </div>
          <button onClick={next} className="w-8 h-8 rounded-full border border-stone-300 bg-white/70 backdrop-blur-sm flex items-center justify-center text-stone-600 hover:bg-white transition-all">›</button>
        </div>

        {/* Marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-brand-orange py-2.5 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap will-change-transform">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="mx-6 sm:mx-8 text-[10px] sm:text-[11px] font-semibold tracking-[0.1em] uppercase text-white/90">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          2. ANIMATED STATS
      ════════════════════════════ */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-orange-100"
      >
        {[
          { value: 10,  suffix: "k+", label: "Happy Customers",    icon: "😊", bg: "bg-brand-cream" },
          { value: 49,  suffix: "★",  label: "Customer Rating",    icon: "⭐", bg: "bg-white" },
          { value: 50,  suffix: "+",  label: "Trusted Brands",     icon: "🏷️", bg: "bg-brand-cream" },
          { value: 3,   suffix: "h",  label: "Avg. Delivery Time", icon: "⚡", bg: "bg-white" },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            className={`${s.bg} flex flex-col items-center justify-center gap-1.5 sm:gap-2 py-7 sm:py-10 px-3 sm:px-6 text-center border-r border-orange-100 last:border-r-0 cursor-default`}
          >
            <span className="text-2xl sm:text-3xl">{s.icon}</span>
            <p className="font-display text-2xl sm:text-4xl font-bold text-brand-orange"><CountUp target={s.value} suffix={s.suffix} /></p>
            <p className="text-[11px] sm:text-sm text-stone-500 font-medium leading-tight text-center">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ════════════════════════════
          3. SHOP BY CATEGORY
      ════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-8 sm:space-y-10"
      >
        <div className="text-center space-y-3">
          <SectionLabel>Browse</SectionLabel>
          <SectionHeading>Shop by Category</SectionHeading>
          <motion.p variants={fadeUp} className="text-stone-500 max-w-md mx-auto text-sm sm:text-base">
            Everything you need, organized just the way you like it.
          </motion.p>
        </div>

        <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.label}
              variants={scaleIn}
              whileHover={{ y: -6, scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href={`/products?category=${encodeURIComponent(cat.label)}`}
                className="relative flex flex-col items-center justify-end overflow-hidden rounded-2xl w-full group block"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5 z-10" />
                <div
                  className="absolute inset-0 z-10 opacity-0 group-hover:opacity-25 transition-opacity duration-300"
                  style={{ backgroundColor: cat.accent }}
                />
                <div className="relative z-20 w-full px-2 sm:px-3 pb-3 sm:pb-4 pt-2 text-center">
                  <p className="text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-lg">
                    {cat.label}
                  </p>
                  <p className="text-white/65 text-[10px] sm:text-[11px] mt-0.5">
                    {cat.count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ════════════════════════════
          4. FEATURED PRODUCTS
      ════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-8 sm:space-y-10"
      >
        <div className="flex items-end justify-between">
          <div>
            <SectionLabel>Handpicked</SectionLabel>
            <SectionHeading>Popular Right Now</SectionHeading>
          </div>
          <motion.div variants={fadeUp}><Button href="/products" variant="ghost">View all →</Button></motion.div>
        </div>
        <motion.div variants={scaleIn}>
          <ProductGrid products={products.slice(0, 3)} className="sm:grid-cols-3" />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════
          5. SPLIT FEATURE SECTION
      ════════════════════════════ */}
      <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          variants={slideLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-6"
        >
          <SectionLabel>Our Promise</SectionLabel>
          <SectionHeading>Your Complete<br /><em className="not-italic text-brand-orange">Grocery Store.</em></SectionHeading>
          <p className="text-stone-500 leading-relaxed max-w-md text-sm sm:text-base">
            FreshCart brings the full supermarket experience to your fingertips. From daily essentials to specialty items, we stock everything your household needs — handpicked for quality and delivered with care.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🛒", label: "One-stop shopping" },
              { icon: "🚚", label: "Same-day delivery" },
              { icon: "🌡️", label: "Cold-chain certified" },
              { icon: "🏷️", label: "Best price guarantee" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-brand-cream border border-orange-100">
                <span className="text-lg sm:text-xl">{f.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-brand-charcoal">{f.label}</span>
              </div>
            ))}
          </div>
          <Button href="/products" variant="primary">Shop Now</Button>
        </motion.div>

        <motion.div
          variants={slideRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="relative mt-10 lg:mt-0"
        >
          <div className="relative h-64 sm:h-80 lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/hero2.jpg" alt="Fresh grocery selection" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 bg-white rounded-xl sm:rounded-2xl shadow-xl px-3 sm:px-5 py-2.5 sm:py-4 flex items-center gap-2 sm:gap-3 border border-orange-100"
          >
            <span className="text-xl sm:text-2xl">🌿</span>
            <div>
              <p className="font-bold text-brand-charcoal text-xs sm:text-sm">Always Fresh</p>
              <p className="text-[10px] sm:text-xs text-stone-400">Quality guaranteed</p>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute -top-4 -right-3 sm:-top-5 sm:-right-5 bg-white rounded-xl sm:rounded-2xl shadow-xl px-3 sm:px-5 py-2.5 sm:py-4 flex items-center gap-2 sm:gap-3 border border-orange-100"
          >
            <span className="text-xl sm:text-2xl">⚡</span>
            <div>
              <p className="font-bold text-brand-charcoal text-xs sm:text-sm">3hr Delivery</p>
              <p className="text-[10px] sm:text-xs text-stone-400">Order placed, done!</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════
          6. WHY CHOOSE US
      ════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-10 sm:space-y-12"
      >
        <div className="text-center space-y-3">
          <SectionLabel>Why FreshCart</SectionLabel>
          <SectionHeading>Built Around You</SectionHeading>
          <motion.p variants={fadeUp} className="text-stone-500 max-w-md mx-auto text-sm sm:text-base">
            We didn't just build a grocery app. We rethought the entire experience.
          </motion.p>
        </div>
        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {WHY_US.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.09)", transition: { type: "spring", stiffness: 400, damping: 20 } }}
              className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-stone-100 shadow-sm cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-orange-50 text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="font-display text-base sm:text-lg font-bold text-brand-charcoal mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ════════════════════════════
          7. NEW ARRIVALS
      ════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-8 sm:space-y-10"
      >
        <div className="flex items-end justify-between">
          <div>
            <SectionLabel>New Arrivals</SectionLabel>
            <SectionHeading>Just Landed</SectionHeading>
          </div>
          <motion.div variants={fadeUp}><Button href="/products" variant="ghost">Browse all →</Button></motion.div>
        </div>
        <motion.div variants={scaleIn}>
          <ProductGrid products={products.slice(3, 6)} className="sm:grid-cols-3" />
        </motion.div>
      </motion.section>

      {/* ════════════════════════════
          8. TESTIMONIALS
      ════════════════════════════ */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="space-y-10 sm:space-y-12"
      >
        <div className="text-center space-y-3">
          <SectionLabel>Reviews</SectionLabel>
          <SectionHeading>Loved by Thousands</SectionHeading>
          <motion.p variants={fadeUp} className="text-stone-500 max-w-md mx-auto text-sm sm:text-base">
            Don't take our word for it — here's what our customers say.
          </motion.p>
        </div>
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex text-brand-orange text-sm mb-4">{"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}</div>
                <p className="text-stone-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-brand-orange to-amber-400 flex items-center justify-center text-white text-xs font-bold shrink-0">{t.avatar}</div>
                  <div>
                    <p className="font-semibold text-brand-charcoal text-sm">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ════════════════════════════
          9. CTA BANNER
      ════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-green-dk via-brand-green to-green-400 px-6 sm:px-8 py-14 sm:py-20 text-center shadow-green"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-brand-orange/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-white/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border border-white/10" style={{ animationDirection: "reverse" }} />

        <div className="relative z-10 space-y-5 sm:space-y-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white"
          >Limited Offer</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          >Free Delivery on<br />Your First Order</motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-md text-sm sm:text-base text-white/80"
          >
            Use code{" "}
            <strong className="rounded-md bg-white/25 px-2 py-0.5 font-bold text-white tracking-wider">FRESH10</strong>
            {" "}at checkout. Fresh groceries, zero delivery fee.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button href="/products" variant="primary">Claim Offer</Button>
            <Link href="/products" className="text-white/80 text-sm underline underline-offset-4 hover:text-white transition-colors">
              Browse products first →
            </Link>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
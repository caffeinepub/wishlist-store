import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useGetAllProducts } from "../hooks/useQueries";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const { data: products, isLoading } = useGetAllProducts();

  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden bg-secondary/20">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.93 0.009 75), transparent)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-6"
          >
            Wishlist — Singapore
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground leading-tight mb-6"
          >
            Find What You've
            <br />
            Always Wanted
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-body text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10"
          >
            Thoughtfully curated clothing that bridges inspiration and real
            life. Each piece designed to feel intentional, wearable, and
            timeless.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/shop"
              data-ocid="home.shop_now_button"
              className="font-body text-sm tracking-widest uppercase bg-foreground text-background px-8 py-3.5 hover:opacity-80 transition-opacity inline-flex items-center gap-2"
            >
              Shop Now
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/shop"
              data-ocid="home.explore_button"
              className="font-body text-sm tracking-widest uppercase border border-foreground text-foreground px-8 py-3.5 hover:bg-foreground hover:text-background transition-colors"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-border animate-pulse" />
        </motion.div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
              The Collection
            </p>
            <h2 className="font-display text-4xl font-semibold text-foreground">
              Featured Pieces
            </h2>
          </div>
          <Link
            to="/shop"
            className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors link-underline w-fit flex items-center gap-1.5"
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="product-image-ratio w-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(products ?? []).slice(0, 4).map((product, i) => (
              <motion.div
                key={product.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <ProductCard product={product} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─── Social Impact Banner ─────────────────────────────────── */}
      <section className="bg-foreground text-background py-16 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="font-body text-xs tracking-widest uppercase opacity-60 mb-4">
            Our Commitment
          </p>
          <p className="font-display text-2xl sm:text-3xl font-medium leading-relaxed">
            1% of every purchase is contributed toward supporting initiatives
            that help feed people in need.
          </p>
        </motion.div>
      </section>

      {/* ─── Brand Story Teaser ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Our Story
            </p>
            <h2 className="font-display text-4xl font-semibold text-foreground mb-6 leading-tight">
              Bridging Inspiration
              <br />& Real Life
            </h2>
            <p className="font-body text-base text-muted-foreground leading-relaxed mb-8">
              Wishlist was founded with a simple idea: even though there are
              countless clothes in the world, it's often hard to find the ones
              you truly want.
            </p>
            <Link
              to="/about"
              className="font-body text-sm tracking-widest uppercase border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity inline-flex items-center gap-2"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="product-image-ratio bg-white rounded-sm overflow-hidden">
              <img
                src="/assets/uploads/0b4a647c5c0d72c3c555e4c453eaecf1-1.jpg"
                alt="Brand story"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="product-image-ratio bg-white rounded-sm overflow-hidden mt-8">
              <img
                src="/assets/uploads/77e7db1cfaa122f30cdd3542264cd8af-2.jpg"
                alt="Brand story"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

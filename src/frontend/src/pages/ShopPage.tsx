import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useGetAllProducts } from "../hooks/useQueries";
import { STATIC_PRODUCTS } from "../utils/staticProducts";

export default function ShopPage() {
  useGetAllProducts(); // warm the cache but don't use backend imageUrls

  // Always use STATIC_PRODUCTS — they have bundled image paths guaranteed to
  // survive the build. Backend product imageUrls are legacy paths that get
  // stripped, so we never render backend products directly.
  const products = STATIC_PRODUCTS;

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
          All Products
        </p>
        <h1 className="font-display text-5xl font-semibold text-foreground">
          The Collection
        </h1>
      </motion.div>

      {/* Products grid — always visible immediately */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {products.map((product, i) => (
          <motion.div
            key={product.id.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <ProductCard product={product} index={i + 1} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}

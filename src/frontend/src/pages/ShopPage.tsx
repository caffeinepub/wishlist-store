import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useGetAllProducts } from "../hooks/useQueries";
import { STATIC_PRODUCTS } from "../utils/staticProducts";

export default function ShopPage() {
  const { data: backendProducts, isLoading } = useGetAllProducts();

  // Use backend products if available, otherwise fall back to static products
  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : isLoading
        ? null
        : STATIC_PRODUCTS;

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

      {/* Loading state */}
      {isLoading && !products && (
        <div
          data-ocid="shop.loading_state"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="product-image-ratio w-full" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* Products grid */}
      {products && products.length > 0 && (
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
      )}
    </main>
  );
}

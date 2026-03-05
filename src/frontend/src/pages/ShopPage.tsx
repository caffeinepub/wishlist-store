import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { useGetAllProducts } from "../hooks/useQueries";

export default function ShopPage() {
  const { data: products, isLoading, isError } = useGetAllProducts();

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

      {/* Error state */}
      {isError && (
        <div
          data-ocid="shop.error_state"
          className="text-center py-20 text-muted-foreground font-body"
        >
          <p>Unable to load products. Please try again.</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
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
      {!isLoading &&
        !isError &&
        (products && products.length === 0 ? (
          <div
            data-ocid="shop.empty_state"
            className="text-center py-24 text-muted-foreground font-body"
          >
            <p className="text-lg">No products available yet.</p>
            <p className="text-sm mt-2">Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {(products ?? []).map((product, i) => (
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
        ))}
    </main>
  );
}

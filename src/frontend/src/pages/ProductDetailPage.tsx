import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useGetProduct } from "../hooks/useQueries";
import { formatPrice } from "../utils/format";

const SIZES = ["Small", "Medium", "Large"];

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const productId = BigInt(id);

  const { data: product, isLoading, isError } = useGetProduct(productId);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (!product) return;
    addItem(product, selectedSize);
    toast.success(`${product.name} added to cart`);
    setSizeError(false);
  };

  const handlePlaceOrder = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    if (!product) return;
    addItem(product, selectedSize);
    navigate({ to: "/checkout" });
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="product-image-ratio w-full" />
          <div className="flex flex-col gap-4 pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-6 w-20 mt-2" />
            <Skeleton className="h-20 w-full mt-4" />
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>
            <Skeleton className="h-12 w-full mt-6" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 text-center">
        <p className="font-body text-muted-foreground">Product not found.</p>
        <Link
          to="/shop"
          className="font-body text-sm underline mt-4 inline-block"
        >
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      {/* Back */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft size={15} />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="product-image-ratio w-full overflow-hidden bg-secondary/40"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col py-2"
        >
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">
            {product.category}
          </p>
          <h1 className="font-display text-4xl font-semibold text-foreground leading-tight mb-4">
            {product.name}
          </h1>
          <p className="font-body text-2xl text-foreground mb-6">
            {formatPrice(product.price)}
          </p>

          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size selection */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="font-body text-xs tracking-widest uppercase text-foreground">
                Select Size
              </p>
              {sizeError && (
                <p
                  data-ocid="product.size_error"
                  className="font-body text-xs text-destructive"
                >
                  Please select a size
                </p>
              )}
            </div>
            <div data-ocid="product.size_select" className="flex gap-3">
              {SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSizeError(false);
                  }}
                  className={`font-body text-sm px-5 py-2.5 border transition-colors ${
                    selectedSize === size
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground"
                  }`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              data-ocid="product.add_to_cart_button"
              onClick={handleAddToCart}
              variant="outline"
              className="w-full font-body tracking-widest uppercase text-sm h-12 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-none"
            >
              <ShoppingBag size={16} className="mr-2" />
              Add to Cart
            </Button>
            <Button
              data-ocid="product.place_order_button"
              onClick={handlePlaceOrder}
              className="w-full font-body tracking-widest uppercase text-sm h-12 bg-foreground text-background hover:opacity-80 rounded-none"
            >
              Place Order
            </Button>
          </div>

          {/* Delivery notice */}
          <div className="mt-8 pt-6 border-t border-border space-y-1.5">
            <p className="font-body text-xs text-muted-foreground">
              📦 Estimated delivery: 14–18 days after order confirmation
            </p>
            <p className="font-body text-xs text-muted-foreground">
              🇸🇬 Available for delivery in Singapore only
            </p>
            <p className="font-body text-xs text-muted-foreground">
              💳 Cash on Delivery
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

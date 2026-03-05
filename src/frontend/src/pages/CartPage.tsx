import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export default function CartPage() {
  const { items, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  return (
    <main className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
          Your Bag
        </p>
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Shopping Cart
        </h1>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 border border-border"
          data-ocid="cart.empty_state"
        >
          <ShoppingBag
            size={36}
            strokeWidth={1}
            className="mx-auto text-muted-foreground mb-4"
          />
          <p className="font-body text-muted-foreground mb-6">
            Your cart is empty
          </p>
          <Link
            to="/shop"
            className="font-body text-sm tracking-widest uppercase bg-foreground text-background px-6 py-3 hover:opacity-80 transition-opacity inline-block"
          >
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={`${item.product.id}-${item.size}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  data-ocid={`cart.item.${index + 1}`}
                >
                  <div className="flex gap-5 py-6 border-b border-border">
                    {/* Image */}
                    <Link
                      to="/product/$id"
                      params={{ id: item.product.id.toString() }}
                      className="shrink-0"
                    >
                      <div className="w-20 h-[107px] overflow-hidden bg-secondary/50">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                        {item.product.category}
                      </p>
                      <p className="font-display text-lg font-medium text-foreground leading-snug">
                        {item.product.name}
                      </p>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        Size: {item.size}
                      </p>
                      <p className="font-body text-sm text-foreground mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        type="button"
                        data-ocid={`cart.remove_button.${index + 1}`}
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <X size={16} />
                      </button>
                      <p className="font-body text-sm font-medium text-foreground">
                        {formatPrice(
                          Number(item.product.price) * item.quantity,
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/30 p-6 space-y-4">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                Order Summary
              </p>
              <Separator />
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="text-foreground font-medium">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-body text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <Button
                data-ocid="cart.checkout_button"
                onClick={() => navigate({ to: "/checkout" })}
                className="w-full font-body tracking-widest uppercase text-sm h-12 bg-foreground text-background hover:opacity-80 rounded-none mt-2"
              >
                Proceed to Checkout
                <ArrowRight size={14} className="ml-2" />
              </Button>
              <p className="font-body text-xs text-muted-foreground text-center">
                Cash on Delivery · Singapore only
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

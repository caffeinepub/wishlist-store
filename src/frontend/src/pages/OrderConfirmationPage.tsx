import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useGetOrder } from "../hooks/useQueries";
import { formatPrice } from "../utils/format";

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: "/order-confirmation/$orderId" });
  const orderIdBig = BigInt(orderId);
  const { data: order, isLoading } = useGetOrder(orderIdBig);

  return (
    <main className="max-w-2xl mx-auto px-6 lg:px-12 py-20">
      {/* Success icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-12"
      >
        <CheckCircle
          size={52}
          strokeWidth={1}
          className="mx-auto text-foreground mb-5"
        />
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">
          Order Confirmed
        </p>
        <h1 className="font-display text-4xl font-semibold text-foreground mb-4">
          Thank You
        </h1>
        <p className="font-body text-base text-muted-foreground leading-relaxed">
          Your order has been placed successfully. We'll be in touch soon.
        </p>
      </motion.div>

      {/* Order ID */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-secondary/30 border border-border p-6 mb-8"
      >
        <div className="flex justify-between items-center">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
            Order ID
          </p>
          <p className="font-body text-sm font-medium text-foreground">
            #{orderId}
          </p>
        </div>
      </motion.div>

      {/* Order details */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-16 h-[85px] shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : order ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Customer info */}
          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Name
              </p>
              <p className="font-body text-sm text-foreground">
                {order.customerName}
              </p>
            </div>
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Email
              </p>
              <p className="font-body text-sm text-foreground break-all">
                {order.email}
              </p>
            </div>
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Phone
              </p>
              <p className="font-body text-sm text-foreground">{order.phone}</p>
            </div>
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Payment
              </p>
              <p className="font-body text-sm text-foreground">
                Cash on Delivery
              </p>
            </div>
            <div className="col-span-2">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">
                Shipping Address
              </p>
              <p className="font-body text-sm text-foreground">
                {order.address}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-border pt-6">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Items Ordered
            </p>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={`${item.productId.toString()}-${item.size}`}
                  className="flex justify-between items-start py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-body text-sm text-foreground">
                      Product #{item.productId.toString()}
                    </p>
                    <p className="font-body text-xs text-muted-foreground">
                      Size: {item.size} · Qty: {item.quantity.toString()}
                    </p>
                  </div>
                  <p className="font-body text-sm font-medium text-foreground">
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <p className="font-body text-sm font-semibold text-foreground">
              Order Total
            </p>
            <p className="font-body text-base font-semibold text-foreground">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </motion.div>
      ) : null}

      {/* Delivery notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 space-y-2 border-t border-border pt-6"
      >
        <p className="font-body text-xs text-muted-foreground">
          📦 Estimated delivery: 14–18 days after order confirmation
        </p>
        <p className="font-body text-xs text-muted-foreground">
          🇸🇬 Available for delivery in Singapore only
        </p>
        <p className="font-body text-xs text-muted-foreground">
          Questions? Email us at{" "}
          <a
            href="mailto:Shawnsaiborne@gmail.com"
            className="underline hover:opacity-70 transition-opacity"
          >
            Shawnsaiborne@gmail.com
          </a>
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <Link
          to="/shop"
          data-ocid="confirmation.continue_button"
          className="font-body text-sm tracking-widest uppercase bg-foreground text-background px-8 py-3.5 hover:opacity-80 transition-opacity inline-flex items-center gap-2"
        >
          Continue Shopping
          <ArrowRight size={14} />
        </Link>
      </motion.div>
    </main>
  );
}

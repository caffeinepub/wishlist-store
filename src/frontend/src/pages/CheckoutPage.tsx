import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { usePlaceOrder } from "../hooks/useQueries";
import { formatPrice } from "../utils/format";
import { resolveProductImage } from "../utils/productImages";

interface FormState {
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "A valid email is required.";
  if (!form.address.trim()) errors.address = "Shipping address is required.";
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  return errors;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <p className="font-body text-muted-foreground mb-4">
          Your cart is empty.
        </p>
        <Link
          to="/shop"
          className="font-body text-sm underline text-foreground"
        >
          Return to Shop
        </Link>
      </main>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        size: item.size,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      const orderId = await placeOrder({
        customerName: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        items: orderItems,
      });

      clearCart();
      navigate({
        to: "/order-confirmation/$orderId",
        params: { orderId: orderId.toString() },
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
          Checkout
        </p>
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Complete Your Order
        </h1>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="space-y-5">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
                Customer Information
              </p>

              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="font-body text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  data-ocid="checkout.name_input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  className={`font-body rounded-none h-11 ${errors.name ? "border-destructive" : ""}`}
                />
                {errors.name && (
                  <p
                    className="font-body text-xs text-destructive"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="font-body text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  data-ocid="checkout.email_input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className={`font-body rounded-none h-11 ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && (
                  <p
                    className="font-body text-xs text-destructive"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="font-body text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  data-ocid="checkout.phone_input"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+65 XXXX XXXX"
                  autoComplete="tel"
                  className={`font-body rounded-none h-11 ${errors.phone ? "border-destructive" : ""}`}
                />
                {errors.phone && (
                  <p
                    className="font-body text-xs text-destructive"
                    role="alert"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="address"
                  className="font-body text-xs tracking-widest uppercase text-muted-foreground"
                >
                  Shipping Address *
                </Label>
                <Input
                  id="address"
                  name="address"
                  data-ocid="checkout.address_input"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, unit, postal code"
                  autoComplete="street-address"
                  className={`font-body rounded-none h-11 ${errors.address ? "border-destructive" : ""}`}
                />
                {errors.address && (
                  <p
                    className="font-body text-xs text-destructive"
                    role="alert"
                  >
                    {errors.address}
                  </p>
                )}
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-4">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
                Payment Method
              </p>
              <div className="flex items-center gap-3 bg-secondary/40 border border-border p-4">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.5}
                  className="text-foreground shrink-0"
                />
                <div>
                  <p className="font-body text-sm font-medium text-foreground">
                    Cash on Delivery
                  </p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Pay when your order arrives. Only available in Singapore.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery notice */}
            <div className="space-y-2 pt-2">
              <p className="font-body text-xs text-muted-foreground">
                📦 Estimated delivery: 14–18 days after order confirmation
              </p>
              <p className="font-body text-xs text-muted-foreground">
                🇸🇬 Available for delivery in Singapore only
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-secondary/30 p-6 space-y-4 sticky top-24">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
                Order Summary
              </p>
              <Separator />
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-14 h-[75px] bg-secondary/50 shrink-0 overflow-hidden">
                      <img
                        src={resolveProductImage(item.product.imageUrl)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground leading-snug line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        {item.size} × {item.quantity}
                      </p>
                      <p className="font-body text-sm text-foreground font-medium mt-1">
                        {formatPrice(
                          Number(item.product.price) * item.quantity,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-body text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>

              <Button
                type="submit"
                data-ocid="checkout.submit_button"
                disabled={isPending}
                className="w-full font-body tracking-widest uppercase text-sm h-12 bg-foreground text-background hover:opacity-80 rounded-none mt-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} className="mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              {isPending && (
                <p
                  data-ocid="checkout.loading_state"
                  className="font-body text-xs text-muted-foreground text-center"
                >
                  Processing your order...
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

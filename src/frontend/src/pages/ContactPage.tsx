import { Mail, MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function ContactPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-secondary/20 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Get in Touch
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold text-foreground leading-tight">
            Contact
          </h1>
        </motion.div>
      </section>

      {/* Contact details */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-10"
        >
          <p className="font-body text-base text-muted-foreground leading-relaxed">
            Have a question about an order, a product, or just want to say
            hello? We'd love to hear from you.
          </p>

          {/* Email */}
          <div className="flex gap-5 items-start border-t border-border pt-8">
            <div className="w-10 h-10 flex items-center justify-center bg-secondary shrink-0">
              <Mail size={18} strokeWidth={1.5} className="text-foreground" />
            </div>
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1.5">
                Email
              </p>
              <a
                href="mailto:Shawnsaiborne@gmail.com"
                className="font-body text-lg text-foreground hover:opacity-70 transition-opacity link-underline"
              >
                Shawnsaiborne@gmail.com
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-5 items-start border-t border-border pt-8">
            <div className="w-10 h-10 flex items-center justify-center bg-secondary shrink-0">
              <MapPin size={18} strokeWidth={1.5} className="text-foreground" />
            </div>
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1.5">
                Location
              </p>
              <p className="font-body text-lg text-foreground">Singapore</p>
              <p className="font-body text-sm text-muted-foreground mt-0.5">
                Delivery available in Singapore only
              </p>
            </div>
          </div>

          {/* Notice */}
          <div className="border-t border-border pt-8">
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Estimated delivery time: 14–18 days after order confirmation.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

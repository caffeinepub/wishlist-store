import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-secondary/20 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Our Story
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold text-foreground leading-tight">
            The Idea Behind
            <br />
            Wishlist
          </h1>
        </motion.div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <p className="font-body text-lg text-foreground leading-[1.8]">
            Wishlist was founded by Kento Wong Lee with a simple idea: even
            though there are countless clothes in the world, it's often hard to
            find the ones you truly want.
          </p>
          <p className="font-body text-base text-muted-foreground leading-[1.8]">
            Inspired by curated, editorial fashion seen online, Wishlist was
            created to bring those ideas into reality. Every piece is
            thoughtfully selected and designed to feel intentional, wearable,
            and timeless — bridging inspiration and real life.
          </p>
          <p className="font-body text-base text-muted-foreground leading-[1.8]">
            Wishlist exists to make finding the right clothing effortless,
            honest, and inspiring.
          </p>
        </motion.div>

        {/* Founder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-14 pt-10 border-t border-border"
        >
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">
            Founded By
          </p>
          <p className="font-display text-3xl font-semibold text-foreground">
            Kento Wong Lee
          </p>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Singapore
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {[
            {
              title: "Intentional",
              desc: "Every piece is selected with purpose and care.",
            },
            {
              title: "Timeless",
              desc: "Clothing designed to outlast trends.",
            },
            {
              title: "Honest",
              desc: "Transparent about what we make and why.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="border-t border-border pt-5">
              <p className="font-display text-xl font-semibold text-foreground mb-2">
                {title}
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Impact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 bg-foreground text-background px-8 py-10 rounded-sm"
        >
          <p className="font-body text-xs tracking-widest uppercase opacity-60 mb-3">
            Our Commitment
          </p>
          <p className="font-display text-2xl font-medium leading-relaxed">
            1% of every purchase is contributed toward supporting initiatives
            that help feed people in need.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

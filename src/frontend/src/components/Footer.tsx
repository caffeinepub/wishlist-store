import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="border-t border-border bg-secondary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl font-semibold text-foreground mb-3">
              Wishlist
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs">
              Curated clothing that bridges inspiration and real life.
            </p>
            <p className="font-body text-xs text-muted-foreground mt-4 leading-relaxed">
              1% of every purchase is contributed toward supporting initiatives
              that help feed people in need.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Navigate
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors link-underline w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Contact
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:Shawnsaiborne@gmail.com"
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Shawnsaiborne@gmail.com
              </a>
              <p className="font-body text-sm text-muted-foreground">
                Singapore
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                Delivery available in Singapore only
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-body">
          <p>© {year} Wishlist. All rights reserved.</p>
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

const navLinks = [
  { to: "/", label: "Home", ocid: "nav.home_link" },
  { to: "/shop", label: "Shop", ocid: "nav.shop_link" },
  { to: "/about", label: "About", ocid: "nav.about_link" },
  { to: "/contact", label: "Contact", ocid: "nav.contact_link" },
];

export default function Header() {
  const { totalItems } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-tight text-foreground"
          >
            Wishlist
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label, ocid }) => (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                className={`font-body text-sm tracking-wide link-underline transition-colors ${
                  location.pathname === to
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
            {identity && isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin_link"
                className={`font-body text-sm tracking-wide link-underline transition-colors ${
                  location.pathname === "/admin"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              data-ocid="nav.cart_link"
              className="relative flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Cart (${totalItems} items)`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-foreground text-background text-[10px] font-medium rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map(({ to, label, ocid }) => (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                onClick={() => setMenuOpen(false)}
                className={`font-body text-sm py-2.5 border-b border-border/50 tracking-wide ${
                  location.pathname === to
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
            {identity && isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin_link"
                onClick={() => setMenuOpen(false)}
                className={`font-body text-sm py-2.5 border-b border-border/50 tracking-wide ${
                  location.pathname === "/admin"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Admin
              </Link>
            )}
            <Link
              to="/cart"
              data-ocid="nav.cart_link"
              onClick={() => setMenuOpen(false)}
              className="font-body text-sm py-2.5 text-muted-foreground flex items-center gap-2"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

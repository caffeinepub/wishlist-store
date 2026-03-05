import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShopPage from "./pages/ShopPage";

// ─── Root (renders Outlet only; children choose their own chrome) ────
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-right" />
      <Outlet />
    </>
  ),
});

// ─── Storefront layout (header + footer) ────────────────────────────
function StorefrontLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </CartProvider>
  );
}

const storefrontRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "storefront",
  component: StorefrontLayout,
});

// ─── Storefront child routes ─────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/shop",
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/contact",
  component: ContactPage,
});

const cartRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => storefrontRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmationPage,
});

// ─── Admin route (standalone, no site chrome) ────────────────────────
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

// ─── Route tree ──────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  storefrontRoute.addChildren([
    indexRoute,
    shopRoute,
    productRoute,
    aboutRoute,
    contactRoute,
    cartRoute,
    checkoutRoute,
    orderConfirmationRoute,
  ]),
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── App entry ──────────────────────────────────────────────────────
export default function App() {
  return <RouterProvider router={router} />;
}

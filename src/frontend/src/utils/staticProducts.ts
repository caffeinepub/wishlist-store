// Static product data — used as fallback when backend is loading or unavailable.
// These mirror the seed products in the backend (main.mo).
import type { Product } from "../backend.d";
import { img1, img2, img3, img4, img5, img6, img7 } from "./productImages";

export const STATIC_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Wrap Tie Midi Skirt",
    category: "Skirts",
    price: 349900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img1,
    description:
      "Dark charcoal wrap skirt with contrast tie detailing and pleated lower panel. Architectural and refined.",
  },
  {
    id: 2n,
    name: "Draped Wide-Leg Trousers",
    category: "Pants",
    price: 349900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img2,
    description:
      "Architectural wide-leg silhouette with a dramatic draped front panel. Elevated wardrobe staple.",
  },
  {
    id: 3n,
    name: "Plaid-Layered Baggy Jeans",
    category: "Pants",
    price: 349900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img3,
    description:
      "Oversized denim with a deconstructed plaid overlay. Bold, editorial statement piece.",
  },
  {
    id: 4n,
    name: "Plaid-Draped Balloon Pants",
    category: "Pants",
    price: 349900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img4,
    description:
      "Black balloon-leg denim with an oversized draped plaid layer. Dramatic silhouette, maximum impact.",
  },
  {
    id: 5n,
    name: "Chinese Knot Button Shirt",
    category: "Shirts",
    price: 199900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img5,
    description:
      "Natural linen shirt with traditional Chinese frog knot closures. Minimalist heritage meets modern ease.",
  },
  {
    id: 6n,
    name: "Cat Embroidery Plaid Shirt",
    category: "Shirts",
    price: 199900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img6,
    description:
      "Oversized plaid shirt with playful cat embroidery and a detachable tie. Casual charm.",
  },
  {
    id: 7n,
    name: "Cat Print Denim Skirt",
    category: "Skirts",
    price: 349900n,
    sizes: ["Small", "Medium", "Large"],
    imageUrl: img7,
    description:
      "Asymmetric wrap denim skirt with oversized cat graphic print. A statement piece for any wardrobe.",
  },
];

import { Link } from "@tanstack/react-router";
import type { Product } from "../backend.d";
import { formatPrice } from "../utils/format";
import { resolveProductImage } from "../utils/productImages";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article
      data-ocid={`shop.product.item.${index}`}
      className="group flex flex-col"
    >
      <Link to="/product/$id" params={{ id: product.id.toString() }}>
        <div className="product-image-ratio w-full overflow-hidden bg-secondary/50 relative">
          <img
            src={resolveProductImage(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="pt-4 flex flex-col gap-1">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
          {product.category}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.id.toString() }}
          className="font-display text-lg text-foreground hover:text-muted-foreground transition-colors leading-snug"
        >
          {product.name}
        </Link>
        <p className="font-body text-sm text-foreground mt-0.5">
          {formatPrice(product.price)}
        </p>
        <Link
          to="/product/$id"
          params={{ id: product.id.toString() }}
          className="mt-3 font-body text-xs tracking-widest uppercase border border-foreground px-4 py-2.5 text-center hover:bg-foreground hover:text-background transition-colors duration-200 w-full"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}

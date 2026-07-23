import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/context/wishlist-context";
import { formatPrice, calculateDiscount } from "@/utils/format";

interface ProductCardProps {
  product: any;
  onQuickView?: (product: any) => void;
  index?: number;
}

export function ProductCard({
  product,
  onQuickView,
  index = 0,
}: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();

  const productId = product.id || product.id;

  const wishlisted = isWishlisted(productId);

  const discount = calculateDiscount(
    product.price,
    product.salePrice || product.compareAtPrice
  );

  const images =
    product.images?.map((img: any) =>
      typeof img === "string" ? img : img.url
    ) || [];

  const hasSecondImage = images.length > 1;

  const colors: string[] = Array.from(
  new Set(
    (product.variants || [])
      .map((v: any) => v.color as string)
      .filter(Boolean)
  )
);

  const category =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
      }}
      className="group"
    >
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <Link to={`/product/${product.slug}`}>
          <img
            src={
              images[0] ||
              "https://placehold.co/600x800?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {hasSecondImage && (
            <img
              src={images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </Link>

        {/* Badges */}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.newArrival && (
            <span className="bg-background px-2 py-1 text-[10px] uppercase">
              New
            </span>
          )}

          {discount > 0 && (
            <span className="bg-accent text-accent-foreground px-2 py-1 text-[10px] uppercase">
              -{discount}%
            </span>
          )}

          {product.bestSeller && (
            <span className="bg-primary text-primary-foreground px-2 py-1 text-[10px] uppercase">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}

        <button
          onClick={() => toggleWishlist(productId)}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-background/90 backdrop-blur transition-all hover:scale-110",
            wishlisted && "text-accent"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              wishlisted && "fill-current"
            )}
          />
        </button>

        {/* Quick View */}

        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => onQuickView(product)}
              className="w-full bg-background py-3 text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground transition"
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}

      <div className="pt-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {category || "REVVANO"}
        </p>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading text-base hover:text-accent transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-accent text-accent" />

          <span className="text-xs text-muted-foreground">
            {product.averageRating || 0} ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-semibold">
            {formatPrice(product.salePrice || product.price)}
          </span>

          {product.salePrice &&
            product.salePrice < product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
        </div>

        {/* Colors */}

        <div className="flex flex-wrap gap-2 mt-3">
          {colors.map((color: string) => (
            <span
              key={color}
              className="text-[10px] border px-2 py-1 rounded"
            >
              {color}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
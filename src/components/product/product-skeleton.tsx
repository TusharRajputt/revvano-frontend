export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-muted skeleton-shimmer" />
      <div className="pt-3 space-y-2">
        <div className="h-3 w-20 bg-muted skeleton-shimmer" />
        <div className="h-4 w-32 bg-muted skeleton-shimmer" />
        <div className="h-3 w-16 bg-muted skeleton-shimmer" />
        <div className="flex gap-1.5 pt-1">
          <div className="w-3 h-3 rounded-full bg-muted skeleton-shimmer" />
          <div className="w-3 h-3 rounded-full bg-muted skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

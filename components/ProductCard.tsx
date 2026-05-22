import Image from "next/image";
import type { FoodItem, ProductCustomization } from "@/types";
import { formatPrice, getBadgeClasses } from "@/utils/order";

type ProductCardProps = {
  item: FoodItem;
  onAddToCart: (item: FoodItem, customization?: ProductCustomization) => void;
  onSelect: (item: FoodItem) => void;
};

export function ProductCard({ item, onAddToCart, onSelect }: ProductCardProps) {
  return (
    <article
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSelect(item);
        }
      }}
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 outline-none transition duration-300 hover:-translate-y-1 hover:border-orange-400/70 hover:bg-white/[0.07] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
    >
      <div className="relative overflow-hidden">
        {item.isFeatured && (
          <span className="absolute right-0 top-4 z-10 rounded-l-full bg-orange-500 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-orange-500/30">
            Featured
          </span>
        )}
        <Image
          src={item.image}
          alt={item.name}
          width={900}
          height={600}
          unoptimized
          className="h-40 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48"
        />
        {item.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {item.badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-full px-3 py-1 text-xs font-black ${getBadgeClasses(
                  badge,
                )}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
              {item.category}
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight sm:text-xl">
              {item.name}
            </h3>
          </div>
          <p className="shrink-0 rounded-full bg-orange-500/15 px-3 py-1 text-sm font-bold text-orange-300">
            {formatPrice(item.price)}
          </p>
        </div>
        <p className="mt-3 text-sm leading-6 text-neutral-400">
          {item.description}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/25 p-3 text-center text-xs">
          <div>
            <p className="font-black text-white">{item.rating ?? 4.7}</p>
            <p className="mt-1 text-neutral-500">Rating</p>
          </div>
          <div>
            <p className="font-black text-white">{item.prepTime ?? "10-15 min"}</p>
            <p className="mt-1 text-neutral-500">Prep</p>
          </div>
          <div>
            <p className="font-black text-white">{item.calories ?? 520}</p>
            <p className="mt-1 text-neutral-500">Cal</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAddToCart(item);
          }}
          className="pressable mt-5 w-full rounded-full bg-white px-4 py-3 text-sm font-black text-neutral-950 hover:-translate-y-0.5 hover:bg-orange-400 hover:text-white"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

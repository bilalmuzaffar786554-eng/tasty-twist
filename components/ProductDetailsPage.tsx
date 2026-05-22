"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import type { FoodItem } from "@/types";
import { formatPrice, getBadgeClasses } from "@/utils/order";

type ProductDetailsPageProps = {
  product: FoodItem;
};

export function ProductDetailsPage({ product }: ProductDetailsPageProps) {
  const { addToCart } = useCart();

  return (
    <section className="fade-in mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/menu"
        className="text-sm font-bold text-orange-300 transition hover:text-orange-200"
      >
        Back to menu
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/20 blur-3xl" />
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={900}
            priority
            unoptimized
            className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl shadow-black/40"
          />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-400">
            {product.category}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl font-black text-orange-300">
            {formatPrice(product.price)}
          </p>

          {product.badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {product.badges.map((badge) => (
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

          <p className="mt-6 text-lg leading-8 text-neutral-300">
            {product.details}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <div>
              <p className="text-xl font-black text-white">
                {product.rating ?? 4.7}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">Rating</p>
            </div>
            <div>
              <p className="text-xl font-black text-white">
                {product.prepTime ?? "10-15 min"}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">Prep</p>
            </div>
            <div>
              <p className="text-xl font-black text-white">
                {product.calories ?? 520}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">
                Calories
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-black">Ingredients</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-neutral-300"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="mt-8 w-full rounded-full bg-orange-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-400 sm:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

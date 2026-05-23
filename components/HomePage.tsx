"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { useCart } from "@/components/CartProvider";
import { menuItems } from "@/data/products";
import type { FoodItem } from "@/types";
import { getMenuProducts } from "@/utils/products";

export function HomePage() {
  const { addToCart, openCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(null);
  const [products, setProducts] = useState<FoodItem[]>(menuItems);
  const featuredItems = useMemo(
    () => products.filter((item) => item.badges.length > 0).slice(0, 4),
    [products],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      getMenuProducts().then(setProducts);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Hero onOpenCart={openCart} />

      <section
        id="menu"
        className="fade-in mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm sm:tracking-[0.24em]">
              Featured
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Popular picks
            </h2>
          </div>
          <Link
            href="/menu"
            className="pressable rounded-full bg-orange-500 px-6 py-3 text-center text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:bg-orange-400"
          >
            View Full Menu
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center shadow-2xl shadow-black/20 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm sm:tracking-[0.24em]">
            Ready to order?
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            Build your meal in minutes.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
            Browse the menu, add favorites to the cart, and place a cash order
            through the frontend checkout flow.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/menu"
              className="pressable rounded-full bg-orange-500 px-7 py-4 text-sm font-black text-white hover:bg-orange-400"
            >
              Start Ordering
            </Link>
            <Link
              href="/orders"
              className="pressable rounded-full border border-white/10 px-7 py-4 text-sm font-black text-neutral-200 hover:border-orange-400 hover:text-orange-300"
            >
              View Orders
            </Link>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onAddToCart={addToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { useCart } from "@/components/CartProvider";
import { categories, menuItems } from "@/data/products";
import type { Category, FoodItem } from "@/types";

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const { addToCart } = useCart();
  const visibleCategories = categories.filter(
    (category): category is Exclude<Category, "All"> => category !== "All",
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoadingProducts(false);
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      return;
    }

    const observers = visibleCategories.map((category) => {
      const section = document.getElementById(`category-${category}`);

      if (!section) {
        return null;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSelectedCategory(category);
          }
        },
        { rootMargin: "-35% 0px -55% 0px" },
      );

      observer.observe(section);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [searchQuery, visibleCategories]);

  const filteredItems = useMemo(() => {
    const cleanSearch = searchQuery.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const searchableText = [
        item.name,
        item.category,
        item.description,
        item.ingredients.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        cleanSearch.length === 0 || searchableText.includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const groupedItems = useMemo(() => {
    return visibleCategories.map((category) => ({
      category,
      items: menuItems.filter((item) => item.category === category),
    }));
  }, [visibleCategories]);

  const isSearching = searchQuery.trim().length > 0;

  function scrollToCategory(category: Category) {
    setSelectedCategory(category);

    if (category === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document
      .getElementById(`category-${category}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="fade-in mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 lg:mb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm sm:tracking-[0.24em]">
              Full menu
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Find your next craving
            </h1>
          </div>

          <div className="w-full max-w-xl">
            <label htmlFor="food-search" className="sr-only">
              Search food
            </label>
            <input
              id="food-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search name, category, or ingredients..."
              className="w-full rounded-full border border-white/10 bg-white/[0.06] px-5 py-3.5 text-sm font-semibold text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-400 focus:bg-white/[0.09] focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
        </div>

        <div className="sticky top-[73px] z-30 -mx-4 mb-8 border-y border-white/10 bg-neutral-950/90 px-4 py-3 backdrop-blur-xl sm:top-[81px] sm:mx-0 sm:rounded-3xl sm:border sm:bg-white/[0.04]">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => scrollToCategory(category)}
                className={`pressable shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold hover:-translate-y-0.5 ${
                  isActive
                    ? "border-orange-400 bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                }`}
              >
                {category}
              </button>
            );
          })}
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="skeleton-card h-[430px] rounded-2xl border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : isSearching ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-14">
            {groupedItems.map(({ category, items }) => (
              <section
                key={category}
                id={`category-${category}`}
                className="scroll-mt-36"
              >
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
                      Category
                    </p>
                    <h2 className="mt-2 text-3xl font-black">{category}</h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-neutral-300">
                    {items.length} items
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                      onSelect={setSelectedProduct}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {!isLoadingProducts && filteredItems.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            <p className="text-xl font-black">No items found.</p>
            <p className="mt-2 text-sm text-neutral-400">
              Try another search or choose a different category.
            </p>
          </div>
        )}
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

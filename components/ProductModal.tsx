"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  AddOn,
  FoodItem,
  ProductCustomization,
  ProductSize,
  SpiceLevel,
} from "@/types";
import {
  addOnOptions,
  formatPrice,
  getBadgeClasses,
  getCustomizedUnitPrice,
  sizeOptions,
  spiceLevels,
} from "@/utils/order";

type ProductModalProps = {
  product: FoodItem;
  onAddToCart: (product: FoodItem, customization?: ProductCustomization) => void;
  onClose: () => void;
};

export function ProductModal({
  product,
  onAddToCart,
  onClose,
}: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize>("Regular");
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel>("Mild");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [instructions, setInstructions] = useState("");

  const customization = useMemo(
    () => ({
      size: selectedSize,
      spiceLevel: selectedSpice,
      addOns: selectedAddOns,
      instructions,
    }),
    [instructions, selectedAddOns, selectedSize, selectedSpice],
  );
  const unitPrice = getCustomizedUnitPrice(product, customization);

  function toggleAddOn(addOn: AddOn) {
    setSelectedAddOns((currentAddOns) =>
      currentAddOns.includes(addOn)
        ? currentAddOns.filter((currentAddOn) => currentAddOn !== addOn)
        : [...currentAddOns, addOn],
    );
  }

  function addCustomizedProductToCart() {
    onAddToCart(product, customization);
    onClose();
  }

  return (
    <div
      className="fade-in fixed inset-0 z-[80] flex items-end justify-center bg-black/75 px-3 py-3 backdrop-blur sm:items-center sm:px-4 sm:py-8"
      onClick={onClose}
    >
      <div
        className="modal-panel max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative">
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={800}
            unoptimized
            className="h-52 w-full object-cover sm:h-96"
          />
          <button
            type="button"
            onClick={onClose}
            className="pressable absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-lg font-black text-white backdrop-blur hover:bg-orange-500"
            aria-label="Close product details"
          >
            x
          </button>
        </div>

        <div className="p-4 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                {product.category}
              </p>
              <h2 className="mt-2 text-2xl font-black leading-tight sm:text-4xl">
                {product.name}
              </h2>
            </div>
            <p className="w-fit rounded-full bg-orange-500/15 px-4 py-2 text-xl font-black text-orange-300">
              {formatPrice(unitPrice)}
            </p>
          </div>

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

          <p className="mt-5 text-sm leading-7 text-neutral-300 sm:mt-6 sm:text-base sm:leading-8">
            {product.details}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 text-center text-sm">
            <div>
              <p className="text-lg font-black text-white">
                {product.rating ?? 4.7}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">Rating</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">
                {product.prepTime ?? "10-15 min"}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">Prep</p>
            </div>
            <div>
              <p className="text-lg font-black text-white">
                {product.calories ?? 520}
              </p>
              <p className="mt-1 text-xs font-bold text-neutral-500">
                Calories
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:mt-8 sm:p-5">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-neutral-300">
                Size
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {sizeOptions.map((option) => {
                  const isSelected = selectedSize === option.label;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setSelectedSize(option.label)}
                      className={`pressable rounded-2xl border px-4 py-3 text-left ${
                        isSelected
                          ? "border-orange-400 bg-orange-500 text-white"
                          : "border-white/10 bg-black/25 text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                      }`}
                    >
                      <span className="block text-sm font-black">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs font-bold opacity-80">
                        {option.price > 0
                          ? `+${formatPrice(option.price)}`
                          : "Included"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-neutral-300">
                Spice level
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {spiceLevels.map((level) => {
                  const isSelected = selectedSpice === level;

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSelectedSpice(level)}
                      className={`pressable rounded-2xl border px-4 py-3 text-sm font-black ${
                        isSelected
                          ? "border-red-400 bg-red-500 text-white"
                          : "border-white/10 bg-black/25 text-neutral-300 hover:border-red-400 hover:text-red-300"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-neutral-300">
                Extra add-ons
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {addOnOptions.map((option) => {
                  const isSelected = selectedAddOns.includes(option.label);

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => toggleAddOn(option.label)}
                      className={`pressable flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${
                        isSelected
                          ? "border-orange-400 bg-orange-500/20 text-white"
                          : "border-white/10 bg-black/25 text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                      }`}
                    >
                      <span className="font-black">{option.label}</span>
                      <span className="font-bold text-orange-300">
                        +{formatPrice(option.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                htmlFor="special-instructions"
                className="mb-3 block text-sm font-black uppercase tracking-[0.18em] text-neutral-300"
              >
                Special instructions
              </label>
              <textarea
                id="special-instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                placeholder="No onions, extra crispy, sauce on the side..."
                className="min-h-24 w-full resize-none rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <button
              type="button"
              onClick={addCustomizedProductToCart}
              className="pressable rounded-full bg-orange-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-400"
            >
              Add to Cart - {formatPrice(unitPrice)}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="pressable rounded-full border border-white/10 px-7 py-4 text-sm font-black text-neutral-200 hover:border-orange-400 hover:text-orange-300"
            >
              Keep Browsing
            </button>
            <Link
              href={`/product/${product.id}`}
              className="pressable rounded-full border border-white/10 px-7 py-4 text-center text-sm font-black text-neutral-200 hover:border-orange-400 hover:text-orange-300"
            >
              Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

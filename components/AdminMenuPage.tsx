"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { categories, menuItems } from "@/data/products";
import type { Badge, Category, FoodItem } from "@/types";
import { formatPrice } from "@/utils/order";
import {
  createProductInSupabase,
  deleteProductFromSupabase,
  fetchProductsFromSupabase,
  updateProductAvailabilityInSupabase,
  updateProductInSupabase,
} from "@/utils/products";

const badgeOptions: Badge[] = ["Popular", "Spicy", "New", "Best Seller"];
const productCategories = categories.filter(
  (category): category is Exclude<Category, "All"> => category !== "All",
);

type ProductFormState = {
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  details: string;
  price: string;
  image: string;
  ingredients: string;
  isAvailable: boolean;
  badges: Badge[];
};

const emptyForm: ProductFormState = {
  name: "",
  category: "Burgers",
  description: "",
  details: "",
  price: "",
  image: "",
  ingredients: "",
  isAvailable: true,
  badges: [],
};

function productToForm(product: FoodItem): ProductFormState {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    details: product.details,
    price: product.price.toString(),
    image: product.image,
    ingredients: product.ingredients.join(", "),
    isAvailable: product.isAvailable ?? true,
    badges: product.badges,
  };
}

export function AdminMenuPage() {
  const [products, setProducts] = useState<FoodItem[]>(menuItems);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [message, setMessage] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category>("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProducts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const formTitle = editingId ? "Edit product" : "Add product";

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter(
      (product) => categoryFilter === "All" || product.category === categoryFilter,
    );

    return [...filteredProducts].sort((first, second) => {
      if (sortBy === "price-low") {
        return first.price - second.price;
      }

      if (sortBy === "price-high") {
        return second.price - first.price;
      }

      if (sortBy === "name") {
        return first.name.localeCompare(second.name);
      }

      return String(second.id).localeCompare(String(first.id));
    });
  }, [categoryFilter, products, sortBy]);

  async function loadProducts() {
    try {
      const supabaseProducts = await fetchProductsFromSupabase({
        includeUnavailable: true,
      });

      setProducts(supabaseProducts);
      setMessage(
        supabaseProducts.length > 0
          ? ""
          : "No Supabase products found yet. Add your first product here.",
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to load products.";

      setProducts(menuItems);
      setMessage(`Supabase products error: ${errorMessage}`);
    }
  }

  function updateForm(field: keyof ProductFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setMessage("");
  }

  function toggleBadge(badge: Badge) {
    setForm((currentForm) => ({
      ...currentForm,
      badges: currentForm.badges.includes(badge)
        ? currentForm.badges.filter((currentBadge) => currentBadge !== badge)
        : [...currentForm.badges, badge],
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const price = Number(form.price);

    if (!form.name.trim() || !form.description.trim() || !price) {
      setMessage("Name, description, and price are required.");
      return;
    }

    const product: FoodItem = {
      id: editingId ?? "",
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      details: form.details.trim() || form.description.trim(),
      price,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
      ingredients: form.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      badges: form.badges,
      calories: 520,
      isAvailable: form.isAvailable,
      isFeatured: form.badges.includes("Popular"),
      prepTime: "10-15 min",
      rating: 4.7,
    };

    try {
      const savedProduct = editingId
        ? await updateProductInSupabase(editingId, product)
        : await createProductInSupabase(product);

      setProducts((currentProducts) =>
        editingId
          ? currentProducts.map((item) =>
              item.id === editingId ? savedProduct : item,
            )
          : [savedProduct, ...currentProducts],
      );
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Product updated in Supabase." : "Product added to Supabase.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to save product.";

      setMessage(`Supabase products error: ${errorMessage}`);
    }
  }

  function editProduct(product: FoodItem) {
    setEditingId(product.id);
    setForm(productToForm(product));
    setMessage("");
  }

  async function deleteProduct(productId: number | string) {
    try {
      await deleteProductFromSupabase(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );
      setMessage("Product deleted from Supabase.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to delete product.";

      setMessage(`Supabase products error: ${errorMessage}`);
    }
  }

  async function toggleAvailability(productId: number | string) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    try {
      const updatedProduct = await updateProductAvailabilityInSupabase(
        productId,
        !(product.isAvailable ?? true),
      );

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === productId ? updatedProduct : item,
        ),
      );
      setMessage("Availability updated in Supabase.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to update availability.";

      setMessage(`Supabase products error: ${errorMessage}`);
    }
  }

  function resetToDefaultMenu() {
    loadProducts();
    resetForm();
  }

  return (
    <AdminShell>
      <div className="fade-in">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm">
              Admin menu
            </p>
            <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">
              Manage menu
            </h1>
            <p className="mt-4 max-w-2xl text-neutral-400">
              Frontend-only menu management saved in this browser.
            </p>
          </div>

          <button
            type="button"
            onClick={resetToDefaultMenu}
            className="pressable rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-neutral-300 hover:border-orange-400 hover:text-orange-300"
          >
            Reload Products
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px_1fr] xl:items-start">
          <form
            onSubmit={submitProduct}
            className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20"
          >
            <h2 className="text-2xl font-black">{formTitle}</h2>
            <div className="mt-5 grid gap-4">
              <input
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Product name"
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              />

              <select
                value={form.category}
                onChange={(event) =>
                  updateForm("category", event.target.value)
                }
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              >
                {productCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
                placeholder="Price, e.g. 899"
                type="number"
                min="0"
                step="0.01"
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              />

              <div className="rounded-3xl border border-dashed border-orange-400/30 bg-orange-500/10 p-4">
                <p className="text-sm font-black text-orange-200">
                  Product image
                </p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  Paste an image URL. This area is styled like a drag/drop zone
                  for now.
                </p>
                {form.image && (
                  <Image
                    src={form.image}
                    alt="Product preview"
                    width={700}
                    height={360}
                    unoptimized
                    className="mt-4 h-40 w-full rounded-2xl object-cover"
                  />
                )}
                <input
                  value={form.image}
                  onChange={(event) => updateForm("image", event.target.value)}
                  placeholder="Image URL"
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
                />
              </div>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="Short description"
                className="min-h-24 resize-none rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              />

              <textarea
                value={form.details}
                onChange={(event) => updateForm("details", event.target.value)}
                placeholder="Long details"
                className="min-h-24 resize-none rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              />

              <input
                value={form.ingredients}
                onChange={(event) =>
                  updateForm("ingredients", event.target.value)
                }
                placeholder="Ingredients separated by commas"
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              />

              <div>
                <p className="mb-2 text-sm font-bold text-neutral-200">
                  Badges
                </p>
                <div className="flex flex-wrap gap-2">
                  {badgeOptions.map((badge) => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => toggleBadge(badge)}
                      className={`pressable rounded-full border px-4 py-2 text-xs font-black ${
                        form.badges.includes(badge)
                          ? "border-orange-400 bg-orange-500 text-white"
                          : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-neutral-200">
                Available for ordering
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      isAvailable: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-orange-500"
                />
              </label>
            </div>

            {message && (
              <p className="mt-4 rounded-2xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-200">
                {message}
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="pressable rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-white hover:bg-orange-400"
              >
                {editingId ? "Save Changes" : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="pressable rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-neutral-300 hover:border-orange-400 hover:text-orange-300"
              >
                Clear
              </button>
            </div>
          </form>

          <div>
            <div className="mb-5 grid gap-3 rounded-3xl border border-white/10 bg-black/35 p-4 sm:grid-cols-2">
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value as Category)
                }
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-orange-400"
              >
                <option value="newest">Newest first</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price low to high</option>
                <option value="price-high">Price high to low</option>
              </select>
            </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleProducts.map((product) => (
              <article
                key={product.id}
                className={`overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 ${
                  product.isAvailable === false ? "opacity-60" : ""
                }`}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={900}
                  height={500}
                  unoptimized
                  className="h-44 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                        {product.category}
                      </p>
                      <h3 className="mt-2 text-xl font-black">
                        {product.name}
                      </h3>
                    </div>
                    <p className="shrink-0 rounded-full bg-orange-500/15 px-3 py-1 text-sm font-bold text-orange-300">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <p
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                      product.isAvailable === false
                        ? "bg-red-500 text-white"
                        : "bg-emerald-400 text-neutral-950"
                    }`}
                  >
                    {product.isAvailable === false ? "Unavailable" : "Available"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">
                    {product.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-neutral-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="pressable rounded-full bg-white px-4 py-3 text-sm font-black text-neutral-950 hover:bg-orange-400 hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleAvailability(product.id)}
                      className="pressable rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                    >
                      Toggle
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="pressable rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-neutral-300 hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

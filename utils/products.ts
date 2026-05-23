import { menuItems } from "@/data/products";
import type { Badge, Category, FoodItem } from "@/types";
import { supabase } from "@/utils/supabase";

type ProductRow = {
  id: number | string;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
  description: string;
  details: string | null;
  ingredients: string[] | string | null;
  badges: Badge[] | string | null;
  available: boolean | null;
  calories?: number | null;
  created_at?: string;
  prep_time?: string | null;
  rating?: number | null;
};

export type ProductInput = Omit<FoodItem, "id"> & {
  id?: number | string;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80";

function parseList<T extends string>(value: T[] | string | null | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as T[];

    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean) as T[];
  }
}

function rowToProduct(row: ProductRow): FoodItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    details: row.details || row.description,
    price: Number(row.price),
    image: row.image || fallbackImage,
    ingredients: parseList<string>(row.ingredients),
    badges: parseList<Badge>(row.badges),
    calories: row.calories ?? 520,
    isAvailable: row.available ?? true,
    isFeatured: parseList<Badge>(row.badges).includes("Popular"),
    prepTime: row.prep_time ?? "10-15 min",
    rating: row.rating ?? 4.7,
  };
}

function productToRow(product: ProductInput) {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image || fallbackImage,
    description: product.description,
    details: product.details || product.description,
    ingredients: product.ingredients,
    badges: product.badges,
    available: product.isAvailable ?? true,
    calories: product.calories ?? null,
    prep_time: product.prepTime ?? null,
    rating: product.rating ?? null,
  };
}

export async function fetchProductsFromSupabase(options?: {
  includeUnavailable?: boolean;
}) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const products = ((data ?? []) as ProductRow[]).map(rowToProduct);

  if (options?.includeUnavailable) {
    return products;
  }

  return products.filter((product) => product.isAvailable !== false);
}

export async function getMenuProducts() {
  try {
    const products = await fetchProductsFromSupabase();

    return products.length > 0 ? products : menuItems;
  } catch {
    return menuItems;
  }
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!error && data) {
    return rowToProduct(data as ProductRow);
  }

  return menuItems.find((item) => String(item.id) === id) ?? null;
}

export async function createProductInSupabase(product: ProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert(productToRow(product))
    .select()
    .single();

  if (error) {
    throw error;
  }

  return rowToProduct(data as ProductRow);
}

export async function updateProductInSupabase(
  productId: number | string,
  product: ProductInput,
) {
  const { data, error } = await supabase
    .from("products")
    .update(productToRow(product))
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return rowToProduct(data as ProductRow);
}

export async function deleteProductFromSupabase(productId: number | string) {
  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw error;
  }
}

export async function updateProductAvailabilityInSupabase(
  productId: number | string,
  available: boolean,
) {
  const { data, error } = await supabase
    .from("products")
    .update({ available })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return rowToProduct(data as ProductRow);
}

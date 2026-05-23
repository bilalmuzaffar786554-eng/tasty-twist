import type {
  AddOn,
  Badge,
  CartItem,
  FoodItem,
  OrderStatus,
  OrderType,
  ProductCustomization,
  ProductSize,
  SavedOrder,
  SpiceLevel,
} from "@/types";
import { supabase } from "@/utils/supabase";

export const couponCode = "TASTY10";
export const orderTimelineSteps: OrderStatus[] = [
  "Preparing",
  "Cooking",
  "Out for Delivery",
  "Delivered",
];

export const sizeOptions: { label: ProductSize; price: number }[] = [
  { label: "Regular", price: 0 },
  { label: "Large", price: 200 },
];

export const spiceLevels: SpiceLevel[] = ["Mild", "Medium", "Spicy"];

export const addOnOptions: { label: AddOn; price: number }[] = [
  { label: "Extra Cheese", price: 100 },
  { label: "Extra Sauce", price: 50 },
  { label: "Extra Patty", price: 250 },
  { label: "Fries Upgrade", price: 199 },
];

export function formatPrice(price: number) {
  return `Rs. ${Math.round(price).toLocaleString("en-PK")}`;
}

export function getDefaultCustomization(): ProductCustomization {
  return {
    size: "Regular",
    spiceLevel: "Mild",
    addOns: [],
    instructions: "",
  };
}

export function normalizeCustomization(
  customization?: Partial<ProductCustomization>,
) {
  const defaultCustomization = getDefaultCustomization();
  const selectedAddOns = addOnOptions
    .map((addOn) => addOn.label)
    .filter((addOn) => customization?.addOns?.includes(addOn));

  return {
    size: customization?.size ?? defaultCustomization.size,
    spiceLevel: customization?.spiceLevel ?? defaultCustomization.spiceLevel,
    addOns: selectedAddOns,
    instructions: customization?.instructions?.trim() ?? "",
  };
}

export function getCustomizationPrice(
  customization?: Partial<ProductCustomization>,
) {
  const cleanCustomization = normalizeCustomization(customization);
  const sizePrice =
    sizeOptions.find((option) => option.label === cleanCustomization.size)
      ?.price ?? 0;
  const addOnsPrice = cleanCustomization.addOns.reduce((total, addOn) => {
    const addOnPrice =
      addOnOptions.find((option) => option.label === addOn)?.price ?? 0;

    return total + addOnPrice;
  }, 0);

  return sizePrice + addOnsPrice;
}

export function getCustomizedUnitPrice(
  food: Pick<FoodItem, "price">,
  customization?: Partial<ProductCustomization>,
) {
  return food.price + getCustomizationPrice(customization);
}

export function getCartItemSignature(
  food: Pick<FoodItem, "id">,
  customization?: Partial<ProductCustomization>,
) {
  const cleanCustomization = normalizeCustomization(customization);

  return [
    food.id,
    cleanCustomization.size,
    cleanCustomization.spiceLevel,
    cleanCustomization.addOns.join("+"),
    cleanCustomization.instructions.toLowerCase(),
  ].join("|");
}

export function createCartItem(
  food: FoodItem,
  customization?: Partial<ProductCustomization>,
): CartItem {
  const cleanCustomization = normalizeCustomization(customization);

  return {
    ...food,
    basePrice: food.price,
    cartId: getCartItemSignature(food, cleanCustomization),
    customization: cleanCustomization,
    price: getCustomizedUnitPrice(food, cleanCustomization),
    quantity: 1,
  };
}

export function normalizeCartItem(item: CartItem): CartItem {
  const basePrice = item.basePrice ?? item.price;
  const cleanCustomization = normalizeCustomization(item.customization);
  const food = { ...item, price: basePrice };

  return {
    ...item,
    basePrice,
    cartId: item.cartId || getCartItemSignature(food, cleanCustomization),
    customization: cleanCustomization,
    price: getCustomizedUnitPrice(food, cleanCustomization),
    quantity: item.quantity ?? 1,
  };
}

export function getCartItemCustomizationLines(item: CartItem) {
  const customization = normalizeCustomization(item.customization);
  const lines = [
    `Size: ${customization.size}`,
    `Spice: ${customization.spiceLevel}`,
  ];

  if (customization.addOns.length > 0) {
    lines.push(`Add-ons: ${customization.addOns.join(", ")}`);
  }

  if (customization.instructions) {
    lines.push(`Note: ${customization.instructions}`);
  }

  return lines;
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartQuantity(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getDeliveryFee(orderType: OrderType, items: CartItem[]) {
  return orderType === "Delivery" && items.length > 0 ? 299 : 0;
}

export function getDiscount(subtotal: number, isCouponApplied: boolean) {
  return isCouponApplied ? subtotal * 0.1 : 0;
}

export function getOrderTotal(
  subtotal: number,
  discount: number,
  deliveryFee: number,
) {
  return subtotal - discount + deliveryFee;
}

export function generateTemporaryOrderNumber() {
  return `TT-${Date.now().toString().slice(-6)}`;
}

type OrderRow = {
  id?: string | number;
  order_id?: string;
  order_number?: string;
  order_no?: string;
  order_date?: string;
  created_at?: string;
  customer_name?: string;
  customer?: string;
  name?: string;
  phone?: string;
  phone_number?: string;
  order_type?: OrderType;
  type?: OrderType;
  address?: string | null;
  address_area?: string | null;
  estimated_time?: string | null;
  notes?: string | null;
  table_number?: string | null;
  items?: CartItem[] | string;
  subtotal?: number;
  discount?: number;
  delivery_fee?: number;
  deliveryFee?: number;
  total?: number;
  payment_method?: "Cash";
  payment?: "Cash";
  status?: OrderStatus;
};

function orderToRow(order: SavedOrder): OrderRow {
  return {
    order_number: order.orderNumber,
    order_date: order.orderDate,
    customer_name: order.customerName,
    phone: order.phoneNumber,
    order_type: order.orderType,
    address: order.address || null,
    address_area: order.addressArea || null,
    estimated_time: order.estimatedTime || null,
    notes: order.notes || null,
    table_number: order.tableNumber || null,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    delivery_fee: order.deliveryFee,
    total: order.total,
    payment_method: order.paymentMethod,
    status: order.status,
  };
}

function orderToCompactRow(order: SavedOrder) {
  return {
    order_id: order.orderNumber,
    customer_name: order.customerName,
    order_type: order.orderType,
    items: order.items,
    total: order.total,
    status: order.status,
  };
}

function rowToOrder(row: OrderRow): SavedOrder {
  let parsedItems: CartItem[] = [];

  if (typeof row.items === "string") {
    try {
      parsedItems = JSON.parse(row.items) as CartItem[];
    } catch {
      parsedItems = [];
    }
  } else {
    parsedItems = row.items ?? [];
  }

  return {
    orderNumber:
      row.order_number ?? row.order_id ?? row.order_no ?? String(row.id ?? ""),
    orderDate: row.order_date ?? row.created_at ?? "",
    customerName: row.customer_name ?? row.customer ?? row.name ?? "",
    phoneNumber: row.phone_number ?? row.phone ?? "",
    orderType: row.order_type ?? row.type ?? "Takeaway",
    address: row.address ?? "",
    addressArea: row.address_area ?? "",
    estimatedTime: row.estimated_time ?? "",
    notes: row.notes ?? "",
    tableNumber: row.table_number ?? "",
    items: parsedItems,
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    deliveryFee: Number(row.delivery_fee ?? row.deliveryFee ?? 0),
    total: Number(row.total ?? 0),
    paymentMethod: row.payment_method ?? row.payment ?? "Cash",
    status: row.status ?? "Preparing",
  };
}

export async function fetchOrdersFromSupabase() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    throw error;
  }

  return ((data ?? []) as OrderRow[])
    .map(rowToOrder)
    .sort((firstOrder, secondOrder) => {
      const firstDate = new Date(firstOrder.orderDate).getTime();
      const secondDate = new Date(secondOrder.orderDate).getTime();

      return (Number.isNaN(secondDate) ? 0 : secondDate) -
        (Number.isNaN(firstDate) ? 0 : firstDate);
    });
}

export async function saveOrderToSupabase(order: SavedOrder) {
  const { data, error } = await supabase
    .from("orders")
    .insert(orderToCompactRow(order))
    .select()
    .single();

  if (!error) {
    const savedOrder = rowToOrder(data as OrderRow);

    return {
      ...order,
      ...savedOrder,
      orderNumber: savedOrder.orderNumber || order.orderNumber,
    };
  }

  const { data: fullData, error: fullError } = await supabase
    .from("orders")
    .insert(orderToRow(order))
    .select()
    .single();

  if (fullError) {
    throw error;
  }

  const savedOrder = rowToOrder(fullData as OrderRow);

  return {
    ...order,
    ...savedOrder,
    orderNumber: savedOrder.orderNumber || order.orderNumber,
  };
}

export async function updateOrderStatusInSupabase(
  orderNumber: string,
  status: OrderStatus,
) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_number", orderNumber);

  if (!error) {
    return;
  }

  const { error: idError } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderNumber);

  if (!idError) {
    return;
  }

  const { error: orderIdError } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_id", orderNumber);

  if (orderIdError) {
    throw error;
  }
}

export function getBadgeClasses(badge: Badge) {
  if (badge === "Popular") {
    return "bg-orange-500 text-white";
  }

  if (badge === "Best Seller") {
    return "bg-yellow-300 text-neutral-950";
  }

  if (badge === "Spicy") {
    return "bg-red-500 text-white";
  }

  return "bg-emerald-400 text-neutral-950";
}

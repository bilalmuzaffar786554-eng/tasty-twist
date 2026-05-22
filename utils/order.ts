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

export const couponCode = "TASTY10";
export const orderHistoryStorageKey = "tasty-twist-orders";
export const orderTimelineSteps: OrderStatus[] = [
  "Preparing",
  "Cooking",
  "Out for Delivery",
  "Delivered",
];

export const sizeOptions: { label: ProductSize; price: number }[] = [
  { label: "Regular", price: 0 },
  { label: "Large", price: 2 },
];

export const spiceLevels: SpiceLevel[] = ["Mild", "Medium", "Spicy"];

export const addOnOptions: { label: AddOn; price: number }[] = [
  { label: "Extra Cheese", price: 1 },
  { label: "Extra Sauce", price: 0.5 },
  { label: "Extra Patty", price: 2.5 },
  { label: "Fries Upgrade", price: 1.99 },
];

export function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
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
  return orderType === "Delivery" && items.length > 0 ? 2.99 : 0;
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

export function generateOrderNumber(nextOrderNumber: number) {
  return `TT-${nextOrderNumber}`;
}

export function generateTemporaryOrderNumber() {
  return `TT-${Date.now().toString().slice(-6)}`;
}

export function getSavedOrders() {
  if (typeof window === "undefined") {
    return [];
  }

  const savedOrders = window.localStorage.getItem(orderHistoryStorageKey);

  if (!savedOrders) {
    return [];
  }

  try {
    return JSON.parse(savedOrders) as SavedOrder[];
  } catch {
    window.localStorage.removeItem(orderHistoryStorageKey);
    return [];
  }
}

export function saveOrderToHistory(order: SavedOrder) {
  if (typeof window === "undefined") {
    return;
  }

  const savedOrders = getSavedOrders();

  window.localStorage.setItem(
    orderHistoryStorageKey,
    JSON.stringify([order, ...savedOrders]),
  );
}

export function clearSavedOrders() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(orderHistoryStorageKey);
}

export function updateSavedOrderStatus(
  orderNumber: string,
  status: OrderStatus,
) {
  if (typeof window === "undefined") {
    return [];
  }

  const updatedOrders = getSavedOrders().map((order) =>
    order.orderNumber === orderNumber ? { ...order, status } : order,
  );

  window.localStorage.setItem(
    orderHistoryStorageKey,
    JSON.stringify(updatedOrders),
  );

  return updatedOrders;
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

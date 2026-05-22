export type Category =
  | "All"
  | "Burgers"
  | "Pizza"
  | "Cheese Steaks"
  | "Fries"
  | "Drinks";

export type Badge = "Popular" | "Spicy" | "New" | "Best Seller";

export type OrderType = "Dine-in" | "Takeaway" | "Delivery";

export type OrderStatus =
  | "Preparing"
  | "Cooking"
  | "Out for Delivery"
  | "Completed"
  | "Delivered"
  | "Cancelled";

export type ProductSize = "Regular" | "Large";

export type SpiceLevel = "Mild" | "Medium" | "Spicy";

export type AddOn =
  | "Extra Cheese"
  | "Extra Sauce"
  | "Extra Patty"
  | "Fries Upgrade";

export type ProductCustomization = {
  size: ProductSize;
  spiceLevel: SpiceLevel;
  addOns: AddOn[];
  instructions: string;
};

export type FoodItem = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  details: string;
  price: number;
  image: string;
  ingredients: string[];
  badges: Badge[];
  calories?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  prepTime?: string;
  rating?: number;
};

export type CartItem = FoodItem & {
  basePrice: number;
  cartId: string;
  customization: ProductCustomization;
  quantity: number;
};

export type Receipt = {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  phoneNumber: string;
  orderType: OrderType;
  address: string;
  addressArea?: string;
  estimatedTime?: string;
  notes: string;
  tableNumber?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "Cash";
};

export type SavedOrder = Receipt & {
  status: OrderStatus;
};

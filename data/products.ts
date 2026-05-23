import type { Category, FoodItem } from "@/types";

export const categories: Category[] = [
  "All",
  "Burgers",
  "Pizza",
  "Cheese Steaks",
  "Fries",
  "Drinks",
];

export const menuItems: FoodItem[] = [
  {
    id: 1,
    name: "Zinger Burger",
    category: "Burgers",
    description: "Crispy chicken, spicy mayo, lettuce, and toasted brioche.",
    details:
      "A crunchy chicken fillet stacked with cool lettuce, tangy pickles, creamy spicy mayo, and a toasted brioche bun.",
    price: 899,
    ingredients: ["Crispy chicken", "Spicy mayo", "Lettuce", "Pickles", "Brioche bun"],
    badges: ["Popular", "Spicy", "Best Seller"],
    calories: 620,
    isAvailable: true,
    isFeatured: true,
    prepTime: "10-15 min",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Smash Burger",
    category: "Burgers",
    description: "Double beef patty, cheddar, pickles, onions, and house sauce.",
    details:
      "Two seared beef patties with melted cheddar, grilled onions, crisp pickles, and Tasty Twist house sauce.",
    price: 999,
    ingredients: ["Beef patties", "Cheddar", "Pickles", "Onions", "House sauce"],
    badges: ["Popular"],
    calories: 710,
    isAvailable: true,
    isFeatured: true,
    prepTime: "12-16 min",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Pepperoni Pizza",
    category: "Pizza",
    description: "Stone-baked crust, mozzarella, pepperoni, and rich tomato sauce.",
    details:
      "A golden crust pizza topped with rich tomato sauce, stretchy mozzarella, and crisp pepperoni slices.",
    price: 2499,
    ingredients: ["Pepperoni", "Mozzarella", "Tomato sauce", "Stone-baked crust"],
    badges: ["Popular", "Spicy", "Best Seller"],
    calories: 880,
    isAvailable: true,
    isFeatured: true,
    prepTime: "15-20 min",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Fresh mozzarella, basil, olive oil, and slow-cooked tomato base.",
    details:
      "A simple classic with fresh mozzarella, basil, olive oil, and slow-cooked tomato sauce on a crisp base.",
    price: 1999,
    ingredients: ["Fresh mozzarella", "Basil", "Olive oil", "Tomato base"],
    badges: ["New"],
    calories: 740,
    isAvailable: true,
    isFeatured: false,
    prepTime: "14-18 min",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Chicken Cheese Steak",
    category: "Cheese Steaks",
    description: "Juicy chicken, melted cheese, peppers, onions, and soft roll.",
    details:
      "Tender chicken strips layered with peppers, onions, and melted cheese inside a warm toasted roll.",
    price: 1099,
    ingredients: ["Chicken strips", "Melted cheese", "Peppers", "Onions", "Soft roll"],
    badges: ["Popular"],
    calories: 690,
    isAvailable: true,
    isFeatured: true,
    prepTime: "12-15 min",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Loaded Fries",
    category: "Fries",
    description: "Golden fries topped with cheese sauce, chicken bites, and herbs.",
    details:
      "Crispy fries finished with warm cheese sauce, juicy chicken bites, herbs, and a drizzle of house sauce.",
    price: 649,
    ingredients: ["Golden fries", "Cheese sauce", "Chicken bites", "Herbs"],
    badges: ["Popular", "New", "Best Seller"],
    calories: 540,
    isAvailable: true,
    isFeatured: true,
    prepTime: "8-12 min",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Classic Fries",
    category: "Fries",
    description: "Crispy salted fries served hot with signature dipping sauce.",
    details:
      "Thin, crispy, golden fries tossed with sea salt and served with a creamy Tasty Twist dipping sauce.",
    price: 399,
    ingredients: ["Potatoes", "Sea salt", "Signature dipping sauce"],
    badges: [],
    calories: 390,
    isAvailable: true,
    isFeatured: false,
    prepTime: "6-9 min",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Cold Coffee",
    category: "Drinks",
    description: "Chilled coffee blended smooth with cream and a sweet finish.",
    details:
      "Cold coffee blended with milk, cream, and ice for a smooth drink that balances sweetness and roast.",
    price: 499,
    ingredients: ["Cold coffee", "Milk", "Cream", "Ice"],
    badges: ["New"],
    calories: 260,
    isAvailable: true,
    isFeatured: false,
    prepTime: "5-8 min",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
  },
];

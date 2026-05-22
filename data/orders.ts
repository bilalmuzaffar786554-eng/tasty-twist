export const previousOrders = [
  {
    id: "TT-100091",
    date: "Today, 12:35 PM",
    status: "preparing",
    type: "Takeaway",
    items: ["Zinger Burger", "Loaded Fries", "Cold Coffee"],
    total: 20.47,
  },
  {
    id: "TT-100064",
    date: "Yesterday, 8:12 PM",
    status: "completed",
    type: "Dine-in",
    items: ["Pepperoni Pizza", "Classic Fries"],
    total: 17.98,
  },
  {
    id: "TT-100038",
    date: "May 18, 2026",
    status: "delivered",
    type: "Delivery",
    items: ["Chicken Cheese Steak", "Cold Coffee"],
    total: 18.97,
  },
] as const;

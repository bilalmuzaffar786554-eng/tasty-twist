"use client";

import { type FormEvent, useState } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useCart } from "@/components/CartProvider";
import type { OrderType, Receipt, SavedOrder } from "@/types";
import {
  couponCode,
  generateTemporaryOrderNumber,
  getDeliveryFee,
  getDiscount,
  getOrderTotal,
  saveOrderToSupabase,
} from "@/utils/order";

export function CheckoutPage() {
  const { cartItems, clearCart, openCart, showToast, subtotal } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("Takeaway");
  const [address, setAddress] = useState("");
  const [addressArea, setAddressArea] = useState("");
  const [notes, setNotes] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [formError, setFormError] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [couponValue, setCouponValue] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const deliveryFee = getDeliveryFee(orderType, cartItems);
  const discount = getDiscount(subtotal, isCouponApplied && cartItems.length > 0);
  const total = getOrderTotal(subtotal, discount, deliveryFee);
  const estimatedTime =
    orderType === "Delivery"
      ? "35-45 min"
      : orderType === "Dine-in"
        ? "15-20 min"
        : "20-25 min";

  function applyCoupon() {
    const cleanCode = couponValue.trim().toUpperCase();

    if (!cleanCode) {
      setCouponMessage("Enter a coupon code first.");
      setIsCouponApplied(false);
      return;
    }

    if (cleanCode !== couponCode) {
      setCouponMessage(`Invalid coupon. Try ${couponCode}.`);
      setIsCouponApplied(false);
      return;
    }

    setCouponValue(couponCode);
    setCouponMessage("Coupon applied: 10% discount.");
    setIsCouponApplied(true);
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (cartItems.length === 0) {
      setFormError("Add at least one item to your cart before placing an order.");
      return;
    }

    if (!customerName.trim()) {
      setFormError("Customer name is required.");
      return;
    }

    if (!phoneNumber.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    if (orderType === "Dine-in" && !tableNumber.trim()) {
      setFormError("Table number is required for dine-in orders.");
      return;
    }

    if (orderType === "Delivery" && (!address.trim() || !addressArea.trim())) {
      setFormError("Street address and area/city are required for delivery.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      const orderNumber = generateTemporaryOrderNumber();
      const placedOrder: SavedOrder = {
        orderNumber,
        orderDate: new Date().toLocaleString(),
        customerName,
        phoneNumber,
        orderType,
        address,
        addressArea,
        estimatedTime,
        notes,
        tableNumber,
        items: cartItems,
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod: "Cash",
        status: "Preparing",
      };
      const savedOrder = await saveOrderToSupabase(placedOrder);

      setReceipt(savedOrder);
      clearCart();
      showToast(`Order ${orderNumber} placed successfully`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to place order. Please try again.";

      setFormError(`Supabase error: ${message}`);
    } finally {
      setIsPlacingOrder(false);
    }
  }

  return (
    <section className="fade-in mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm sm:tracking-[0.24em]">
          Checkout
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
          Complete your order
        </h1>
      </div>

      <CheckoutForm
        address={address}
        addressArea={addressArea}
        cartItems={cartItems}
        couponMessage={couponMessage}
        couponValue={couponValue}
        customerName={customerName}
        deliveryFee={deliveryFee}
        discount={discount}
        formError={formError}
        isCouponApplied={isCouponApplied}
        isPlacingOrder={isPlacingOrder}
        notes={notes}
        orderType={orderType}
        phoneNumber={phoneNumber}
        receipt={receipt}
        tableNumber={tableNumber}
        subtotal={subtotal}
        total={total}
        onApplyCoupon={applyCoupon}
        onOpenCart={openCart}
        onSetAddress={setAddress}
        onSetAddressArea={setAddressArea}
        onSetCouponMessage={setCouponMessage}
        onSetCouponValue={setCouponValue}
        onSetCustomerName={setCustomerName}
        onSetIsCouponApplied={setIsCouponApplied}
        onSetNotes={setNotes}
        onSetOrderType={setOrderType}
        onSetPhoneNumber={setPhoneNumber}
        onSetTableNumber={setTableNumber}
        onSubmit={placeOrder}
        estimatedTime={estimatedTime}
      />
    </section>
  );
}

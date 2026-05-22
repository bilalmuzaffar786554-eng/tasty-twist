import type { CartItem, OrderType, Receipt as ReceiptType } from "@/types";
import type { FormEvent } from "react";
import {
  couponCode,
  formatPrice,
  getCartItemCustomizationLines,
} from "@/utils/order";
import { Receipt } from "./Receipt";

const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-400 focus:bg-white/[0.09] focus:ring-4 focus:ring-orange-500/10";

type CheckoutFormProps = {
  address: string;
  addressArea: string;
  cartItems: CartItem[];
  couponMessage: string;
  customerName: string;
  deliveryFee: number;
  discount: number;
  estimatedTime: string;
  formError: string;
  isCouponApplied: boolean;
  isPlacingOrder: boolean;
  notes: string;
  orderType: OrderType;
  phoneNumber: string;
  receipt: ReceiptType | null;
  tableNumber: string;
  subtotal: number;
  total: number;
  couponValue: string;
  onApplyCoupon: () => void;
  onOpenCart: () => void;
  onSetAddress: (value: string) => void;
  onSetAddressArea: (value: string) => void;
  onSetCouponValue: (value: string) => void;
  onSetCustomerName: (value: string) => void;
  onSetIsCouponApplied: (value: boolean) => void;
  onSetCouponMessage: (value: string) => void;
  onSetNotes: (value: string) => void;
  onSetOrderType: (value: OrderType) => void;
  onSetPhoneNumber: (value: string) => void;
  onSetTableNumber: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function CheckoutForm({
  address,
  addressArea,
  cartItems,
  couponMessage,
  customerName,
  deliveryFee,
  discount,
  estimatedTime,
  formError,
  isCouponApplied,
  isPlacingOrder,
  notes,
  orderType,
  phoneNumber,
  receipt,
  tableNumber,
  subtotal,
  total,
  couponValue,
  onApplyCoupon,
  onOpenCart,
  onSetAddress,
  onSetAddressArea,
  onSetCouponValue,
  onSetCustomerName,
  onSetIsCouponApplied,
  onSetCouponMessage,
  onSetNotes,
  onSetOrderType,
  onSetPhoneNumber,
  onSetTableNumber,
  onSubmit,
}: CheckoutFormProps) {
  return (
    <section
      id="checkout"
      className="cart-panel rounded-3xl border border-white/10 bg-black/45 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-5 lg:p-6"
    >
      <div className="border-b border-white/10 pb-4">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-400">
          Checkout
        </p>
        <h2 className="mt-1 text-2xl font-black">Order details</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Cash payment only. No backend is connected yet.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="customer-name"
              className="mb-2 block text-sm font-bold text-neutral-200"
            >
              Customer name
            </label>
            <input
              id="customer-name"
              value={customerName}
              onChange={(event) => onSetCustomerName(event.target.value)}
              placeholder="Enter your name"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="phone-number"
              className="mb-2 block text-sm font-bold text-neutral-200"
            >
              Phone number
            </label>
            <input
              id="phone-number"
              value={phoneNumber}
              onChange={(event) => onSetPhoneNumber(event.target.value)}
              placeholder="Enter your phone number"
              className={inputClasses}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-neutral-200">
              Order type
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["Dine-in", "Takeaway", "Delivery"] as OrderType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onSetOrderType(type)}
                    className={`pressable rounded-2xl border px-3 py-3 text-sm font-black ${
                      orderType === type
                        ? "border-orange-400 bg-orange-500 text-white"
                        : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                    }`}
                  >
                    {type}
                  </button>
                ),
              )}
            </div>
          </div>

          {orderType === "Delivery" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-bold text-neutral-200"
                >
                  Street address
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(event) => onSetAddress(event.target.value)}
                  placeholder="House, street, building"
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="address-area"
                  className="mb-2 block text-sm font-bold text-neutral-200"
                >
                  Area / city
                </label>
                <input
                  id="address-area"
                  value={addressArea}
                  onChange={(event) => onSetAddressArea(event.target.value)}
                  placeholder="Area or city"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {orderType === "Dine-in" && (
            <div>
              <label
                htmlFor="table-number"
                className="mb-2 block text-sm font-bold text-neutral-200"
              >
                Table number
              </label>
              <input
                id="table-number"
                value={tableNumber}
                onChange={(event) => onSetTableNumber(event.target.value)}
                placeholder="Example: Table 4"
                className={inputClasses}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-bold text-neutral-200"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(event) => onSetNotes(event.target.value)}
              placeholder="Extra sauce, no onions, table number..."
              className={`${inputClasses} min-h-24 resize-none rounded-3xl`}
            />
          </div>

          <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
            <p className="text-sm font-black text-orange-200">
              Estimated time
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {estimatedTime}
            </p>
            <p className="mt-1 text-xs leading-5 text-neutral-400">
              This is a frontend-only estimate based on the selected order type.
            </p>
          </div>

          <div>
            <label
              htmlFor="payment"
              className="mb-2 block text-sm font-bold text-neutral-200"
            >
              Payment method
            </label>
            <input
              id="payment"
              value="Cash only"
              readOnly
              className={`${inputClasses} cursor-not-allowed text-neutral-300`}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <label
              htmlFor="coupon"
              className="mb-2 block text-sm font-bold text-neutral-200"
            >
              Coupon code
            </label>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                id="coupon"
                value={couponValue}
                onChange={(event) => {
                  onSetCouponValue(event.target.value);
                  onSetCouponMessage("");
                  onSetIsCouponApplied(false);
                }}
                placeholder={`Try ${couponCode}`}
                className={inputClasses}
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                className="pressable rounded-2xl bg-white px-5 py-3 text-sm font-black text-neutral-950 hover:bg-orange-400 hover:text-white"
              >
                Apply
              </button>
            </div>
            <p
              className={`mt-2 text-sm font-semibold ${
                isCouponApplied ? "text-emerald-300" : "text-neutral-400"
              }`}
            >
              {couponMessage || `Sample coupon: ${couponCode} gives 10% off.`}
            </p>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-black">Order summary</h3>
              <button
                type="button"
                onClick={onOpenCart}
                className="pressable text-sm font-bold text-orange-300 hover:text-orange-200"
              >
                Edit cart
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-sm leading-6 text-neutral-400">
                Your cart is empty. Add items before placing an order.
              </p>
            ) : (
              <div className="max-h-[42vh] space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.cartId}
                    className="grid gap-2 text-sm sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-semibold text-neutral-300">
                        {item.quantity} x {item.name}
                      </p>
                      <div className="mt-1 space-y-0.5 text-xs leading-5 text-neutral-500">
                        {getCartItemCustomizationLines(item).map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-300">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Delivery fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {formError && (
            <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 shadow-lg shadow-red-500/10">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isPlacingOrder}
            aria-busy={isPlacingOrder}
            className="pressable w-full rounded-full bg-orange-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-400 disabled:cursor-wait disabled:opacity-70"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isPlacingOrder && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </span>
          </button>

          {receipt && (
            <div className="overflow-hidden">
              <div className="success-pop mb-4 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-xl font-black text-neutral-950">
                  ✓
                </div>
                <p className="mt-3 text-sm font-black text-emerald-200">
                  Order placed successfully
                </p>
              </div>
              <Receipt receipt={receipt} />
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

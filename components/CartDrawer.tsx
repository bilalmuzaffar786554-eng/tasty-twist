import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/types";
import { formatPrice, getCartItemCustomizationLines } from "@/utils/order";

type CartDrawerProps = {
  cartItems: CartItem[];
  cartQuantity: number;
  subtotal: number;
  onClearCart: () => void;
  onClose: () => void;
  onDecreaseQuantity: (cartId: string) => void;
  onIncreaseQuantity: (cartId: string) => void;
  onRemoveItem: (cartId: string) => void;
};

export function CartDrawer({
  cartItems,
  cartQuantity,
  subtotal,
  onClearCart,
  onClose,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  return (
    <div className="fixed inset-0 z-[75]">
      <button
        type="button"
        aria-label="Close cart drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <aside className="drawer-enter absolute bottom-0 right-0 flex h-[88dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border-t border-white/10 bg-neutral-950 shadow-2xl shadow-black sm:top-0 sm:h-dvh sm:max-w-md sm:rounded-none sm:border-l sm:border-t-0">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-400">
              Cart
            </p>
            <h2 className="mt-1 text-2xl font-black">Your bag</h2>
            <p className="mt-1 text-sm text-neutral-400">
              {cartQuantity} item{cartQuantity === 1 ? "" : "s"} selected
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg font-black text-white hover:border-orange-400 hover:text-orange-300"
            aria-label="Close cart"
          >
            x
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-orange-400/30 bg-orange-500/10 text-2xl font-black text-orange-300">
                0
              </div>
              <p className="mt-5 text-xl font-black">Your cart is empty.</p>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Add a burger, pizza, or drink and your customized items will
                appear here.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="pressable mt-6 rounded-full bg-orange-500 px-6 py-3 text-sm font-black text-white hover:bg-orange-400"
              >
                Browse Menu
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 pb-3 sm:px-5">
              {cartItems.map((item) => (
                <div
                  key={item.cartId}
                  className="cart-item flex gap-3 border-b border-white/10 py-4 sm:gap-4 sm:py-5"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold leading-tight">{item.name}</h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-orange-300">
                          {item.category}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-orange-300">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-2 space-y-1 text-xs leading-5 text-neutral-400">
                      {getCartItemCustomizationLines(item).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      <p className="font-bold text-neutral-500">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
                        <button
                          type="button"
                          onClick={() => onDecreaseQuantity(item.cartId)}
                          className="pressable flex h-9 w-9 items-center justify-center rounded-full text-lg font-black text-neutral-300 hover:bg-white/10 hover:text-white"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          -
                        </button>
                        <span className="min-w-9 text-center text-sm font-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncreaseQuantity(item.cartId)}
                          className="pressable flex h-9 w-9 items-center justify-center rounded-full text-lg font-black text-neutral-300 hover:bg-orange-500 hover:text-white"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartId)}
                        className="pressable rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-neutral-300 hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 border-t border-white/10 bg-neutral-950/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur sm:p-5">
              <div className="mb-4 flex items-center justify-between text-sm text-neutral-300">
                <span>Subtotal</span>
                <span
                  key={subtotal}
                  className="fade-in text-2xl font-black text-white"
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="pressable rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-neutral-300 hover:border-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  Clear cart
                </button>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="pressable rounded-full bg-orange-500 px-4 py-3 text-center text-sm font-black text-white hover:bg-orange-400"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

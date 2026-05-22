import Image from "next/image";
import type { Receipt as ReceiptType } from "@/types";
import { formatPrice, getCartItemCustomizationLines } from "@/utils/order";

type ReceiptProps = {
  receipt: ReceiptType;
};

export function Receipt({ receipt }: ReceiptProps) {
  return (
    <div className="fade-in mt-6 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-3 sm:p-5">
      <div className="receipt-screen-header">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
          Order placed
        </p>
        <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
          Success! #{receipt.orderNumber}
        </h3>
        <p className="mt-2 text-sm leading-6 text-neutral-300">
          Receipt preview for {receipt.customerName}. Payment method: cash.
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="receipt-print-button pressable mt-4 rounded-full bg-white px-5 py-2.5 text-sm font-black text-neutral-950 hover:bg-orange-400 hover:text-white"
      >
        Print Receipt
      </button>

      <div className="receipt-preview receipt-print-area mt-4 bg-white px-4 py-5 font-mono text-[11px] leading-5 text-black shadow-2xl shadow-black/30 sm:px-5 sm:py-6 sm:text-[12px]">
        <div className="text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white">
            <Image
              src="/tasty-twist-logo.png.png"
              alt="Tasty Twist logo"
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-lg font-black tracking-widest">TASTY TWIST</p>
          <p>123 Flavor Street, Food Town</p>
          <p>Phone: (000) 123-4567</p>
        </div>

        <div className="my-3 border-t border-dashed border-black" />

        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span>ORDER #</span>
            <span>{receipt.orderNumber}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>TYPE</span>
            <span>{receipt.orderType.toUpperCase()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>DATE/TIME</span>
            <span className="text-right">{receipt.orderDate}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>CUSTOMER</span>
            <span className="text-right">{receipt.customerName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>PHONE</span>
            <span>{receipt.phoneNumber}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>CASHIER</span>
            <span>COUNTER 01</span>
          </div>
          {receipt.address && (
            <div className="flex justify-between gap-4">
              <span>ADDRESS</span>
              <span className="text-right">{receipt.address}</span>
            </div>
          )}
          {receipt.addressArea && (
            <div className="flex justify-between gap-4">
              <span>AREA</span>
              <span className="text-right">{receipt.addressArea}</span>
            </div>
          )}
          {receipt.tableNumber && (
            <div className="flex justify-between gap-4">
              <span>TABLE</span>
              <span className="text-right">{receipt.tableNumber}</span>
            </div>
          )}
          {receipt.estimatedTime && (
            <div className="flex justify-between gap-4">
              <span>ETA</span>
              <span className="text-right">{receipt.estimatedTime}</span>
            </div>
          )}
          {receipt.notes && (
            <div className="flex justify-between gap-4">
              <span>NOTES</span>
              <span className="text-right">{receipt.notes}</span>
            </div>
          )}
        </div>

        <div className="my-3 border-t border-dashed border-black" />

        <div className="space-y-1">
          <div className="grid grid-cols-[1fr_auto] gap-4 font-black">
            <span>ITEM</span>
            <span>AMT</span>
          </div>
          {receipt.items.map((item) => (
            <div key={item.cartId}>
              <div className="grid grid-cols-[1fr_auto] gap-4">
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
              <div className="pl-3 text-[10px] leading-4">
                {getCartItemCustomizationLines(item).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="my-3 border-t border-dashed border-black" />

        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(receipt.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatPrice(receipt.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>{formatPrice(receipt.deliveryFee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-dashed border-black pt-2 text-base font-black">
            <span>Total</span>
            <span>{formatPrice(receipt.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment</span>
            <span>{receipt.paymentMethod.toUpperCase()}</span>
          </div>
        </div>

        <div className="my-3 border-t border-dashed border-black" />

        <div className="text-center">
          <p>THANK YOU FOR YOUR ORDER</p>
          <p className="mt-1 font-black tracking-widest">TWIST IT. LOVE IT.</p>
          <div className="barcode mx-auto mt-4 flex h-10 max-w-[220px] items-end justify-center gap-1">
            {Array.from({ length: 28 }).map((_, index) => (
              <span
                key={index}
                className="block bg-black"
                style={{
                  height: `${18 + ((index * 7) % 20)}px`,
                  width: index % 3 === 0 ? "3px" : "2px",
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] tracking-widest">
            {receipt.orderNumber.replace("-", "")}
          </p>
        </div>
      </div>
    </div>
  );
}

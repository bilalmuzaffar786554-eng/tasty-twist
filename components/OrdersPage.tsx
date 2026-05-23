"use client";

import { useEffect, useState } from "react";
import type { SavedOrder } from "@/types";
import {
  fetchOrdersFromSupabase,
  formatPrice,
  getCartItemCustomizationLines,
  orderTimelineSteps,
} from "@/utils/order";

function statusClasses(status: string) {
  const cleanStatus = status.toLowerCase();

  if (cleanStatus === "preparing") {
    return "bg-orange-500 text-white";
  }

  if (cleanStatus === "cooking") {
    return "bg-red-500 text-white";
  }

  if (cleanStatus === "out for delivery") {
    return "bg-sky-400 text-neutral-950";
  }

  if (cleanStatus === "completed") {
    return "bg-emerald-400 text-neutral-950";
  }

  return "bg-sky-400 text-neutral-950";
}

export function OrdersPage() {
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
  const [ordersError, setOrdersError] = useState("");

  function loadOrders() {
    fetchOrdersFromSupabase()
      .then((ordersFromSupabase) => {
        setSavedOrders(ordersFromSupabase);
        setOrdersError("");
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load Supabase orders.";

        setOrdersError(message);
      });
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadOrders, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const hasSavedOrders = savedOrders.length > 0;

  function getProgressIndex(order: SavedOrder) {
    if (order.status === "Completed") {
      return orderTimelineSteps.length - 1;
    }

    return orderTimelineSteps.findIndex((step) => step === order.status);
  }

  return (
    <>
    <section className="fade-in mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm sm:tracking-[0.24em]">
            Orders
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Previous orders
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            {hasSavedOrders
              ? "These orders are loaded from Supabase."
              : "No Supabase orders found yet. Place an order from checkout."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadOrders}
            className="pressable rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-neutral-300 hover:border-orange-400 hover:text-orange-300"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {ordersError && (
        <p className="mb-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
          Supabase error: {ordersError}
        </p>
      )}

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {hasSavedOrders ? (
          savedOrders.map((order) => (
              <article
                key={order.orderNumber}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-orange-400/50 hover:bg-white/[0.06] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-neutral-400">
                      {order.orderDate}
                    </p>
                    <h2 className="mt-2 text-xl font-black sm:text-2xl">
                      {order.orderNumber}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${statusClasses(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <p className="font-bold uppercase tracking-[0.18em] text-orange-300">
                    {order.orderType}
                  </p>
                  <p className="text-neutral-300">
                    Customer:{" "}
                    <span className="font-bold text-white">
                      {order.customerName}
                    </span>
                  </p>
                </div>

                <div className="mt-4 space-y-3 text-sm text-neutral-300">
                  {order.items.map((item) => (
                    <div key={item.cartId}>
                      <p>
                        {item.quantity} x {item.name}
                      </p>
                      <div className="mt-1 space-y-0.5 text-xs leading-5 text-neutral-500">
                        {getCartItemCustomizationLines(item).map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {orderTimelineSteps.map((step, index) => {
                      const progressIndex = getProgressIndex(order);
                      const isComplete =
                        progressIndex >= index && order.status !== "Cancelled";

                      return (
                        <div key={step} className="text-center">
                          <div
                            className={`mx-auto h-2 rounded-full ${
                              isComplete ? "bg-orange-400" : "bg-white/10"
                            }`}
                          />
                          <p
                            className={`mt-2 text-[10px] font-bold ${
                              isComplete ? "text-orange-200" : "text-neutral-600"
                            }`}
                          >
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Total</span>
                    <span className="text-xl font-black">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="pressable mt-4 w-full rounded-full bg-white px-4 py-3 text-sm font-black text-neutral-950 hover:bg-orange-400 hover:text-white"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            <p className="text-xl font-black">No orders yet.</p>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              New orders will appear here after checkout saves them to Supabase.
            </p>
          </div>
        )}
      </div>
    </section>

    {selectedOrder && (
      <div
        className="fade-in fixed inset-0 z-[80] flex items-end justify-center bg-black/75 px-3 py-3 backdrop-blur sm:items-center sm:px-4"
        onClick={() => setSelectedOrder(null)}
      >
        <div
          className="modal-panel max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-neutral-950 p-5 shadow-2xl shadow-black sm:p-6"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                Order details
              </p>
              <h2 className="mt-2 text-3xl font-black">
                {selectedOrder.orderNumber}
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                {selectedOrder.customerName} | {selectedOrder.orderType} |{" "}
                {selectedOrder.orderDate}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="pressable flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg font-black hover:border-orange-400 hover:text-orange-300"
              aria-label="Close order details"
            >
              x
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="grid grid-cols-4 gap-2">
              {orderTimelineSteps.map((step, index) => {
                const progressIndex = getProgressIndex(selectedOrder);
                const isComplete =
                  progressIndex >= index && selectedOrder.status !== "Cancelled";

                return (
                  <div key={step} className="text-center">
                    <div
                      className={`mx-auto h-3 rounded-full ${
                        isComplete ? "bg-orange-400" : "bg-white/10"
                      }`}
                    />
                    <p
                      className={`mt-2 text-xs font-bold ${
                        isComplete ? "text-orange-200" : "text-neutral-600"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {selectedOrder.items.map((item) => (
              <div
                key={item.cartId}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex justify-between gap-3">
                  <p className="font-bold">
                    {item.quantity} x {item.name}
                  </p>
                  <p className="font-black text-orange-300">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="mt-2 space-y-1 text-xs text-neutral-500">
                  {getCartItemCustomizationLines(item).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-white/10 pt-4 text-xl font-black">
            <span>Total</span>
            <span>{formatPrice(selectedOrder.total)}</span>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

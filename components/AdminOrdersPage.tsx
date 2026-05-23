"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import type { OrderStatus, SavedOrder } from "@/types";
import {
  fetchOrdersFromSupabase,
  formatPrice,
  getCartItemCustomizationLines,
  updateOrderStatusInSupabase,
} from "@/utils/order";

const orderStatuses: OrderStatus[] = [
  "Preparing",
  "Cooking",
  "Out for Delivery",
  "Completed",
  "Delivered",
  "Cancelled",
];

function statusClasses(status: OrderStatus) {
  if (status === "Preparing") {
    return "bg-orange-500 text-white";
  }

  if (status === "Completed") {
    return "bg-emerald-400 text-neutral-950";
  }

  if (status === "Cooking") {
    return "bg-red-500 text-white";
  }

  if (status === "Delivered") {
    return "bg-sky-400 text-neutral-950";
  }

  if (status === "Out for Delivery") {
    return "bg-cyan-400 text-neutral-950";
  }

  return "bg-red-500 text-white";
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchOrdersFromSupabase()
        .then((ordersFromSupabase) => {
          setOrders(ordersFromSupabase);
          setOrdersError("");
        })
        .catch((error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to load Supabase orders.";

          setOrdersError(message);
        });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  async function changeStatus(orderNumber: string, status: OrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.orderNumber === orderNumber ? { ...order, status } : order,
      ),
    );

    try {
      await updateOrderStatusInSupabase(orderNumber, status);
      setOrdersError("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to update Supabase order status.";

      setOrdersError(message);
      try {
        setOrders(await fetchOrdersFromSupabase());
      } catch {
        setOrders((currentOrders) => currentOrders);
      }
    }
  }

  return (
    <AdminShell>
      <div className="fade-in">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm">
            Admin orders
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">
            Manage orders
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Update live order statuses from Supabase.
          </p>
        </div>

        {ordersError && (
          <p className="mb-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
            Supabase error: {ordersError}
          </p>
        )}

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            <p className="text-xl font-black">No Supabase orders yet.</p>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Place an order from the website checkout, then return here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                key={order.orderNumber}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 sm:p-6"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black">
                        {order.orderNumber}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${statusClasses(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-neutral-300 sm:grid-cols-2 lg:grid-cols-4">
                      <p>Customer: {order.customerName}</p>
                      <p>Type: {order.orderType}</p>
                      <p>Date: {order.orderDate}</p>
                      <p className="font-black text-orange-300">
                        Total: {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {orderStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => changeStatus(order.orderNumber, status)}
                        className={`pressable rounded-full border px-4 py-2 text-xs font-black ${
                          order.status === status
                            ? "border-orange-400 bg-orange-500 text-white"
                            : "border-white/10 bg-black/25 text-neutral-300 hover:border-orange-400 hover:text-orange-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-300">
                    Items
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {order.items.map((item) => (
                      <div
                        key={item.cartId}
                        className="rounded-2xl bg-black/25 p-4 text-sm"
                      >
                        <p className="font-bold text-white">
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}

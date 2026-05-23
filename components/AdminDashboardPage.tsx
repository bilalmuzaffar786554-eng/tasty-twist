"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import type { SavedOrder } from "@/types";
import { fetchOrdersFromSupabase, formatPrice } from "@/utils/order";

function isToday(dateText: string) {
  const orderDate = new Date(dateText);

  if (Number.isNaN(orderDate.getTime())) {
    return false;
  }

  return orderDate.toDateString() === new Date().toDateString();
}

export function AdminDashboardPage() {
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

  const stats = useMemo(() => {
    const todaysOrders = orders.filter((order) => isToday(order.orderDate));
    const totalSales = orders.reduce((total, order) => total + order.total, 0);
    const averageOrder =
      orders.length > 0 ? totalSales / orders.length : 0;
    const preparingOrders = orders.filter(
      (order) => order.status === "Preparing",
    ).length;
    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered",
    ).length;

    return [
      { label: "Today's orders", value: todaysOrders.length.toString() },
      { label: "Total sales", value: formatPrice(totalSales) },
      { label: "Average order", value: formatPrice(averageOrder) },
      { label: "Preparing orders", value: preparingOrders.toString() },
      { label: "Delivered orders", value: deliveredOrders.toString() },
    ];
  }, [orders]);

  const topSellingItems = useMemo(() => {
    const totals = new Map<string, number>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        totals.set(item.name, (totals.get(item.name) ?? 0) + item.quantity);
      });
    });

    return Array.from(totals.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 4);
  }, [orders]);

  const chartBars = [42, 68, 51, 86, 74, 95, 63];

  return (
    <AdminShell>
      <div className="fade-in">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400 sm:text-sm">
            Admin dashboard
          </p>
          <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">
            Restaurant overview
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Admin metrics based on live Supabase orders.
          </p>
        </div>

        {ordersError && (
          <p className="mb-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
            Supabase error: {ordersError}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20"
            >
              <p className="text-sm font-bold text-neutral-400">{stat.label}</p>
              <p className="mt-4 text-3xl font-black text-white">
                {stat.value}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 sm:p-6">
            <h2 className="text-xl font-black">Sales chart</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Fake weekly frontend analytics.
            </p>
            <div className="mt-6 flex h-56 items-end gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              {chartBars.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-2xl bg-orange-500 shadow-lg shadow-orange-500/20"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs font-bold text-neutral-500">
                    D{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-xl shadow-black/20 sm:p-6">
            <h2 className="text-xl font-black">Top selling items</h2>
            {topSellingItems.length === 0 ? (
              <p className="mt-4 text-sm text-neutral-400">
                Top items appear after customers place orders.
              </p>
            ) : (
              <div className="mt-5 space-y-3">
                {topSellingItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div>
                      <p className="text-xs font-black text-orange-300">
                        #{index + 1}
                      </p>
                      <p className="mt-1 font-bold">{item.name}</p>
                    </div>
                    <p className="text-xl font-black">{item.quantity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-black/35 p-5 sm:p-6">
          <h2 className="text-xl font-black">Recent orders table</h2>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm leading-6 text-neutral-400">
              No real orders have been placed yet. Place an order from the
              customer checkout to see it here.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  <tr>
                    <th className="py-3">Order</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
              {orders.slice(0, 5).map((order) => (
                <tr
                  key={order.orderNumber}
                  className="text-neutral-300"
                >
                  <td className="py-4 font-black text-white">
                    {order.orderNumber}
                  </td>
                  <td>{order.customerName}</td>
                  <td>{order.orderType}</td>
                  <td>{order.status}</td>
                  <td className="text-right font-black text-orange-300">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { clearAdminLogin, isAdminLoggedIn } from "@/utils/adminAuth";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!isAdminLoggedIn()) {
        router.replace("/admin/login");
        return;
      }

      setIsCheckingAuth(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  function logout() {
    clearAdminLogin();
    router.replace("/admin/login");
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl shadow-black/30">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-400">
            Admin
          </p>
          <p className="mt-2 text-xl font-black">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-black/40 p-4 backdrop-blur lg:border-b-0 lg:border-r lg:p-6">
          <Link href="/admin" className="pressable flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-orange-400/30 bg-white">
              <Image
                src="/tasty-twist-logo.png.png"
                alt="Tasty Twist logo"
                width={62}
                height={62}
                className="h-[115%] w-[115%] object-contain"
                priority
              />
            </span>
            <div>
              <p className="text-lg font-black text-orange-400">
                Tasty Twist
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Admin
              </p>
            </div>
          </Link>

          <nav className="mt-6 grid gap-2 sm:grid-cols-4 lg:grid-cols-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`pressable rounded-2xl px-4 py-3 text-sm font-bold ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] hover:text-orange-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="pressable rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-neutral-300 hover:border-orange-400 hover:text-orange-300"
            >
              Back to Website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="pressable rounded-2xl border border-red-400/30 px-4 py-3 text-left text-sm font-bold text-red-200 hover:bg-red-500/10"
            >
              Logout
            </button>
          </nav>
        </aside>

        <section className="min-w-0 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </section>
      </div>
    </div>
  );
}

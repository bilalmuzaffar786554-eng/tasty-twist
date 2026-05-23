"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  getAdminPassword,
  isAdminLoggedIn,
  saveAdminLogin,
} from "@/utils/adminAuth";

export function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (isAdminLoggedIn()) {
        router.replace("/admin");
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const adminPassword = getAdminPassword();

    if (!adminPassword) {
      setError("Admin password is not configured in .env.local.");
      return;
    }

    if (password !== adminPassword) {
      setError("Incorrect admin password.");
      return;
    }

    saveAdminLogin();
    router.replace("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-10 text-white">
      <form
        onSubmit={submitLogin}
        className="fade-in w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-8"
      >
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-orange-400/30 bg-white">
            <Image
              src="/tasty-twist-logo.png.png"
              alt="Tasty Twist logo"
              width={78}
              height={78}
              className="h-[115%] w-[115%] object-contain"
              priority
            />
          </span>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-orange-400">
            Admin login
          </p>
          <h1 className="mt-2 text-3xl font-black">Tasty Twist</h1>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Enter the admin password to manage orders and menu products.
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="admin-password"
            className="mb-2 block text-sm font-bold text-neutral-200"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-neutral-500 focus:border-orange-400 focus:bg-white/[0.09] focus:ring-4 focus:ring-orange-500/10"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="pressable mt-6 w-full rounded-full bg-orange-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 hover:bg-orange-400"
        >
          Login
        </button>
      </form>
    </main>
  );
}

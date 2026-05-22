"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";

export function AppShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartQuantity, openCart } = useCart();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  if (isAdminRoute) {
    return (
      <main className="min-h-screen overflow-hidden bg-neutral-950 text-white">
        {children}
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-neutral-950 text-white">
      <Navbar
        cartQuantity={cartQuantity}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
        onOpenCart={() => {
          openCart();
          closeMobileMenu();
        }}
        onToggleMobileMenu={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
      />
      {children}
      <Footer />
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
  cartQuantity: number;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onOpenCart: () => void;
  onToggleMobileMenu: () => void;
};

export function Navbar({
  cartQuantity,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onOpenCart,
  onToggleMobileMenu,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          onClick={onCloseMobileMenu}
          className="pressable flex min-w-0 shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-orange-400/30 bg-white shadow-lg shadow-orange-500/10 sm:h-11 sm:w-11">
            <Image
              src="/tasty-twist-logo.png.png"
              alt="Tasty Twist logo"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="hidden truncate text-xl font-black tracking-tight text-orange-400 sm:inline sm:text-2xl">
            Tasty Twist
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-neutral-300 md:flex">
          <Link href="/menu" className="transition hover:text-orange-400">
            Menu
          </Link>
          <Link href="/checkout" className="transition hover:text-orange-400">
            Checkout
          </Link>
          <Link href="/orders" className="transition hover:text-orange-400">
            Orders
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            className="pressable inline-flex items-center gap-2 rounded-full bg-orange-500 px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-400 sm:px-5"
          >
            <span>Cart</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black text-neutral-950">
              {cartQuantity}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="pressable flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl font-black text-white hover:border-orange-400 hover:text-orange-300 md:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              "x"
            ) : (
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu-enter border-t border-white/10 bg-neutral-950/98 px-4 py-4 shadow-2xl shadow-black/40 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <Link
              href="/menu"
              onClick={onCloseMobileMenu}
              className="pressable rounded-2xl bg-white/[0.04] px-4 py-3 font-bold text-neutral-200 hover:bg-orange-500 hover:text-white"
            >
              Menu
            </Link>
            <Link
              href="/checkout"
              onClick={onCloseMobileMenu}
              className="pressable rounded-2xl bg-white/[0.04] px-4 py-3 font-bold text-neutral-200 hover:bg-orange-500 hover:text-white"
            >
              Checkout
            </Link>
            <Link
              href="/orders"
              onClick={onCloseMobileMenu}
              className="pressable rounded-2xl bg-white/[0.04] px-4 py-3 font-bold text-neutral-200 hover:bg-orange-500 hover:text-white"
            >
              Orders
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

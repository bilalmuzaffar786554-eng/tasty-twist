import Image from "next/image";

type HeroProps = {
  onOpenCart: () => void;
};

export function Hero({ onOpenCart }: HeroProps) {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.18),transparent_30%)]" />
      <div className="fade-in relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-orange-400 sm:text-sm sm:tracking-[0.28em]">
            Hot, fresh, fast
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Premium fast food with a bold twist.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-neutral-300 sm:mt-6 sm:text-lg sm:leading-8">
            Search the menu, preview each item, open your cart drawer, and place
            a frontend-only cash order.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <a
              href="#menu"
              className="pressable rounded-full bg-orange-500 px-7 py-4 text-center font-bold text-white shadow-xl shadow-orange-500/25 hover:-translate-y-0.5 hover:bg-orange-400"
            >
              Explore Menu
            </a>
            <button
              type="button"
              onClick={onOpenCart}
              className="pressable rounded-full border border-white/15 px-7 py-4 text-center font-bold text-white hover:-translate-y-0.5 hover:border-orange-400 hover:text-orange-400"
            >
              Open Cart
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-orange-500/20 blur-3xl" />
          <Image
            src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80"
            alt="A juicy fast food burger with fries"
            width={1200}
            height={900}
            priority
            unoptimized
            className="relative aspect-[4/3] w-full rounded-[1.5rem] object-cover shadow-2xl shadow-black/40 sm:rounded-[2rem]"
          />
        </div>
      </div>
    </section>
  );
}

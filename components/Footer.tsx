import Image from "next/image";

export function Footer() {
  return (
    <footer
      id="footer"
      className="mt-10 border-t border-white/10 bg-black/30 px-4 py-8 sm:mt-12 sm:px-6 sm:py-10 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-orange-400/30 bg-white">
              <Image
                src="/tasty-twist-logo.png.png"
                alt="Tasty Twist logo"
                width={62}
                height={62}
                className="h-[115%] w-[115%] object-contain"
              />
            </span>
            <p className="text-xl font-black text-orange-400 sm:text-2xl">
              Tasty Twist
            </p>
          </div>
          <p className="mt-2 text-sm text-neutral-400">
            Professional restaurant UI with search, cart drawer, and checkout.
          </p>
        </div>
        <p className="mx-auto max-w-xs text-sm leading-6 text-neutral-500 sm:mx-0 sm:max-w-none">
          Burgers | Pizza | Cheese Steaks | Fries | Drinks
        </p>
      </div>
    </footer>
  );
}

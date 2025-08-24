"use "
import Link from "next/link";

export default function HeroSection() {
    return (<div className="relative h-screen w-full">
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white web">
              MAKE A MOVE
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl">
              Trendy, ready-made fashion for bold movers. Discover your look.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/Collections" className="bg-gray-900 rounded-lg dark:bg-white text-white dark:text-black font-semibold px-6 py-3 hover:scale-105 hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                Explore Collections
              </Link>
              <button className="border rounded-lg border-gray-900 dark:border-white font-semibold px-6 py-3 hover:bg-green-100 hover:scale-105 hover:text-stone-950 transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>);
}
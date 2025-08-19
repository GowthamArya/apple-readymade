import Header from "./components/Header";
import bgImage from "../public/apple-bg.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main>
        
        <div className="relative h-screen w-full">
          {/* Light BG image with overlay */}
          <div
            className="absolute inset-0 bg-center bg-cover opacity-5"
            style={{ backgroundImage: `url(${bgImage.src})` }}
          /> {/* black overlay */}

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
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
        </div>

        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500 py-2">
          © {new Date().getFullYear()} Apple. All rights reserved.
        </p>
      </footer>
    </div>
  );
}


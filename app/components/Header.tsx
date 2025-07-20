"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

const navLinks = [
  { label: "Account", href: "#account" },
  { label: "Category", href: "#category" },
  { label: "Your Suggestions", href: "#suggestions" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Handle click-away and ESC to close menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event: MouseEvent) => {
        if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node)
        ) {
        setMenuOpen(false);
        }
  };

    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleEsc);
    };
    }, [menuOpen]);

  return (
    <header className="w-full p-4 border-b-2 border-b-emerald-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
          <span className="text-xl font-bold hidden md:block">
            Apple Readymade &amp; More
          </span>
          <span className="text-xl font-bold md:hidden">
            Apple
          </span>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className="md:hidden ml-auto p-2 rounded focus:outline-none transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          type="button"
        >
          <svg
            className="w-7 h-7 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
          <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12": "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks />
        </nav>
      </div>

      {/* Animated Mobile Navigation */}
      <div
        ref={mobileNavRef}
        className={`md:hidden sm:py-3 transition-all duration-1000 flex flex-col items-end ease-in-out overflow-hidden ${
          menuOpen ? "max-h-44 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        } rounded`}
        aria-label="Mobile Navigation"
      >
        <NavLinks isMobile />
      </div>
    </header>
  );
}

interface NavLinksProps {
  isMobile?: boolean;
}

function NavLinks({ isMobile }: NavLinksProps) {
  const linkClass = "block py-2 px-3 font-medium transition rounded";
  return (
    <>
      {navLinks.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          className={isMobile ? linkClass : `${linkClass} inline-block`}
          tabIndex={isMobile ? 0 : undefined}
        >
          {label}
        </a>
      ))}
    </>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SearchBar from "./Search";
import { LuUserRound, LuShoppingBag } from 'react-icons/lu';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { RiMenuSearchLine } from "react-icons/ri";
import { FaWindowClose } from "react-icons/fa";
import { Badge, Button, Popover } from "antd";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
];

export default function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);``
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setUser(session?.user), [session]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(false);
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  return (
    <header className="w-full fixed top-0 z-100">
      <div className={
        "pb-2 mx-auto flex items-center justify-between md:justify-center transition duration-200 ease-in-out" +
        (scrolled ? " bg-white dark:bg-black shadow-md" : " bg-transparent")
      }>
        <a className="md:hidden flex items-center gap-1" href="/" title="Go Home" tabIndex={-1}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
          <span className="text-xl font-bold hidden md:block">
            Apple Readymade &amp; More
          </span>
        </a>
        <div className="flex md:hidden items-center">
          <NavIcons user={user} cartCount={cart.length} />
          <button
            className="md:hidden p-2 rounded focus:outline-none transition"
            aria-label="Menu"
            id="hamburgerBtn"
            onClick={e => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-expanded={menuOpen}
            type="button"
          >
            {!menuOpen
              ? <RiMenuSearchLine size={30} className="text-green-700" />
              : <FaWindowClose size={30} className="text-green-700" />
            }
          </button>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks user={user} cartCount={cart.length} />
        </nav>
      </div>
      <div
        ref={mobileNavRef}
        className={
          `md:hidden overflow-hidden transition-all duration-500 flex flex-col justify-end rounded ` +
          (menuOpen ? "max-h-full bg-amber-50 opacity-100" : "max-h-0 opacity-0")
        }
        aria-label="Mobile Navigation"
      >
        <NavLinks isMobile user={user} cartCount={cart.length} />
      </div>
    </header>
  );
}

interface NavLinksProps {
  isMobile?: boolean;
  user?: any;
  cartCount: number;
}

function NavLinks({ isMobile, user, cartCount }: NavLinksProps) {
  const linkClass = "block py-3 px-5 transition duration-500 ease-in-out !hover:bg-green-100 !hover:text-stone-950 p-2";
  return (
    <div className="theme text-center dark:theme-opp-background shadow-md rounded-b-lg p-1 w-full font-semibold">
      <Image src="/logo.png" className="md:inline hidden" alt="Logo" width={50} height={50} priority />
      {navLinks.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={isMobile
            ? `${linkClass} border-b border-b-green-200`
            : `${linkClass} inline-block`
          }
          tabIndex={isMobile ? 0 : undefined}
        >
          {label}
        </Link>
      ))}
      {!isMobile && <NavIcons user={user} cartCount={cartCount} />}
    </div>
  );
}

interface NavIconsProps { user?: any; isMobile?: boolean; cartCount: number }

function NavIcons({ user, isMobile, cartCount }: NavIconsProps) {
  return (
    <>
      {!isMobile && <SearchBar />}
      <Link href="/cart" className="mx-2" title="Cart">
        <Badge count={cartCount} className="text-center flex-row" color="green">
          <LuShoppingBag className="inline mx-1 text-xl font-bold cursor-pointer text-green-700 md:text-gray-700" />
        </Badge>
      </Link>
      {user ? (
        <>
          <Popover content={
                  <div className="flex flex-col gap-2">
                    <Link href="/account">
                      <Button type="primary">Account Settings</Button>
                    </Link>
                    {(user.role_name == "admin") && 
                    <Link href={"/list/variant"} className="mx-auto">
                      <Button type="dashed" className="text-black!">Master Tables</Button>
                    </Link>}
                    <Button type="default" className="text-red-500!" onClick={()=>{
                      signOut();
                    }}>Log out</Button>
                  </div>
                }>
                {user?.image ? (
                  // Use next/image if possible:
                  <img
                    src={user.image}
                    className="rounded-full inline mx-2"
                    alt={user?.name || "User"}
                    width={25}
                    height={25}
                  />
                ) : (
                  <LuUserRound
                    className="text-green-700 md:text-gray-700 mx-1 text-xl font-bold cursor-pointer"
                    title={user?.name || user?.email || "Account"}
                  />
                )}
          </Popover>
        </>
      ) : (
        <Button type="primary" className="mx-2!" shape="default" size="middle">
          <Link href="/auth" title="Login">Login</Link>
        </Button>
      )}
    </>
  );
}
"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SearchBar from "./Search";
import { LuUserRound,LuShoppingBag } from 'react-icons/lu';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";
import { RiMenuSearchLine } from "react-icons/ri";
import { FaWindowClose } from "react-icons/fa";
import { Button } from "antd";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "#About" },
];

export default function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [cartCount,setCartCount] = useState(0);
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setCartCount(cart.length);
  }, [cart]);


  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event:any) => {
      setMenuOpen(false);
    };

    const handleEsc = (event:any) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);


  return (
    <header className="w-full fixed top-0 z-100">
      <div className={"pb-2 mx-auto flex items-center justify-between md:justify-center duration-200 transition ease-in-out" + (scrolled ? " bg-white dark:bg-black shadow-md" : " bg-transparent")}>
        <a className="md:hidden flex items-center gap-1" href="/" title="Go Home" tabIndex={-1}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
          <span className="text-xl font-bold hidden md:block">
            Apple Readymade &amp; More
          </span>
        </a>
        
        <div className={`flex md:hidden items-center`} >
          <NavIcons user={user}/>
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
            {!menuOpen ? <RiMenuSearchLine size={30} className="text-green-700"/> : <FaWindowClose size={30} className="text-green-700"/>}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks user={user} cartCount={cartCount}/>
        </nav>
      </div>
      {/* Animated Mobile Navigation */}
      <div
        ref={mobileNavRef}
        className={`
          md:hidden overflow-hidden transition-all duration-500 flex flex-col justify-end
          rounded
          ${menuOpen ? "max-h-full bg-amber-50 opacity-100" : "max-h-0 opacity-0"}
        `}
        aria-label="Mobile Navigation"
      >
        <NavLinks isMobile user={user} cartCount={cartCount}/>
      </div>
    </header>
  );
}

interface NavLinksProps {
  isMobile?: boolean;
  user?: any;
  cartCount?: number;
}

function NavLinks({ isMobile,user,cartCount }: NavLinksProps) {
  const linkClass = "block py-3 px-5 transition duration-500 ease-in-out !hover:bg-green-100 !hover:text-stone-950 p-2";
  return (
    <div className="theme text-center dark:theme-opp-background shadow-md rounded-b-lg p-1 w-full font-semibold">
      <Image src="/logo.png" className={`md:inline hidden`} alt="Logo" width={50} height={50} priority />
      {navLinks.map(({ label, href }) => (
        <Link 
          key={label}   
          href={href}
          className={isMobile ? `${linkClass} border-b-1 border-b-green-200` : `${linkClass} inline-block`}
          tabIndex={isMobile ? 0 : undefined}
        >
          {label}
        </Link >
      ))}
      {!isMobile && <NavIcons user={user} isMobile={isMobile} cartCount={cartCount}/>}
    </div>
  );
}

function NavIcons({user,isMobile,cartCount}:any) {
  return (
    <>
      {!isMobile && <SearchBar />}
      <Link href={"/cart"} className="relative" title="Cart">
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <LuShoppingBag className={`inline mx-1 text-xl font-bold cursor-pointer text-green-700 md:text-gray-700`}/>
      </Link>
      {user ? 
        <>
          <Link href={"/account"} title="Account">
            <LuUserRound className={`text-green-700 md:text-gray-700 inline mx-1 text-xl font-bold cursor-pointer`} title={user?.name || user?.email}/>
          </Link>
          <IoMdLogOut onClick={()=> signOut()} className={`inline mx-2 text-xl font-bold cursor-pointer text-green-700 md:text-gray-700`} title="Logout"/>
        </>
        : 
        <Button type="primary" className="!mx-2" shape="default" size="middle">
          <Link href={"/auth"} title="Login"> Login </Link>
        </Button>
      }
    </>
  );
}

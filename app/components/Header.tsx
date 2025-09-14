"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import SearchBar from "./Search";
import { LuUserRound,LuShoppingBag } from 'react-icons/lu';
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";
import { RiMenuSearchLine } from "react-icons/ri";
import { FaWindowClose } from "react-icons/fa";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/Collections" },
  { label: "About", href: "#About" },
];

export default function Header() {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(session?.user);
  }, [session]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event:any) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
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
      <div className="py-3 mx-auto flex items-center justify-between md:justify-center">
        <a className="md:hidden flex items-center gap-1" href="/" title="Go Home" tabIndex={-1}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
          <span className="text-xl font-bold hidden md:block">
            Apple Readymade &amp; More
          </span>
          <span className="text-xl font-bold md:hidden">
            Apple
          </span>
        </a>
        
        {/* Hamburger Button (Mobile Only) */}
        <div className="flex md:hidden items-center">
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
            {!menuOpen ? <RiMenuSearchLine size={30} className="text-green-200"/> : <FaWindowClose size={30} className="text-green-200"/>}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLinks user={user}/>
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
        <NavLinks isMobile user={user}/>
      </div>

    </header>
  );
}

interface NavLinksProps {
  isMobile?: boolean;
  user?: any;
}

function NavLinks({ isMobile,user }: NavLinksProps) {
  const linkClass = "block py-3 px-4 transition duration-500 ease-in-out hover:bg-green-100 hover:text-stone-950 p-2";
  return (
    <div className="theme text-center dark:theme-opp-background shadow-md rounded-lg p-1 w-full font-semibold">
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
      {!isMobile && <NavIcons user={user} />}
    </div>
  );
}

function NavIcons({user}:any) {
  return (<>
    <SearchBar />
      <LuShoppingBag className={`inline mx-2 text-xl font-bold cursor-pointer text-green-200 md:text-gray-700`}/>
      {user ? 
          <>
            <LuUserRound className={`text-green-200 md:text-gray-700 inline mx-2 text-xl font-bold cursor-pointer`} title={user?.name || user?.email}/>
            <IoMdLogOut onClick={()=> signOut()} className={`inline mx-2 text-xl font-bold cursor-pointer text-green-200 md:text-gray-700`} title="Logout"/>
          </>
          : 
          <Link href={"/Auth"} className="mx-3 p-2 hover:border-amber-50 border-transparent hover:scale-95 duration-300 border-b-2 border-r-2 rounded-sm hover:cursor-pointer bg-black text-white"> Login </Link>
      }
  </>)
}

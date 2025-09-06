import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-4">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-y-8">
        {/* Logo + Tagline */}
        <div>
          <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
          <h2 className="text-2xl font-bold mb-2">Apple Readymade & More.</h2>
          <p className="text-sm text-gray-400">
            Classic style. Modern fit. Quality that lasts.
          </p>
        </div>

        {/* Shop Links */}
        <div className='md:pl-30 '>
          <h3 className="text-lg font-semibold mb-3">Shop</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/collections/new-arrivals">New Arrivals</Link></li>
            <li><Link href="/collections/shirts">Shirts</Link></li>
            <li><Link href="/collections/accessories">Accessories</Link></li>
            <li><Link href="/collections/sale">Sale</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className='md:pl-20'>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link href="/support/contact">Contact Us</Link></li>
            <li><Link href="/support/shipping">Shipping</Link></li>
            <li><Link href="/support/returns">Returns</Link></li>
            <li><Link href="/support/faq">FAQ</Link></li>
            <li><Link href="/support/size-guide">Size Guide</Link></li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
          <form className="mb-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white text-sm"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-white text-black py-2 text-sm font-semibold hover:bg-gray-300"
            >
              Subscribe
            </button>
          </form>
          <div className="flex space-x-4 text-gray-400 text-xl">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Apple Menswear Co. All rights reserved.
      </div>
    </footer>
  );
}

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">About Us</h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">
                <Link href="/about-us" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/contact-us" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              USEFUL LINKS
            </h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">
                <Link href="/how-it-works" className="hover:text-white">
                  How it works
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/" className="hover:text-white">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">POLICIES</h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">
                <Link href="/terms-of-use" className="hover:text-white">
                  Terms Of Use
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              STAY CONNECTED
            </h3>
            <div className="mb-4 flex space-x-4">
              <Link
                href="https://www.facebook.com"
                target="_blank"
                className="text-gray-400 hover:text-white"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                className="text-gray-400 hover:text-white"
              >
                <Youtube size={24} />
              </Link>
              <Link
                href="https://www.twitter.com"
                target="_blank"
                className="text-gray-400 hover:text-white"
              >
                <Twitter size={24} />
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              `BookKart is a free platform where you can buy second hand books
              at very cheap prices. Buy used books online like college books,
              school books, much more near you.` 
              
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 flex flex-col md:flex-row gap-4 md:gap-0 pt-8 justify-between items-center ">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} BookKart. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <Image src='/icons/visa.svg' alt="Visa" width={50} height={30}  />
            <Image src='/icons/rupay.svg' alt="Rupay" width={50} height={30}  />
            <Image src='/icons/paytm.svg' alt="Paytm" width={50} height={30}  />
            <Image src='/icons/upi.svg' alt="UPI" width={50} height={30}  />
          </div>
        </div>

          
      </div>
    </footer>
  );
};

export default Footer;

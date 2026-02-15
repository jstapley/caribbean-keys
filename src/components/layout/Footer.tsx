import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"
import { PARISHES } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Caribbean Keys Real Estate</h3>
            <p className="text-sm mb-4">
              Your trusted partner for finding luxury properties in beautiful Antigua.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-white transition">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse by Parish */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Browse by Parish</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/locations/st-john" className="hover:text-white transition">
                  St. John
                </Link>
              </li>
              <li>
                <Link href="/locations/st-peter" className="hover:text-white transition">
                  St. Peter
                </Link>
              </li>
              <li>
                <Link href="/locations/st-philip" className="hover:text-white transition">
                  St. Philip
                </Link>
              </li>
              <li>
                <Link href="/locations/st-paul" className="hover:text-white transition">
                  St. Paul
                </Link>
              </li>
              <li>
                <Link href="/locations/st-mary" className="hover:text-white transition">
                  St. Mary
                </Link>
              </li>
              <li>
                <Link href="/locations/st-george" className="hover:text-white transition">
                  St. George
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>
                  Address Line<br />
                  St. John's, Antigua
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+12681234567" className="hover:text-white transition">
                  +1 (268) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@caribbeankeysrealestate.com" className="hover:text-white transition">
                  info@caribbeankeysrealestate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>
            &copy; {currentYear} Caribbean Keys Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube, Star } from "lucide-react"
import Image from "next/image"

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
                href="https://www.facebook.com/roscoha"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/caribbean_keys/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@antigua.dreams"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Caribbeankeysofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://g.page/r/Ca7u9-BL3IHjEBI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition"
                aria-label="Google Reviews"
              >
                <Star className="h-5 w-5" />
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
                <a href="tel:+17057255824" className="hover:text-white transition">
                  (705) 725-5824
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:ross.caribbeankeys@gmail.com" className="hover:text-white transition">
                  ross.caribbeankeys@gmail.com
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

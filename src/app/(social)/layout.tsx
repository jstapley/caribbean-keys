import type { ReactNode } from "react"
import { Playfair_Display } from "next/font/google"
import "@/app/globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

export default function SocialRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} font-playfair`}>
        {children}
      </body>
    </html>
  )
}

// @ts-nocheck
import type { ReactNode } from "react"
import { ACTIVE_FONT, montserrat, poppins, workSans, inter, playfair } from "@/lib/fonts/font-config"
import "@/app/globals.css"

export default function SocialRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`
          ${ACTIVE_FONT.font.variable}
          ${montserrat.variable}
          ${poppins.variable}
          ${workSans.variable}
          ${inter.variable}
          ${playfair.variable}
          ${ACTIVE_FONT.className}
        `}
      >
        {children}
      </body>
    </html>
  )
}
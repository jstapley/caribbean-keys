import type { ReactNode } from "react"
import "@/app/globals.css"

// Use a standard Google Fonts <link> rather than next/font/google here.
// Turbopack (Next.js 16) crashes when the same font (Playfair Display) is
// instantiated via next/font/google in two separate root layouts. The social
// route group is a standalone root layout so we bypass the font system and
// define the CSS variable manually so the font-playfair Tailwind class still works.
export default function SocialRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`:root { --font-playfair: 'Playfair Display', Georgia, serif; }`}</style>
      </head>
      <body className="font-playfair">
        {children}
      </body>
    </html>
  )
}

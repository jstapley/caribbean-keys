import { Inter, Montserrat, Poppins, Work_Sans, Playfair_Display } from "next/font/google"

// =====================================================
// GOOGLE FONTS (All FREE)
// =====================================================

export const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-montserrat',
  display: 'swap',
})

export const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-poppins',
  display: 'swap',
})

export const workSans = Work_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-work-sans',
  display: 'swap',
})

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-playfair',
  display: 'swap',
})

// =====================================================
// ACTIVE FONT CONFIGURATION
// Change these two lines to switch fonts easily!
// =====================================================

export const ACTIVE_FONT = {
  font: playfair,              // 👈 Current: Playfair (elegant serif)
  className: 'font-playfair',
}

// =====================================================
// AVAILABLE OPTIONS TO TRY:
// =====================================================

/*
To switch fonts, change both lines above to one of these:

1. Playfair Display (Elegant Serif - Luxury)
   font: playfair
   className: 'font-playfair'

2. Montserrat (Clean Sans-Serif - Most similar to Hunter)
   font: montserrat
   className: 'font-montserrat'

3. Poppins (Modern Rounded Sans-Serif)
   font: poppins
   className: 'font-poppins'

4. Work Sans (Professional Sans-Serif)
   font: workSans
   className: 'font-work-sans'

5. Inter (Tech-Forward Sans-Serif)
   font: inter
   className: 'font-inter'

After changing, restart dev server: npm run dev
*/
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleMapsScript } from "@/components/GoogleMapsScript";
import { ACTIVE_FONT, montserrat, poppins, workSans, inter, playfair } from "@/lib/fonts/font-config";

export const metadata: Metadata = {
  title: "Caribbean Keys Real Estate | Antigua Property Sales",
  description: "Your trusted real estate partner in Antigua. Browse luxury villas, condos, land, and commercial properties across all parishes.",
  keywords: ["Antigua real estate", "Caribbean property", "luxury villas Antigua", "Antigua homes for sale"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <GoogleMapsScript />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
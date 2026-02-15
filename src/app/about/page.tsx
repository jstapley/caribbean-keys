import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Award, Users, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "15+ Years Real Estate Experience",
      description: "Proven track record helping clients across Canada, now bringing that expertise to Antigua's dynamic market."
    },
    {
      icon: TrendingUp,
      title: "Property Owner & Island Resident",
      description: "As an Antigua property owner for 2+ years and 15-year visitor, Ross provides authentic, first-hand market insights."
    },
    {
      icon: Users,
      title: "International Market Connections",
      description: "Leveraging strong Canadian networks and local Antigua relationships to connect buyers with their perfect Caribbean property."
    }
  ]

  const services = [
    "Luxury beachfront property sales",
    "Investment property analysis",
    "Rental income projections",
    "Citizenship by Investment (CBI) guidance",
    "Property management connections",
    "Market insights for North American buyers"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-caribbean-navy to-caribbean-blue">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Your Trusted Guide to Antigua Real Estate
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Expert real estate services for luxury homes, beachfront villas, and investment properties in Antigua and Barbuda
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Image */}
            <div className="relative h-[700px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/ross.png"
                alt="Ross - Caribbean Keys Real Estate Agent in Antigua"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold text-caribbean-navy mb-6">
                Your Trusted Partner for Buying and Selling Property in Antigua
              </h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Ross Harris brings over 15 years of real estate experience to the Antigua market. After building a successful career helping clients across Canada, Ross is now channeling his expertise into his true passion—Caribbean real estate in Antigua and Barbuda.
                </p>
                
                <p>
                  For the past 15 years, Ross has been visiting Antigua regularly, and for the last two years, he's been a proud property owner on the island. This isn't just business—it's personal. Ross understands the unique appeal of Antigua because he lives it, experiencing firsthand what makes this island such a compelling investment opportunity.
                </p>
                
                <p>
                  <strong>Antigua offers exceptional value</strong> for real estate investment, combining breathtaking natural beauty with strong growth potential. More North American buyers are discovering what Ross already knows: whether you're seeking a vacation home, rental income property, or long-term investment, Antigua delivers on all fronts.
                </p>
                
                <p>
                  Ross specializes in connecting international buyers with premier Antigua properties through cutting-edge digital marketing strategies. With established networks in both Canadian and Caribbean markets, he ensures properties gain maximum exposure to qualified buyers worldwide.
                </p>
                
                <p>
                  Whether you're searching for a <strong>beachfront villa in Antigua</strong>, a smart Caribbean real estate investment, or your dream island retreat, Ross provides the experienced guidance and local insight you need to make confident decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-caribbean-navy text-center mb-12">
              Why Choose Caribbean Keys Real Estate?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-caribbean-seafoam/20 rounded-lg p-6 text-center">
                    <div className="bg-caribbean-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-caribbean-navy" />
                    </div>
                    <h3 className="text-xl font-bold text-caribbean-navy mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-caribbean-navy rounded-xl p-8 md:p-12 text-white mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Real Estate Services
                </h2>
                <p className="text-white/90 mb-6">
                  From luxury beachfront estates to investment condos, Ross provides comprehensive real estate services for buyers and sellers in Antigua and Barbuda.
                </p>
              </div>
              
              <div>
                <ul className="space-y-3">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-caribbean-gold flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-caribbean-seafoam to-caribbean-blue rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-caribbean-navy mb-4">
              Ready to Invest in Antigua Real Estate?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Let's discuss your Caribbean property goals. Whether you're buying your first vacation home or expanding your investment portfolio, Ross is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-semibold">
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-caribbean-navy text-caribbean-navy hover:bg-caribbean-navy hover:text-white">
                <Link href="/contact">Contact Us Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
// @ts-nocheck
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, MapPin, Home, Building2, Palmtree, Shield, TrendingUp, Phone, Mail, Calendar } from "lucide-react"

export default function TheGardensPage() {
  const features = [
    "Private pools with each villa",
    "Landscaped grounds",
    "White-sand beaches nearby",
    "Full-service marina access",
    "Gated community security",
    "Modern Caribbean architecture",
    "Indoor-outdoor living design",
    "Premium finishes and furnishings",
  ]

  const communityHighlights = [
    {
      icon: Building2,
      title: "Nikki Beach Resort",
      description: "Luxury resort development (completion 2028)",
    },
    {
      icon: TrendingUp,
      title: "Commercial Redevelopment",
      description: "Upscale dining and retail expansion underway",
    },
    {
      icon: Palmtree,
      title: "Sports Village",
      description: "State-of-the-art recreational facilities",
    },
  ]

  const models = [
    {
      name: "Neem",
      bedrooms: 3,
      description: "Spacious 3-bedroom luxury villa with option to add cottage for 4th bedroom",
      features: ["Private pool", "Open-plan living", "Master suite", "Cottage option available"],
      priceNote: "From USD $1.45M+",
    },
    {
      name: "Aloe",
      bedrooms: 2,
      description: "Elegant 2-bedroom villa with optional cottage addition",
      features: ["Private pool", "Contemporary design", "Guest cottage option", "Turnkey furnishings"],
      priceNote: "From USD $1.45M+",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-caribbean-navy via-caribbean-blue to-caribbean-seafoam">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="inline-block px-4 py-2 bg-caribbean-gold text-caribbean-navy font-bold rounded-full mb-6 uppercase text-sm">
              CIP Approved Investment
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Gardens
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-100">
              Luxury Off-Plan Villas in Jolly Harbour
            </p>
            <p className="text-lg mb-8 text-gray-200 max-w-2xl">
              A collection of residential plots on Harbour Island, designed for comfort, privacy, and long-term value. Approved under Antigua's Citizenship by Investment Program.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-bold uppercase"
              >
                <a href="https://api.leadconnectorhq.com/widget/booking/SvIBBVEDScQOGhfhK5eS" target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Viewing
                </a>
              </Button>
              <Button 
                asChild 
                size="lg"
                variant="outline"
                className="bg-white hover:bg-gray-100 text-caribbean-navy border-2 font-bold uppercase"
              >
                <Link href="/contact">
                  Request Information
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CIP Callout */}
      <section className="bg-caribbean-gold py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <Shield className="h-12 w-12 text-caribbean-navy" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-caribbean-navy">
                Citizenship by Investment Program Approved
              </h3>
              <p className="text-caribbean-navy/80">
                Qualify for Antigua & Barbuda citizenship with your investment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-caribbean-navy mb-6">
                Your Caribbean Sanctuary Awaits
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                The Gardens is located on Harbour Island, just off Antigua's scenic west coast within the greater Jolly Harbour community. Surrounded by white-sand beaches and a full-service marina, these off-plan luxury villas are designed for comfort, privacy, and long-term value.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Well-suited for clients seeking a second home, rental income potential, or a pathway to second citizenship in one of the Caribbean's most established waterfront destinations. All homes are sold off-plan.
              </p>
              <div className="flex items-center gap-2 text-caribbean-navy mb-4">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">Jolly Harbour, Antigua</span>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/gardens/placeholder-aerial.jpg"
                alt="The Gardens aerial view"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-caribbean-navy mb-12 text-center">
            Premium Features & Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-6 rounded-lg shadow-sm">
                <Check className="h-6 w-6 text-caribbean-gold flex-shrink-0 mt-1" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Villa Models */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-caribbean-navy mb-4">
              Luxury Villa Models
            </h2>
            <p className="text-lg text-gray-600">
              Choose from two stunning designs, both offering the perfect blend of Caribbean elegance and modern luxury
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {models.map((model) => (
              <div key={model.name} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-64">
                  <Image
                    src={`/images/gardens/${model.name.toLowerCase()}-exterior.jpg`}
                    alt={`${model.name} villa model`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-caribbean-gold text-caribbean-navy px-4 py-2 rounded-full font-bold">
                    {model.bedrooms} BR
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-caribbean-navy mb-3">
                    The {model.name}
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {model.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {model.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-caribbean-gold" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-6">
                    <p className="text-sm text-gray-600 mb-2">Whole Ownership</p>
                    <p className="text-2xl font-bold text-caribbean-navy">{model.priceNote}</p>
                    <p className="text-sm text-gray-600 mt-1 mb-4">Lot, Villa & Furnishings included</p>
                    <Button 
                      asChild 
                      className="w-full bg-caribbean-navy hover:bg-caribbean-navy/90 text-white"
                    >
                      <Link href={`/properties/the-${model.name.toLowerCase()}`}>
                        More Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              *The Neem model is also available for Shared Purchase. Contact us for details.
            </p>
            <Button asChild size="lg" className="bg-caribbean-navy hover:bg-caribbean-navy/90 text-white">
              <Link href="/contact">
                Request Floor Plans & Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="py-16 bg-caribbean-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            A Strategic Investment Opportunity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {communityHighlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-caribbean-gold text-caribbean-navy rounded-full mb-4">
                  <highlight.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{highlight.title}</h3>
                <p className="text-gray-300">{highlight.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Significant investment is underway throughout the community, including upscale dining such as The Fat Urchin, and the already operational Sports Village. These enhancements further support long-term value appreciation and lifestyle appeal.
            </p>
          </div>
        </div>
      </section>

      {/* CIP Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-caribbean-seafoam to-caribbean-blue/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-12 w-12 text-caribbean-navy" />
              <h2 className="text-3xl md:text-4xl font-bold text-caribbean-navy">
                Citizenship by Investment Program
              </h2>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              The Gardens is fully approved under Antigua & Barbuda's Citizenship by Investment (CIP) Program, offering qualified investors a pathway to second citizenship.
            </p>
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-caribbean-navy mb-4">Two Investment Options:</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-caribbean-navy mb-2">✓ Whole Ownership</h4>
                  <p className="text-gray-700">From USD $1.45M+ (Lot, Villa & Furnishings)</p>
                </div>
                <div>
                  <h4 className="font-bold text-caribbean-navy mb-2">✓ Shared Ownership</h4>
                  <p className="text-gray-700">Available for the Neem model (Contact for details)</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              This represents one of the final opportunities to enter Antigua's west coast at this stage of the market.
            </p>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-caribbean-navy mb-4">
              Prime West Coast Location
            </h2>
            <p className="text-lg text-gray-600">
              Harbour Island, Jolly Harbour - Antigua's Premier Waterfront Community
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-[500px] w-full">
              <iframe
                src={`https://www.google.com/maps?q=17.07200,-61.88613&hl=es;z=14&output=embed`}
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="p-6 bg-caribbean-navy text-white">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-caribbean-gold" />
                <div>
                  <h3 className="font-bold text-lg">The Gardens</h3>
                  <p className="text-gray-300">Harbour Island, Jolly Harbour, Antigua</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-br from-caribbean-navy to-caribbean-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Learn More About The Gardens?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Contact us today to schedule a viewing, request floor plans, or discuss CIP eligibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-bold uppercase"
            >
              <a href="https://api.leadconnectorhq.com/widget/booking/SvIBBVEDScQOGhfhK5eS" target="_blank" rel="noopener noreferrer">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Viewing
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="bg-white hover:bg-gray-100 text-caribbean-navy border-2 font-bold uppercase"
            >
              <a href="tel:+17057255824">
                <Phone className="h-5 w-5 mr-2" />
                (705) 725-5824
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="bg-white hover:bg-gray-100 text-caribbean-navy border-2 font-bold uppercase"
            >
              <a href="mailto:ross.caribbeankeys@gmail.com">
                <Mail className="h-5 w-5 mr-2" />
                Email Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
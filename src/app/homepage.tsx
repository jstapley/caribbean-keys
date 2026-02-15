import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Home, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Find Your Dream Home in Paradise
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              Discover luxury properties across Antigua's most sought-after locations
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-white text-blue-900 hover:bg-blue-50">
                <Link href="/properties">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/contact">Schedule Viewing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Home className="h-8 w-8 text-blue-900" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">150+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-blue-900" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">50+</div>
              <div className="text-gray-600">Properties Sold</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-blue-900" />
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">6</div>
              <div className="text-gray-600">Parishes Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties in Antigua
            </p>
          </div>

          {/* Placeholder for property cards - we'll add these next */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Home className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p>Property Image</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-semibold mb-2">St. Mary</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Luxury Villa Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-4">
                    3 beds • 2.5 baths • 2,500 sq ft
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-900">$1,250,000</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/properties">View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by Parish */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Browse by Parish
            </h2>
            <p className="text-xl text-gray-600">
              Explore properties across all of Antigua
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["St. John's", "St. Peter", "St. Philip", "St. Paul", "St. Mary", "St. George"].map((parish) => (
              <Link
                key={parish}
                href={`/properties/parish/${parish.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
                className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg p-6 text-center transition-all shadow-sm hover:shadow-md"
              >
                <MapPin className="h-8 w-8 text-blue-900 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-semibold text-gray-900">{parish}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact our expert team today to schedule a viewing or learn more about our available properties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-900 hover:bg-blue-50">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/properties">Browse All Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

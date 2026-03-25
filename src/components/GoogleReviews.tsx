"use client"

import { Star, Quote } from "lucide-react"

export function GoogleReviews() {
  // Sample reviews - these would ideally come from Google API or manual input
  const reviews = [
    {
      author: "Sarah M.",
      rating: 5,
      date: "2 weeks ago",
      text: "Ross was incredibly helpful in finding our dream property in Antigua. His knowledge of the local market and attention to detail made the entire process smooth and stress-free.",
      verified: true
    },
    {
      author: "Michael P.",
      rating: 5,
      date: "1 month ago",
      text: "Working with Caribbean Keys was the best decision we made. Ross's expertise in the CIP program and his professional approach helped us navigate the investment process with confidence.",
      verified: true
    },
    {
      author: "Jennifer L.",
      rating: 5,
      date: "2 months ago",
      text: "Excellent service from start to finish! Ross went above and beyond to ensure we found the perfect beachfront property. Highly recommend to anyone looking in Antigua.",
      verified: true
    }
  ]

  const averageRating = 5.0
  const totalReviews = 24

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-8 w-8 fill-caribbean-gold text-caribbean-gold" 
              />
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-caribbean-navy mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Read reviews from clients who trusted us with their Caribbean real estate journey
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-2xl font-bold text-caribbean-navy">{averageRating}</span>
            <span>based on</span>
            <span className="font-semibold">{totalReviews} Google reviews</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition relative"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-caribbean-gold/20 absolute top-4 right-4" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating 
                        ? 'fill-caribbean-gold text-caribbean-gold' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 line-clamp-4">
                "{review.text}"
              </p>

              {/* Author Info */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-caribbean-navy">{review.author}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Google Logo */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Posted on Google</span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="https://g.page/r/Ca7u9-BL3IHjEBI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-caribbean-gold hover:bg-caribbean-gold/90 text-caribbean-navy font-bold rounded-lg transition uppercase tracking-wide"
          >
            <Star className="h-5 w-5" />
            Leave us a review on Google
          </a>
        </div>
      </div>
    </section>
  )
}
"use client"

import { useEffect } from "react"
import { Star } from "lucide-react"

export function GoogleReviews() {
  useEffect(() => {
    // Load the GHL reviews widget script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://reputationhub.site/reputation/assets/review-widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Read reviews from clients who trusted us with their Caribbean real estate journey
          </p>
        </div>

        {/* GHL Reviews Widget */}
        <div className="max-w-6xl mx-auto">
          <iframe 
            className='lc_reviews_widget' 
            src='https://reputationhub.site/reputation/widgets/review_widget/yw1L12io6PtweHFGUedW' 
            frameBorder='0' 
            scrolling='no' 
            style={{ minWidth: '100%', width: '100%', border: 'none' }}
            title="Google Reviews"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <a
            href="https://g.page/r/Ca7u9-BL3IHjEBI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-caribbean-gold hover:text-caribbean-gold/80 font-semibold transition"
          >
            <Star className="h-5 w-5" />
            Leave us a review
          </a>
        </div>
      </div>
    </section>
  )
}
import ParishPage from "@/components/templates/ParishPage"

export default function StJohnPage() {
  const attractions = [
    {
      title: "St. John's City",
      description: "Antigua's vibrant capital featuring colorful colonial architecture, Heritage Quay shopping, and the famous Saturday morning market."
    },
    {
      title: "Fort James",
      description: "Historic 18th-century fort with panoramic views of St. John's Harbour and the cruise ship terminal. Great spot for sunset photos."
    },
    {
      title: "Dickenson Bay",
      description: "One of Antigua's most popular beaches with pristine white sand, crystal-clear waters, and numerous beachfront restaurants and water sports."
    },
    {
      title: "Runaway Bay",
      description: "Long stretch of beautiful beach perfect for swimming and beach walks, lined with resorts and beach bars."
    },
    {
      title: "Museum of Antigua and Barbuda",
      description: "Located in the old Court House, showcasing the island's history from pre-Columbian times through independence."
    },
    {
      title: "Heritage Quay & Redcliffe Quay",
      description: "Duty-free shopping center and historic restored buildings now housing boutiques, cafes, and art galleries."
    }
  ]

  const investment = [
    {
      title: "Capital City Advantage",
      description: "As the capital and commercial center, St. John offers strong rental demand from business travelers, government workers, and professionals year-round."
    },
    {
      title: "Tourism Infrastructure",
      description: "Proximity to cruise ship terminal, international airport (15 minutes), and major hotels creates consistent visitor traffic and rental opportunities."
    },
    {
      title: "Urban Amenities",
      description: "Best selection of restaurants, shopping, medical facilities, and entertainment options on the island, making it attractive for both residents and investors."
    },
    {
      title: "Beach Access",
      description: "Home to Dickenson Bay and Runaway Bay, two of Antigua's premier beaches, properties in this parish combine city convenience with beach lifestyle."
    }
  ]

  return (
    <ParishPage
      parishName="St. John"
      parishSlug="st-john"
      subtitle="Central/North West"
      mapImage="/images/maps/map-st-john-update.png"
      description="Experience St. John, Antigua's bustling capital parish. From the colorful streets of St. John's City to the pristine beaches of Dickenson Bay, this parish offers the perfect blend of urban energy and Caribbean relaxation."
      attractions={attractions}
      investment={investment}
    />
  )
}
import ParishPage from "@/components/templates/ParishPage"

export default function StMaryPage() {
  const attractions = [
    {
      title: "Jolly Harbour",
      description: "Antigua's largest marina and resort community with restaurants, shops, golf course, and extensive water sports facilities."
    },
    {
      title: "Jolly Beach",
      description: "Mile-long white sand beach with calm turquoise waters, perfect for swimming, snorkeling, and beach activities."
    },
    {
      title: "Darkwood Beach",
      description: "Pristine beach with minimal development, offering tranquil swimming and stunning sunset views over the Caribbean Sea."
    },
    {
      title: "Valley Church Beach",
      description: "Scenic beach framed by hills, popular for swimming and local beach bars serving fresh seafood and rum punch."
    },
    {
      title: "Fig Tree Drive Scenic Route",
      description: "Winding road through rainforest connecting to neighboring parishes, showcasing tropical vegetation and local farm culture."
    },
    {
      title: "Jolly Harbour Golf Course",
      description: "18-hole course designed by Karl Litten, featuring challenging water features and Caribbean Sea views."
    }
  ]

  const investment = [
    {
      title: "Marina & Resort Hub",
      description: "Jolly Harbour's established infrastructure provides strong rental market, with yacht owners, golfers, and families seeking resort amenities year-round."
    },
    {
      title: "Beach Accessibility",
      description: "Multiple pristine beaches within the parish create consistent demand from vacation rental guests seeking Caribbean beach experiences."
    },
    {
      title: "Golf Community Appeal",
      description: "Golf course properties attract international buyers and retirees, with HOA-managed communities offering turnkey investment options."
    },
    {
      title: "West Coast Sunsets",
      description: "Properties along the Caribbean-facing coast command premium prices for spectacular sunset views and calm swimming conditions."
    }
  ]

  return (
    <ParishPage
      parishName="St. Mary"
      parishSlug="st-mary"
      subtitle="South West"
      mapImage="/images/maps/map-st-mary-update.png"
      description="Welcome to St. Mary, home to the renowned Jolly Harbour marina and resort community. This southwestern parish combines world-class amenities with pristine beaches and spectacular Caribbean sunsets."
      attractions={attractions}
      investment={investment}
    />
  )
}
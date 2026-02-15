import ParishPage from "@/components/templates/ParishPage"

export default function StPeterPage() {
  const attractions = [
    {
      title: "V.C. Bird International Airport",
      description: "Antigua's main international airport, providing convenient access to North America, Europe, and the Caribbean."
    },
    {
      title: "All Saints Village",
      description: "Charming community hosting the annual Antigua Carnival, featuring local culture, food, and traditional celebrations."
    },
    {
      title: "North Sound",
      description: "Protected marine area perfect for kayaking, paddleboarding, and exploring mangrove ecosystems teeming with wildlife."
    },
    {
      title: "Hawksbill Bay",
      description: "Collection of four pristine beaches including one clothing-optional beach, known for excellent snorkeling and sea turtles."
    },
    {
      title: "Cedar Valley Golf Course",
      description: "18-hole championship golf course offering challenging play and beautiful views of the surrounding landscape."
    },
    {
      title: "Antigua Yacht Club Marina",
      description: "Full-service marina and sailing community on Falmouth Harbour's northern shore, popular with cruisers."
    }
  ]

  const investment = [
    {
      title: "Airport Proximity",
      description: "Properties benefit from excellent connectivity being near V.C. Bird International Airport, ideal for vacation rentals and second homes."
    },
    {
      title: "Golf Course Development",
      description: "Cedar Valley Golf Course area offers upscale residential opportunities attracting golf enthusiasts and retirees seeking resort-style living."
    },
    {
      title: "Protected Waterfront",
      description: "North Sound's calm waters and mangrove ecosystems create unique waterfront property opportunities with natural protection and beauty."
    },
    {
      title: "Central Location",
      description: "Balanced position between St. John's city services and southern parish attractions makes St. Peter ideal for those wanting island-wide access."
    }
  ]

  return (
    <ParishPage
      parishName="St. Peter"
      parishSlug="st-peter"
      subtitle="Central/North East"
      mapImage="/images/maps/map-st-peter-update.png"
      description="Discover St. Peter, Antigua's gateway parish home to the international airport and diverse landscapes. From championship golf to protected marine areas, this central parish offers convenience and natural beauty."
      attractions={attractions}
      investment={investment}
    />
  )
}
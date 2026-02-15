import ParishPage from "@/components/templates/ParishPage"

export default function StPaulPage() {
  const attractions = [
    {
      title: "English Harbour & Nelson's Dockyard",
      description: "Historic UNESCO World Heritage site with beautifully restored 18th-century naval buildings, museums, restaurants, and yacht marina."
    },
    {
      title: "Shirley Heights",
      description: "Spectacular viewpoint overlooking English Harbour with famous Sunday sunset parties featuring live music and Caribbean BBQ."
    },
    {
      title: "Falmouth Harbour",
      description: "Premier yachting hub with world-class marinas, upscale dining, and annual sailing regattas including Antigua Sailing Week."
    },
    {
      title: "Pigeon Point Beach",
      description: "Pristine beach with calm turquoise waters, perfect for swimming and snorkeling. Popular for beach bars and water sports."
    },
    {
      title: "Fig Tree Drive",
      description: "Scenic rainforest drive through lush tropical vegetation, local farms, and traditional Antiguan villages."
    },
    {
      title: "Rendezvous Bay",
      description: "Secluded crescent beach accessible by boat or hiking trail, offering tranquil waters and excellent snorkeling."
    }
  ]

  const investment = [
    {
      title: "Tourism Hub",
      description: "Home to English Harbour and Falmouth Harbour, St. Paul attracts year-round tourism from yachting community and cultural visitors, driving strong rental demand."
    },
    {
      title: "Premium Location",
      description: "Properties near Nelson's Dockyard and Shirley Heights command premium prices and achieve high rental yields, especially during sailing season (November-May)."
    },
    {
      title: "Infrastructure Development",
      description: "Ongoing improvements to roads, utilities, and marina facilities continue to enhance property values and accessibility in the parish."
    },
    {
      title: "Historical Significance",
      description: "UNESCO World Heritage designation provides long-term protection and prestige, making properties in this area particularly desirable for international buyers."
    }
  ]

  return (
    <ParishPage
      parishName="St. Paul"
      parishSlug="st-paul"
      subtitle="South"
      mapImage="/images/maps/map-st-paul-update.png"
      description="Discover St. Paul, home to Antigua's historic English Harbour and the world-famous Shirley Heights. This picturesque southern parish combines colonial heritage, vibrant yachting culture, and stunning coastal scenery."
      attractions={attractions}
      investment={investment}
    />
  )
}
import ParishPage from "@/components/templates/ParishPage"

export default function StGeorgePage() {
  const attractions = [
    {
      title: "Parham Town",
      description: "Historic town with colonial architecture and St. Peter's Church, one of the oldest Anglican churches in the Caribbean (1840)."
    },
    {
      title: "Betty's Hope Sugar Plantation",
      description: "Restored 17th-century sugar plantation with twin windmills, offering insight into Antigua's colonial history and sugar industry."
    },
    {
      title: "Long Bay",
      description: "Beautiful undeveloped beach on the windward coast, popular with kite surfers and those seeking a quieter beach experience."
    },
    {
      title: "Devil's Bridge",
      description: "Natural limestone arch carved by Atlantic waves, offering dramatic ocean views and geological wonder on the rugged east coast."
    },
    {
      title: "Harmony Hall Art Gallery",
      description: "Restored sugar mill featuring Caribbean art, crafts, and a popular Italian restaurant overlooking Nonsuch Bay."
    },
    {
      title: "Antigua Rainforest Canopy Tour",
      description: "Zip-lining adventure through the rainforest canopy with suspension bridges and stunning valley views."
    }
  ]

  const investment = [
    {
      title: "Authentic Antiguan Character",
      description: "Less developed than western parishes, St. George offers opportunities for those seeking authentic Caribbean living and future growth potential."
    },
    {
      title: "Agricultural Heritage",
      description: "Rich farmland and historical significance at Betty's Hope creates unique opportunities for agritourism and heritage property development."
    },
    {
      title: "Growing Tourism Interest",
      description: "Increasing visitor interest in Devil's Bridge, rainforest tours, and eco-tourism activities is driving infrastructure improvements and property values."
    },
    {
      title: "East Coast Appeal",
      description: "Dramatic Atlantic coastline and cooler trade winds attract buyers looking for spectacular views and natural beauty away from mass tourism."
    }
  ]

  return (
    <ParishPage
      parishName="St. George"
      parishSlug="st-george"
      subtitle="Central/North"
      mapImage="/images/maps/map-st-george-update.png"
      description="Explore St. George, where Antigua's agricultural heritage meets natural beauty. Home to historic Betty's Hope plantation, dramatic Devil's Bridge, and authentic Caribbean villages, this central parish showcases the island's authentic character."
      attractions={attractions}
      investment={investment}
    />
  )
}
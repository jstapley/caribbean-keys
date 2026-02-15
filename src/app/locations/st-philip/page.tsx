import ParishPage from "@/components/templates/ParishPage"

export default function StPhilipPage() {
  const attractions = [
    {
      title: "Half Moon Bay",
      description: "Spectacular Atlantic-facing crescent beach with pink-tinted sand and dramatic waves, perfect for surfing and photography."
    },
    {
      title: "Mill Reef Club",
      description: "Exclusive private community and beach club known for pristine beaches and upscale Caribbean living."
    },
    {
      title: "Willoughby Bay",
      description: "Protected bay with calm waters ideal for kayaking, paddleboarding, and exploring secluded coves."
    },
    {
      title: "Green Island",
      description: "Small uninhabited island near Nonsuch Bay, perfect for day trips, snorkeling, and picnics in pristine natural setting."
    },
    {
      title: "Indian Town Point",
      description: "Dramatic rocky coastline with natural pools formed by Atlantic waves, offering stunning ocean views and exploration."
    },
    {
      title: "Nonsuch Bay Resort",
      description: "Luxury resort with protected bay perfect for sailing, windsurfing, and water sports in calm, turquoise waters."
    }
  ]

  const investment = [
    {
      title: "Atlantic Coast Exclusivity",
      description: "Less crowded eastern location offers privacy and natural beauty, attracting discerning buyers seeking secluded Caribbean estates."
    },
    {
      title: "Half Moon Bay Premium",
      description: "Properties near this iconic beach command strong prices due to its reputation as one of the Caribbean's most beautiful beaches."
    },
    {
      title: "Nonsuch Bay Development",
      description: "Growing resort and residential area around Nonsuch Bay creates opportunities in the emerging luxury vacation rental market."
    },
    {
      title: "Natural Beauty & Privacy",
      description: "Rugged coastline, protected bays, and lower density development appeal to buyers seeking authentic Caribbean seclusion and natural landscapes."
    }
  ]

  return (
    <ParishPage
      parishName="St. Philip"
      parishSlug="st-philip"
      subtitle="East"
      mapImage="/images/maps/map-st-philip-update.png"
      description="Discover St. Philip, Antigua's eastern paradise featuring the iconic Half Moon Bay. This parish offers dramatic Atlantic coastlines, secluded beaches, and exclusive communities for those seeking privacy and natural beauty."
      attractions={attractions}
      investment={investment}
    />
  )
}
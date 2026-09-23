import type { Property } from "@/types";

// Seed listings that belong to the demo agent / developer
export const agentOwnedListings: Property[] = [
  {
    id: "agent-prop-001",
    title: "4-Bedroom Duplex with BQ — Lekki Phase 1 (Your Listing)",
    description:
      "Fully detached duplex in a gated estate. Spacious living, fitted kitchen, BQ, parking for 4 cars and garden.",
    price: 145000000,
    location: "Lekki Phase 1",
    area: "Lekki",
    propertyType: "Duplex",
    bedrooms: 4,
    bathrooms: 5,
    bq: true,
    parking: 4,
    garden: true,
    swimmingPool: false,
    size: 420,
    facilities: ["Fitted Kitchen", "CCTV", "Generator", "BQ"],
    securityFeatures: ["Gated Estate", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    status: "available",
    agent: {
      id: "ag-01",
      name: "Chioma Okoro",
      phone: "+234 803 123 4567",
      whatsapp: "+2348031234567",
      company: "Lekki Homes Realty",
    },
    listedAt: "2026-08-12",
  },
  {
    id: "agent-prop-002",
    title: "3-Bedroom Apartment — Lekki (Your Listing)",
    description: "Modern apartment with pool access and good security.",
    price: 75000000,
    location: "Lekki Phase 1",
    area: "Lekki",
    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    bq: false,
    parking: 2,
    garden: false,
    swimmingPool: true,
    size: 160,
    facilities: ["Swimming Pool", "Gym", "Generator"],
    securityFeatures: ["24/7 Security", "CCTV"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    status: "available",
    agent: {
      id: "ag-01",
      name: "Chioma Okoro",
      phone: "+234 803 123 4567",
      whatsapp: "+2348031234567",
      company: "Lekki Homes Realty",
    },
    listedAt: "2026-09-05",
  },
];

const LISTINGS_KEY = "dreamhome_agent_listings";

export function getMyListings(): Property[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // first time — seed
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(agentOwnedListings));
  return agentOwnedListings;
}

export function addListing(property: Property) {
  const current = getMyListings();
  const next = [property, ...current];
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(next));
  return next;
}

export function getMockEnquiries() {
  return [
    {
      id: "enq-01",
      propertyTitle: "4-Bedroom Duplex with BQ — Lekki Phase 1",
      type: "inspection",
      name: "Tunde Bakare",
      phone: "+234 802 111 2222",
      message: "I would like to inspect this Saturday if possible.",
      date: "2026-09-20",
      status: "new",
    },
    {
      id: "enq-02",
      propertyTitle: "3-Bedroom Apartment — Lekki",
      type: "interest",
      name: "Aisha Mohammed",
      phone: "+234 803 444 5555",
      message: "Is this still available? Interested in viewing.",
      date: "2026-09-18",
      status: "new",
    },
  ];
}
import type { Professional, LandListing } from "@/types";

export const professionals: Professional[] = [
  {
    id: "pro-01",
    name: "Architect Funke Adeyemi",
    role: "architect",
    company: "Adeyemi & Partners",
    location: "Lekki, Lagos",
    bio: "Award-winning residential architect specialising in family homes and sustainable design across Lagos.",
    specialties: ["Residential Design", "Duplexes", "Sustainable Homes"],
    contact: {
      phone: "+234 803 111 2222",
      whatsapp: "+2348031112222",
      email: "funke@adeyemipartners.ng",
    },
  },
  {
    id: "pro-02",
    name: "BuildRight Construction",
    role: "builder",
    company: "BuildRight NG Ltd",
    location: "Ajah / Lekki",
    bio: "Experienced building contractor with over 40 completed residential projects in Lekki and Ajah corridors.",
    specialties: ["Turnkey Construction", "Duplexes", "Renovations"],
    contact: {
      phone: "+234 802 333 4444",
      whatsapp: "+2348023334444",
    },
  },
  {
    id: "pro-03",
    name: "Horizon Developers Ltd",
    role: "developer",
    company: "Horizon Developers Ltd",
    location: "Lekki Free Trade Zone",
    bio: "Property developer offering build-to-order and off-plan residential schemes with flexible payment options.",
    specialties: ["Off-plan", "Build-to-order", "Estate Development"],
    contact: {
      phone: "+234 701 222 3333",
      whatsapp: "+2347012223333",
      email: "leads@horizondevelopers.ng",
    },
  },
  {
    id: "pro-04",
    name: "Chief Land Holdings",
    role: "landowner",
    company: "Chief Land Holdings",
    location: "Sangotedo / Ajah",
    bio: "Family-owned land portfolio with verified titles in Sangotedo, Abraham Adesanya and surrounding areas.",
    specialties: ["Residential Plots", "Verified Title", "Flexible Terms"],
    contact: {
      phone: "+234 809 555 6666",
      whatsapp: "+2348095556666",
    },
  },
  {
    id: "pro-05",
    name: "Chioma Okoro",
    role: "agent",
    company: "Lekki Homes Realty",
    location: "Lekki Phase 1",
    bio: "Top-performing agent focused on family homes in Lekki and surrounding premium neighbourhoods.",
    specialties: ["Luxury Homes", "Family Properties", "Relocation Support"],
    contact: {
      phone: "+234 803 123 4567",
      whatsapp: "+2348031234567",
    },
  },
];

export const landListings: LandListing[] = [
  {
    id: "land-01",
    title: "600 sqm Dry Land — Sangotedo",
    location: "Sangotedo",
    area: "Ajah",
    size: 600,
    price: 45000000,
    titleType: "C of O in process",
    description: "Dry, well-positioned residential plot with good access. Suitable for a 4-bedroom duplex with BQ and garden.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    agent: {
      id: "ag-03",
      name: "Amina Bello",
      phone: "+234 809 555 1212",
      whatsapp: "+2348095551212",
      company: "Coastal Homes NG",
    },
  },
  {
    id: "land-02",
    title: "800 sqm Corner Piece — Abraham Adesanya",
    location: "Abraham Adesanya",
    area: "Ajah",
    size: 800,
    price: 72000000,
    titleType: "Governor's Consent",
    description: "Corner plot with excellent road frontage. Ideal for a larger family home or dual living arrangement.",
    images: [
      "https://images.unsplash.com/photo-1628624747186-a941c476f18c?w=800&q=80",
    ],
    agent: {
      id: "ag-03",
      name: "Amina Bello",
      phone: "+234 809 555 1212",
      whatsapp: "+2348095551212",
      company: "Coastal Homes NG",
    },
  },
  {
    id: "land-03",
    title: "500 sqm — Lekki Free Trade Zone Axis",
    location: "Lekki FTZ",
    area: "Lekki",
    size: 500,
    price: 55000000,
    titleType: "Excision",
    description: "Growing corridor with improving infrastructure. Suitable for modern duplex development.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    agent: {
      id: "ag-04",
      name: "Emeka Nwosu",
      phone: "+234 701 222 3333",
      whatsapp: "+2347012223333",
      company: "Horizon Developers Ltd",
    },
  },
];

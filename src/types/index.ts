export type PropertyType = "Duplex" | "Detached" | "Semi-Detached" | "Apartment" | "Terrace" | "Bungalow" | "Land" | "Penthouse";

export type SecurityLevel = "high" | "medium" | "low" | "preferred";

export interface Agent {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  photo?: string;
  company?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  area: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  bq: boolean;
  parking: number;
  garden: boolean;
  swimmingPool: boolean;
  size: number; // sqm
  facilities: string[];
  securityFeatures: string[];
  images: string[];
  status: "available" | "under-offer" | "sold";
  agent: Agent;
  listedAt: string;
  isLand?: boolean;
  isDeveloperProject?: boolean;
}

export interface UserRequirements {
  id: string;
  rawDescription?: string;
  locations: string[];
  alternativeLocations?: string[];
  propertyType?: PropertyType | string;
  bedrooms: number;
  bathrooms: number;
  bq: boolean | "preferred";
  parking: number;
  garden: boolean | "preferred";
  swimmingPool: boolean | "preferred";
  security: SecurityLevel;
  accessibility?: string[];
  neighbourhood?: string[];
  facilities: string[];
  lifestyle?: string[];
  budgetMin: number;
  budgetMax: number;
  landSizeMin?: number;
  landSizeMax?: number;
}

export interface MatchResult {
  propertyId: string;
  score: number;
  matched: string[];
  missing: string[];
  partial: string[];
  explanation: string;
  isAlternative?: boolean;
  alternativeReason?: string;
}

export interface DreamHomeSpecification {
  id: string;
  requirementsId: string;
  recommendedLandSize: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  bq: boolean;
  parking: number;
  garden: boolean;
  swimmingPool: "included" | "optional" | "not-included";
  preferredLocations: string[];
  indicativeCostMin: number;
  indicativeCostMax: number;
  notes: string;
  generatedAt: string;
}

export type ProfessionalRole = "architect" | "developer" | "builder" | "landowner" | "agent";

export interface Professional {
  id: string;
  name: string;
  role: ProfessionalRole;
  company?: string;
  location: string;
  bio: string;
  photo?: string;
  specialties: string[];
  contact: {
    phone: string;
    whatsapp: string;
    email?: string;
  };
}

export interface LandListing {
  id: string;
  title: string;
  location: string;
  area: string;
  size: number;
  price: number;
  titleType?: string;
  description: string;
  images: string[];
  agent: Agent;
}

export interface Enquiry {
  id: string;
  propertyId?: string;
  professionalId?: string;
  type: "interest" | "inspection" | "connection";
  name: string;
  phone: string;
  message?: string;
  preferredDate?: string;
  status: "submitted";
  createdAt: string;
}

import type { Property, UserRequirements, MatchResult } from "@/types";
import { properties } from "@/data/properties";

function formatNaira(amount: number): string {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}m`;
  }
  return `₦${amount.toLocaleString()}`;
}

export function parseDescriptionToRequirements(text: string): UserRequirements {
  const lower = text.toLowerCase();

  const locations: string[] = [];
  const locationKeywords: Record<string, string> = {
    lekki: "Lekki",
    ajah: "Ajah",
    sangotedo: "Sangotedo",
    chevron: "Chevron Drive",
    ikate: "Ikate",
    vgc: "VGC",
    "victoria garden": "VGC",
    "abraham adesanya": "Abraham Adesanya",
    "phase 1": "Lekki Phase 1",
    "phase 2": "Lekki Phase 2",
  };

  for (const [key, value] of Object.entries(locationKeywords)) {
    if (lower.includes(key) && !locations.includes(value)) {
      locations.push(value);
    }
  }
  if (locations.length === 0) locations.push("Lekki");

  let bedrooms = 4;
  const bedMatch = lower.match(/(\d+)\s*-?\s*bed/);
  if (bedMatch) bedrooms = parseInt(bedMatch[1], 10);

  let bathrooms = Math.max(2, bedrooms - 1);
  const bathMatch = lower.match(/(\d+)\s*-?\s*bath/);
  if (bathMatch) bathrooms = parseInt(bathMatch[1], 10);

  const bq = lower.includes("bq") || lower.includes("boys quarter") || lower.includes("boys' quarter");
  const garden = lower.includes("garden") || lower.includes("compound");
  const swimmingPool = lower.includes("pool") || lower.includes("swimming");
  const parkingMatch = lower.match(/parking\s*(?:for\s*)?(\d+)/) || lower.match(/(\d+)\s*car/);
  const parking = parkingMatch ? parseInt(parkingMatch[1], 10) : 2;

  let security: UserRequirements["security"] = "preferred";
  if (lower.includes("secure") || lower.includes("security") || lower.includes("gated")) {
    security = "high";
  }

  let budgetMin = 80000000;
  let budgetMax = 200000000;
  const budgetRange = lower.match(/(?:₦|naira|ngn)?\s*(\d+)\s*(?:m|million)?\s*(?:-|to|–)\s*(?:₦|naira|ngn)?\s*(\d+)\s*(?:m|million)?/);
  const singleBudget = lower.match(/(?:budget|around|about|₦)\s*(?:is\s*)?(?:₦|naira)?\s*(\d+)\s*(?:m|million)/);

  if (budgetRange) {
    budgetMin = parseInt(budgetRange[1], 10) * 1_000_000;
    budgetMax = parseInt(budgetRange[2], 10) * 1_000_000;
  } else if (singleBudget) {
    const val = parseInt(singleBudget[1], 10) * 1_000_000;
    budgetMin = Math.round(val * 0.85);
    budgetMax = Math.round(val * 1.15);
  }

  let propertyType = "Duplex";
  if (lower.includes("apartment") || lower.includes("flat")) propertyType = "Apartment";
  else if (lower.includes("bungalow")) propertyType = "Bungalow";
  else if (lower.includes("detached")) propertyType = "Detached";
  else if (lower.includes("terrace")) propertyType = "Terrace";
  else if (lower.includes("land")) propertyType = "Land";

  const facilities: string[] = [];
  if (bq) facilities.push("BQ");
  if (garden) facilities.push("Garden");
  if (swimmingPool) facilities.push("Swimming Pool");
  if (parking >= 3) facilities.push("Parking");

  return {
    id: `req-${Date.now()}`,
    rawDescription: text,
    locations,
    alternativeLocations: locations.includes("Lekki")
      ? ["Ajah", "Sangotedo"]
      : ["Lekki", "Ajah"],
    propertyType,
    bedrooms,
    bathrooms,
    bq: bq ? true : "preferred",
    parking,
    garden: garden ? true : "preferred",
    swimmingPool: swimmingPool ? true : "preferred",
    security,
    facilities,
    budgetMin,
    budgetMax,
  };
}

export function matchProperties(requirements: UserRequirements): MatchResult[] {
  const results: MatchResult[] = [];

  for (const prop of properties) {
    if (prop.isLand && requirements.propertyType !== "Land") continue;

    const matched: string[] = [];
    const missing: string[] = [];
    const partial: string[] = [];
    let score = 0;
    const _maxScore = 100;

    // Location (25 pts)
    const locMatch =
      requirements.locations.some(
        (l) =>
          prop.location.toLowerCase().includes(l.toLowerCase()) ||
          prop.area.toLowerCase().includes(l.toLowerCase())
      ) ||
      (requirements.alternativeLocations || []).some(
        (l) =>
          prop.location.toLowerCase().includes(l.toLowerCase()) ||
          prop.area.toLowerCase().includes(l.toLowerCase())
      );

    if (
      requirements.locations.some(
        (l) =>
          prop.location.toLowerCase().includes(l.toLowerCase()) ||
          prop.area.toLowerCase().includes(l.toLowerCase())
      )
    ) {
      score += 25;
      matched.push("Location");
    } else if (locMatch) {
      score += 15;
      partial.push("Location (alternative)");
    } else {
      missing.push("Preferred location");
    }

    // Bedrooms (20 pts)
    if (prop.bedrooms >= requirements.bedrooms) {
      score += 20;
      matched.push(`${prop.bedrooms} bedrooms`);
    } else if (prop.bedrooms === requirements.bedrooms - 1) {
      score += 10;
      partial.push("Bedrooms (one less)");
    } else {
      missing.push(`${requirements.bedrooms} bedrooms`);
    }

    // Budget (20 pts)
    if (prop.price >= requirements.budgetMin && prop.price <= requirements.budgetMax) {
      score += 20;
      matched.push("Within budget");
    } else if (prop.price <= requirements.budgetMax * 1.15) {
      score += 10;
      partial.push("Slightly above budget");
    } else if (prop.price < requirements.budgetMin) {
      score += 12;
      matched.push("Below budget");
    } else {
      missing.push("Budget");
    }

    // BQ (10 pts)
    if (requirements.bq === true) {
      if (prop.bq) {
        score += 10;
        matched.push("BQ");
      } else {
        missing.push("BQ");
      }
    } else if (requirements.bq === "preferred") {
      if (prop.bq) {
        score += 8;
        matched.push("BQ");
      } else {
        partial.push("BQ (preferred)");
      }
    } else {
      score += 5;
    }

    // Parking (10 pts)
    if (prop.parking >= requirements.parking) {
      score += 10;
      matched.push(`${prop.parking}-car parking`);
    } else if (prop.parking >= requirements.parking - 1) {
      score += 5;
      partial.push("Parking");
    } else {
      missing.push(`${requirements.parking}+ parking`);
    }

    // Garden (5 pts)
    if (requirements.garden === true || requirements.garden === "preferred") {
      if (prop.garden) {
        score += 5;
        matched.push("Garden");
      } else if (requirements.garden === true) {
        missing.push("Garden");
      } else {
        partial.push("Garden (preferred)");
      }
    } else {
      score += 3;
    }

    // Pool (5 pts)
    if (requirements.swimmingPool === true) {
      if (prop.swimmingPool) {
        score += 5;
        matched.push("Swimming pool");
      } else {
        missing.push("Swimming pool");
      }
    } else if (requirements.swimmingPool === "preferred") {
      if (prop.swimmingPool) {
        score += 4;
        matched.push("Swimming pool");
      }
    } else {
      score += 2;
    }

    // Security (5 pts)
    if (requirements.security === "high") {
      if (prop.securityFeatures.some((s) => s.toLowerCase().includes("gated") || s.toLowerCase().includes("24/7"))) {
        score += 5;
        matched.push("High security");
      } else {
        partial.push("Security");
      }
    } else {
      score += 3;
    }

    score = Math.min(100, Math.round(score));

    let explanation = "";
    if (score >= 85) {
      explanation = `This property matches most of your requirements. ${matched.slice(0, 4).join(", ")}.`;
      if (missing.length) explanation += ` It does not currently have: ${missing.join(", ")}.`;
    } else if (score >= 65) {
      explanation = `Good match on key points (${matched.slice(0, 3).join(", ")}). ${
        missing.length ? `Missing or different: ${missing.join(", ")}.` : ""
      }`;
    } else {
      explanation = `Partial match. Strong on ${matched.slice(0, 2).join(" and ") || "some features"}. Consider as an alternative.`;
    }

    const isAlternative = score < 75;
    let alternativeReason: string | undefined;
    if (isAlternative) {
      if (prop.price > requirements.budgetMax) {
        alternativeReason = `Slightly above your budget (${formatNaira(prop.price)} vs max ${formatNaira(requirements.budgetMax)}).`;
      } else if (!requirements.locations.some((l) => prop.location.toLowerCase().includes(l.toLowerCase()) || prop.area.toLowerCase().includes(l.toLowerCase()))) {
        alternativeReason = `Located in ${prop.location} (outside your primary preferred areas).`;
      } else if (missing.length) {
        alternativeReason = `Missing: ${missing.join(", ")}.`;
      } else {
        alternativeReason = "Close overall profile with some differences.";
      }
    }

    results.push({
      propertyId: prop.id,
      score,
      matched,
      missing,
      partial,
      explanation,
      isAlternative,
      alternativeReason,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function formatPrice(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `₦${(amount / 1_000_000_000).toFixed(2)}bn`;
  }
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}m`;
  }
  return `₦${amount.toLocaleString()}`;
}

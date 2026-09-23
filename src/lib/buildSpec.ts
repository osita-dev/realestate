import type { UserRequirements, DreamHomeSpecification } from "@/types";

export function generateDreamHomeSpec(req: UserRequirements): DreamHomeSpecification {
  const bedrooms = req.bedrooms || 4;
  const bathrooms = req.bathrooms || Math.max(3, bedrooms);
  const bq = req.bq === true || req.bq === "preferred";
  const parking = req.parking || 3;
  const garden = req.garden === true || req.garden === "preferred";
  const pool =
    req.swimmingPool === true
      ? "included"
      : req.swimmingPool === "preferred"
        ? "optional"
        : "not-included";

  // Simple land size heuristic
  let recommendedLandSize = 450;
  if (bedrooms >= 5 || parking >= 4) recommendedLandSize = 600;
  if (bedrooms >= 5 && (garden || pool === "included")) recommendedLandSize = 700;
  if (req.landSizeMin) recommendedLandSize = Math.max(recommendedLandSize, req.landSizeMin);

  // Very rough indicative construction range (prototype only)
  const basePerSqm = 280000; // illustrative
  const builtArea = bedrooms * 55 + (bq ? 40 : 0) + 80; // rough
  const constructionMid = builtArea * basePerSqm;
  const landCostEstimate = (req.budgetMax || 150000000) * 0.25;
  const indicativeCostMin = Math.round((constructionMid + landCostEstimate) * 0.85);
  const indicativeCostMax = Math.round((constructionMid + landCostEstimate) * 1.25);

  const preferredLocations =
    req.locations.length > 0
      ? req.locations
      : req.alternativeLocations || ["Sangotedo", "Ajah"];

  return {
    id: `spec-${Date.now()}`,
    requirementsId: req.id,
    recommendedLandSize,
    propertyType: (req.propertyType as string) || "Duplex",
    bedrooms,
    bathrooms,
    bq,
    parking,
    garden,
    swimmingPool: pool,
    preferredLocations,
    indicativeCostMin,
    indicativeCostMax,
    notes:
      "This is a preliminary AI-generated specification based on your requirements. Final design, land acquisition and construction costs must be validated by licensed professionals.",
    generatedAt: new Date().toISOString(),
  };
}

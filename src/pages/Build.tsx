import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hammer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { generateDreamHomeSpec } from "@/lib/buildSpec";
import { saveRequirements, saveSpec } from "@/lib/store";
import type { UserRequirements } from "@/types";

export default function Build() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState("Sangotedo, Ajah");
  const [bedrooms, setBedrooms] = useState("4");
  const [parking, setParking] = useState("3");
  const [budget, setBudget] = useState("150");
  const [bq, setBq] = useState(true);
  const [garden, setGarden] = useState(true);
  const [pool, setPool] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const locList = locations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const req: UserRequirements = {
        id: `req-build-${Date.now()}`,
        locations: locList.length ? locList : ["Sangotedo"],
        propertyType: "Duplex",
        bedrooms: parseInt(bedrooms, 10) || 4,
        bathrooms: Math.max(3, (parseInt(bedrooms, 10) || 4)),
        bq: bq,
        parking: parseInt(parking, 10) || 3,
        garden: garden ? true : "preferred",
        swimmingPool: pool ? true : "preferred",
        security: "high",
        facilities: [],
        budgetMin: Math.round(parseFloat(budget) * 0.7 * 1_000_000),
        budgetMax: (parseFloat(budget) || 150) * 1_000_000,
      };
      saveRequirements(req);
      const spec = generateDreamHomeSpec(req);
      saveSpec(spec);
      setLoading(false);
      navigate("/build/spec");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <div className="space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
            <Hammer className="h-4 w-4" />
            Build My Dream Home
          </div>
          <h1 className="text-3xl font-bold">Design your ideal home</h1>
          <p className="text-muted-foreground">
            Tell us what you need. We’ll generate a preliminary specification and indicative budget,
            then help you explore land and professionals.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Preferred locations</Label>
              <Input
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                placeholder="Sangotedo, Ajah"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Parking spaces</Label>
                <Input
                  type="number"
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Overall budget target (₦ million)</Label>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={bq} onChange={(e) => setBq(e.target.checked)} />
                Include BQ
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={garden}
                  onChange={(e) => setGarden(e.target.checked)}
                />
                Garden
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={pool} onChange={(e) => setPool(e.target.checked)} />
                Swimming pool
              </label>
            </div>
            <Button onClick={handleGenerate} disabled={loading} size="lg" className="gap-2">
              {loading ? "Generating specification…" : "Generate Dream Home Spec"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageSquare, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { parseDescriptionToRequirements } from "@/lib/matching";
import { saveRequirements } from "@/lib/store";
import { toast } from "sonner";

const EXAMPLE =
  "I want a secure four-bedroom family home around Lekki or Ajah, preferably somewhere quiet, with a BQ, parking for three cars and enough space for a small garden. My budget is around ₦150 million.";

export default function Find() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"text" | "guided">("text");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Guided fields
  const [locations, setLocations] = useState("Lekki, Ajah");
  const [bedrooms, setBedrooms] = useState("4");
  const [budgetMax, setBudgetMax] = useState("150");
  const [bq, setBq] = useState(true);
  const [parking, setParking] = useState("3");

  const handleTextSubmit = () => {
    if (!text.trim()) {
      toast.error("Please describe what you’re looking for.");
      return;
    }
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      const req = parseDescriptionToRequirements(text);
      saveRequirements(req);
      setLoading(false);
      navigate("/find/requirements");
    }, 1200);
  };

  const handleGuidedSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const locList = locations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const req = {
        id: `req-${Date.now()}`,
        rawDescription: `Guided: ${bedrooms} bed around ${locations}, budget ~₦${budgetMax}m`,
        locations: locList.length ? locList : ["Lekki"],
        alternativeLocations: ["Sangotedo", "Ajah"],
        propertyType: "Duplex",
        bedrooms: parseInt(bedrooms, 10) || 4,
        bathrooms: Math.max(3, (parseInt(bedrooms, 10) || 4) - 1),
        bq: bq ? true : ("preferred" as const),
        parking: parseInt(parking, 10) || 2,
        garden: "preferred" as const,
        swimmingPool: "preferred" as const,
        security: "high" as const,
        facilities: bq ? ["BQ"] : [],
        budgetMin: Math.round(parseFloat(budgetMax) * 0.8 * 1_000_000) || 80000000,
        budgetMax: (parseFloat(budgetMax) || 150) * 1_000_000,
      };
      saveRequirements(req);
      setLoading(false);
      navigate("/find/requirements");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Find My Dream Home</h1>
          <p className="text-muted-foreground">
            Describe what you want in ordinary language — or answer a few questions.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "text" ? "default" : "outline"}
            onClick={() => setMode("text")}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Free text
          </Button>
          <Button
            variant={mode === "guided" ? "default" : "outline"}
            onClick={() => setMode("guided")}
            className="gap-2"
          >
            <ListChecks className="h-4 w-4" />
            Guided questions
          </Button>
        </div>

        {mode === "text" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Describe your ideal home
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={EXAMPLE}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="resize-none text-base"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setText(EXAMPLE)}
                >
                  Use example
                </Button>
              </div>
              <Button
                onClick={handleTextSubmit}
                disabled={loading}
                className="w-full sm:w-auto"
                size="lg"
              >
                {loading ? "Understanding your requirements…" : "Continue"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">A few quick questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Preferred locations (comma-separated)</Label>
                <Input
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                  placeholder="Lekki, Ajah"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    min={1}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parking spaces (min)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Maximum budget (₦ million)</Label>
                <Input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bq"
                  checked={bq}
                  onChange={(e) => setBq(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                <Label htmlFor="bq">I need a BQ (Boys’ Quarter)</Label>
              </div>
              <Button
                onClick={handleGuidedSubmit}
                disabled={loading}
                className="w-full sm:w-auto"
                size="lg"
              >
                {loading ? "Preparing…" : "Continue"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}

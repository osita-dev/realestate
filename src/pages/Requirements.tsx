import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { UserRequirements } from "@/types";
import { loadRequirements, saveRequirements, saveMatches } from "@/lib/store";
import { matchProperties, formatPrice } from "@/lib/matching";
import { toast } from "sonner";

export default function Requirements() {
  const navigate = useNavigate();
  const [req, setReq] = useState<UserRequirements | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loaded = loadRequirements();
    if (!loaded) {
      navigate("/find");
      return;
    }
    setReq(loaded);
  }, [navigate]);

  if (!req) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const update = (partial: Partial<UserRequirements>) => {
    setReq({ ...req, ...partial });
  };

  const handleFind = () => {
    saveRequirements(req);
    const matches = matchProperties(req);
    saveMatches(matches);
    toast.success("Matching complete");
    navigate("/find/results");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/find">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">We understood you as…</h1>
          <p className="text-muted-foreground">
            Review and edit your requirements before we search for matches.
          </p>
        </div>

        {req.rawDescription && (
          <Card className="mb-6 bg-muted/30">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground italic">“{req.rawDescription}”</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Structured requirements</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
              className="gap-1"
            >
              <Pencil className="h-3.5 w-3.5" />
              {editing ? "Done" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label>Locations (comma-separated)</Label>
                  <Input
                    value={req.locations.join(", ")}
                    onChange={(e) =>
                      update({
                        locations: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      value={req.bedrooms}
                      onChange={(e) => update({ bedrooms: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input
                      type="number"
                      value={req.bathrooms}
                      onChange={(e) => update({ bathrooms: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Parking (min)</Label>
                    <Input
                      type="number"
                      value={req.parking}
                      onChange={(e) => update({ parking: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget max (₦)</Label>
                    <Input
                      type="number"
                      value={req.budgetMax}
                      onChange={(e) => update({ budgetMax: parseInt(e.target.value, 10) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={req.bq === true}
                      onChange={(e) => update({ bq: e.target.checked })}
                    />
                    BQ required
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={req.garden === true || req.garden === "preferred"}
                      onChange={(e) => update({ garden: e.target.checked ? "preferred" : false })}
                    />
                    Garden preferred
                  </label>
                </div>
              </>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <ReqItem label="Locations" value={req.locations.join(", ")} />
                <ReqItem label="Property type" value={String(req.propertyType || "Any")} />
                <ReqItem label="Bedrooms" value={String(req.bedrooms)} />
                <ReqItem label="Bathrooms" value={String(req.bathrooms)} />
                <ReqItem
                  label="BQ"
                  value={req.bq === true ? "Required" : req.bq === "preferred" ? "Preferred" : "No"}
                />
                <ReqItem label="Parking" value={`${req.parking}+ spaces`} />
                <ReqItem
                  label="Garden"
                  value={
                    req.garden === true
                      ? "Required"
                      : req.garden === "preferred"
                        ? "Preferred"
                        : "No"
                  }
                />
                <ReqItem label="Security" value={req.security} />
                <ReqItem
                  label="Budget"
                  value={`${formatPrice(req.budgetMin)} – ${formatPrice(req.budgetMax)}`}
                />
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button onClick={handleFind} size="lg" className="gap-2">
                Find matching properties
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function ReqItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm mt-0.5">{value}</p>
    </div>
  );
}

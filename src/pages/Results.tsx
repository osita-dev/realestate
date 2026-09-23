import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { MatchResult, UserRequirements } from "@/types";
import { properties } from "@/data/properties";
import {
  loadRequirements,
  loadMatches,
  getSavedIds,
  toggleSaved,
  getCompareIds,
  toggleCompare,
} from "@/lib/store";
import { formatPrice } from "@/lib/matching";

export default function Results() {
  const navigate = useNavigate();
  const [req, setReq] = useState<UserRequirements | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    const r = loadRequirements();
    const m = loadMatches();
    if (!r || !m.length) {
      navigate("/find");
      return;
    }
    setReq(r);
    setMatches(m);
    setSaved(getSavedIds());
    setCompare(getCompareIds());
  }, [navigate]);

  if (!req) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading matches…</p>
      </div>
    );
  }

  const strong = matches.filter((m) => m.score >= 75);
  const alternatives = matches.filter((m) => m.score < 75 && m.score >= 50);

  const getProp = (id: string) => properties.find((p) => p.id === id)!;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link to="/find/requirements">
            <ArrowLeft className="h-4 w-4 mr-1" /> Edit requirements
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your matches</h1>
            <p className="text-muted-foreground mt-1">
              Based on: {req.locations.join(", ")} · {req.bedrooms} bed ·{" "}
              {formatPrice(req.budgetMin)}–{formatPrice(req.budgetMax)}
            </p>
          </div>
          {compare.length > 0 && (
            <Button asChild>
              <Link to="/find/compare">Compare ({compare.length})</Link>
            </Button>
          )}
        </div>

        {/* Strong matches */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Strong matches</h2>
            <Badge variant="secondary">{strong.length}</Badge>
          </div>
          {strong.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No strong matches found. See alternatives below.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {strong.map((m) => (
                <PropertyCard
                  key={m.propertyId}
                  property={getProp(m.propertyId)}
                  match={m}
                  saved={saved.includes(m.propertyId)}
                  onToggleSave={(id) => setSaved(toggleSaved(id))}
                  compareSelected={compare.includes(m.propertyId)}
                  onToggleCompare={(id) => setCompare(toggleCompare(id))}
                />
              ))}
            </div>
          )}
        </section>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Smart alternatives</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We couldn’t find a perfect match for every requirement. These options are close and
                worth considering.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternatives.map((m) => (
                <PropertyCard
                  key={m.propertyId}
                  property={getProp(m.propertyId)}
                  match={m}
                  saved={saved.includes(m.propertyId)}
                  onToggleSave={(id) => setSaved(toggleSaved(id))}
                  compareSelected={compare.includes(m.propertyId)}
                  onToggleCompare={(id) => setCompare(toggleCompare(id))}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-3">Nothing quite right?</p>
          <Button asChild variant="outline">
            <Link to="/build">Explore Build My Dream Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { properties } from "@/data/properties";
import { getCompareIds, loadMatches } from "@/lib/store";
import { formatPrice } from "@/lib/matching";
import type { MatchResult } from "@/types";

export default function Compare() {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    const c = getCompareIds();
    if (c.length < 2) {
      navigate("/find/results");
      return;
    }
    setIds(c);
    setMatches(loadMatches());
  }, [navigate]);

  const props = ids.map((id) => properties.find((p) => p.id === id)!).filter(Boolean);

  if (props.length < 2) return null;

  const rows: { label: string; values: (string | boolean | number)[] }[] = [
    { label: "Price", values: props.map((p) => formatPrice(p.price)) },
    { label: "Location", values: props.map((p) => p.location) },
    { label: "Type", values: props.map((p) => p.propertyType) },
    { label: "Bedrooms", values: props.map((p) => p.bedrooms) },
    { label: "Bathrooms", values: props.map((p) => p.bathrooms) },
    { label: "BQ", values: props.map((p) => p.bq) },
    { label: "Parking", values: props.map((p) => p.parking) },
    { label: "Garden", values: props.map((p) => p.garden) },
    { label: "Pool", values: props.map((p) => p.swimmingPool) },
    { label: "Size (sqm)", values: props.map((p) => p.size) },
    {
      label: "Match %",
      values: props.map((p) => {
        const m = matches.find((x) => x.propertyId === p.id);
        return m ? `${m.score}%` : "—";
      }),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 overflow-x-auto">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/find/results">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to results
          </Link>
        </Button>
        <h1 className="text-2xl font-bold mb-6">Compare properties</h1>

        <div className="min-w-[600px]">
          <div
            className="grid gap-4 mb-4"
            style={{ gridTemplateColumns: `160px repeat(${props.length}, 1fr)` }}
          >
            <div />
            {props.map((p) => (
              <div key={p.id} className="space-y-2">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-sm line-clamp-2">{p.title}</p>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link to={`/property/${p.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>

          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-4 py-3 border-t text-sm"
              style={{ gridTemplateColumns: `160px repeat(${props.length}, 1fr)` }}
            >
              <div className="font-medium text-muted-foreground">{row.label}</div>
              {row.values.map((v, i) => (
                <div key={i}>
                  {typeof v === "boolean" ? (
                    v ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground" />
                    )
                  ) : (
                    v
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

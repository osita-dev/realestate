import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { properties } from "@/data/properties";
import { getSavedIds, toggleSaved } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function Saved() {
  const [saved, setSaved] = useState(getSavedIds());
  const list = properties.filter((p) => saved.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Saved properties</h1>

        {list.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground">You haven’t saved any properties yet.</p>
            <Button asChild>
              <Link to="/search">Browse properties</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                showMatch={false}
                saved
                onToggleSave={(id) => setSaved(toggleSaved(id))}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

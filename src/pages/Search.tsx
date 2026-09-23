import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { properties } from "@/data/properties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSavedIds, toggleSaved } from "@/lib/store";

export default function Search() {
  const [location, setLocation] = useState("all");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [saved, setSaved] = useState(getSavedIds());

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (location !== "all") {
        const loc = location.toLowerCase();
        if (
          !p.location.toLowerCase().includes(loc) &&
          !p.area.toLowerCase().includes(loc)
        )
          return false;
      }
      if (type !== "all" && p.propertyType !== type) return false;
      if (beds !== "all" && p.bedrooms < parseInt(beds, 10)) return false;
      if (maxPrice && p.price > parseFloat(maxPrice) * 1_000_000) return false;
      return true;
    });
  }, [location, type, beds, maxPrice]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Browse properties</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 rounded-xl border bg-card">
          <div className="space-y-1.5">
            <Label className="text-xs">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="Lekki">Lekki</SelectItem>
                <SelectItem value="Ajah">Ajah</SelectItem>
                <SelectItem value="Sangotedo">Sangotedo</SelectItem>
                <SelectItem value="VGC">VGC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Property type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Duplex">Duplex</SelectItem>
                <SelectItem value="Detached">Detached</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Bungalow">Bungalow</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Min bedrooms</Label>
            <Select value={beds} onValueChange={setBeds}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max budget (₦m)</Label>
            <Input
              type="number"
              placeholder="e.g. 150"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} propert{filtered.length === 1 ? "y" : "ies"}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              showMatch={false}
              saved={saved.includes(p.id)}
              onToggleSave={(id) => setSaved(toggleSaved(id))}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No properties match your filters. Try adjusting them.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

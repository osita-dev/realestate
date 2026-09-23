import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";
import { addListing } from "@/data/agentListings";
import type { Property } from "@/types";
import { toast } from "sonner";

export default function AddListing() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Lekki Phase 1");
  const [bedrooms, setBedrooms] = useState("4");
  const [bathrooms, setBathrooms] = useState("4");
  const [parking, setParking] = useState("3");
  const [bq, setBq] = useState(true);
  const [description, setDescription] = useState("");

  if (!user || (user.role !== "agent" && user.role !== "developer")) {
    navigate("/agent-login");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      toast.error("Title and price are required");
      return;
    }

    const newProp: Property = {
      id: `agent-prop-${Date.now()}`,
      title,
      description: description || "New listing added via agent dashboard.",
      price: parseFloat(price) * 1_000_000,
      location,
      area: location.includes("Ajah") || location.includes("Sangotedo") ? "Ajah" : "Lekki",
      propertyType: "Duplex",
      bedrooms: parseInt(bedrooms, 10) || 4,
      bathrooms: parseInt(bathrooms, 10) || 4,
      bq,
      parking: parseInt(parking, 10) || 2,
      garden: true,
      swimmingPool: false,
      size: 350,
      facilities: bq ? ["BQ", "Fitted Kitchen"] : ["Fitted Kitchen"],
      securityFeatures: ["Gated Estate", "24/7 Security"],
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      ],
      status: "available",
      agent: {
        id: user.id,
        name: user.name,
        phone: user.phone || "",
        whatsapp: (user.phone || "").replace(/\s/g, ""),
        company: user.company,
      },
      listedAt: new Date().toISOString().slice(0, 10),
      isDeveloperProject: user.role === "developer",
    };

    addListing(newProp);
    toast.success("Listing added successfully");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to dashboard
          </Link>
        </Button>

        <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Property details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4-Bedroom Duplex with BQ — Lekki"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₦ million) *</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="145"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parking</Label>
                  <Input
                    type="number"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={bq}
                  onChange={(e) => setBq(e.target.checked)}
                />
                Has BQ
              </label>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Short description of the property..."
                />
              </div>

              <Button type="submit" size="lg">
                Publish Listing
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

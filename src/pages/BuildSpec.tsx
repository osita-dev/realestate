import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { DreamHomeSpecification, Professional } from "@/types";
import { loadSpec } from "@/lib/store";
import { formatPrice } from "@/lib/matching";
import { landListings, professionals } from "@/data/professionals";
import { toast } from "sonner";

export default function BuildSpec() {
  const navigate = useNavigate();
  const [spec, setSpec] = useState<DreamHomeSpecification | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const s = loadSpec();
    if (!s) {
      navigate("/build");
      return;
    }
    setSpec(s);
  }, [navigate]);

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const openConnect = (pro: Professional) => {
    setSelectedPro(pro);
    setConnectOpen(true);
  };

  const submitConnect = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter name and phone");
      return;
    }
    setConnectOpen(false);
    setSuccess(true);
    setName("");
    setPhone("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
          <Link to="/build">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Preliminary Dream Home Specification</h1>
          <p className="text-muted-foreground">
            Generated from your requirements. This is a starting point for discussion with
            professionals.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Recommended configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <SpecItem label="Recommended land size" value={`${spec.recommendedLandSize} sqm`} />
              <SpecItem label="Property type" value={spec.propertyType} />
              <SpecItem label="Bedrooms" value={String(spec.bedrooms)} />
              <SpecItem label="Bathrooms" value={String(spec.bathrooms)} />
              <SpecItem label="BQ" value={spec.bq ? "Included" : "Not included"} />
              <SpecItem label="Parking" value={`${spec.parking} vehicles`} />
              <SpecItem label="Garden" value={spec.garden ? "Included" : "Optional"} />
              <SpecItem
                label="Swimming pool"
                value={
                  spec.swimmingPool === "included"
                    ? "Included"
                    : spec.swimmingPool === "optional"
                      ? "Optional"
                      : "Not included"
                }
              />
              <SpecItem
                label="Preferred locations"
                value={spec.preferredLocations.join(", ")}
              />
            </div>

            <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 text-sm">Indicative construction range</p>
                  <p className="text-lg font-semibold text-amber-900 mt-1">
                    {formatPrice(spec.indicativeCostMin)} – {formatPrice(spec.indicativeCostMax)}
                  </p>
                  <p className="text-xs text-amber-800 mt-2">
                    Preliminary estimate — subject to professional validation. Includes rough land
                    and construction assumptions only. Not a quotation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Land */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Explore land
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {landListings.map((land) => (
              <Card key={land.id}>
                <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                  <img
                    src={land.images[0]}
                    alt={land.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4 space-y-2">
                  <p className="font-semibold text-primary">{formatPrice(land.price)}</p>
                  <p className="font-medium text-sm">{land.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {land.size} sqm · {land.location}
                  </p>
                  {land.titleType && (
                    <Badge variant="outline" className="text-xs">
                      {land.titleType}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Professionals */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Connect with professionals
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {professionals
              .filter((p) => p.role !== "agent")
              .map((pro) => (
                <Card key={pro.id}>
                  <CardContent className="pt-5 space-y-3">
                    <div>
                      <p className="font-semibold">{pro.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {pro.role} · {pro.location}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pro.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {pro.specialties.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" onClick={() => openConnect(pro)}>
                      Request connection
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request connection</DialogTitle>
          </DialogHeader>
          {selectedPro && (
            <p className="text-sm text-muted-foreground">
              Connect with {selectedPro.name} ({selectedPro.role})
            </p>
          )}
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Your name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitConnect}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request sent</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your connection request has been recorded. This is a prototype — no real message was
            sent. A professional would normally follow up shortly.
          </p>
          <DialogFooter>
            <Button onClick={() => setSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-sm mt-0.5">{value}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bed,
  Bath,
  Car,
  MapPin,
  Check,
  X,
  Heart,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPropertyById, formatPrice, matchProperties } from "@/lib/matching";
import { loadRequirements, getSavedIds, toggleSaved, loadMatches } from "@/lib/store";
import type { MatchResult } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = id ? getPropertyById(id) : undefined;
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!property) return;
    const req = loadRequirements();
    if (req) {
      const results = matchProperties(req);
      const m = results.find((r) => r.propertyId === property.id);
      setMatch(m || null);
    } else {
      const stored = loadMatches().find((m) => m.propertyId === property.id);
      setMatch(stored || null);
    }
    setSaved(getSavedIds().includes(property.id));
  }, [property]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">Property not found</p>
            <Button asChild>
              <Link to="/search">Browse properties</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSave = () => {
    const next = toggleSaved(property.id);
    setSaved(next.includes(property.id));
    toast.success(next.includes(property.id) ? "Saved" : "Removed from saved");
  };

  const submitEnquiry = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }
    setEnquiryOpen(false);
    setInspectionOpen(false);
    setSuccessOpen(true);
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link to={-1 as any} onClick={(e) => { e.preventDefault(); navigate(-1); }}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Gallery + main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {property.images.slice(1, 4).map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
                  <h1 className="text-xl md:text-2xl font-semibold mt-1">{property.title}</h1>
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </p>
                </div>
                {match && (
                  <Badge
                    className={cn(
                      "text-sm",
                      match.score >= 85
                        ? "bg-emerald-600"
                        : match.score >= 70
                          ? "bg-amber-600"
                          : "bg-slate-600"
                    )}
                  >
                    {match.score}% Match
                  </Badge>
                )}
              </div>

              {!property.isLand && (
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    {property.bedrooms} Bedrooms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    {property.bathrooms} Bathrooms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    {property.parking} Parking
                  </span>
                  {property.bq && <Badge variant="outline">BQ</Badge>}
                  {property.garden && <Badge variant="outline">Garden</Badge>}
                  {property.swimmingPool && <Badge variant="outline">Pool</Badge>}
                </div>
              )}

              <p className="mt-6 text-muted-foreground leading-relaxed">{property.description}</p>

              {property.facilities.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.facilities.map((f) => (
                      <Badge key={f} variant="secondary">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {property.securityFeatures.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Security</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.securityFeatures.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {match && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Match explanation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{match.explanation}</p>
                  <div className="space-y-1">
                    {match.matched.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-sm text-emerald-700">
                        <Check className="h-4 w-4" /> {m}
                      </div>
                    ))}
                    {match.missing.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-sm text-red-600">
                        <X className="h-4 w-4" /> {m}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {property.agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{property.agent.name}</p>
                    <p className="text-xs text-muted-foreground">{property.agent.company}</p>
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={() => setEnquiryOpen(true)}>
                  <MessageCircle className="h-4 w-4" />
                  Express interest
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setInspectionOpen(true)}
                >
                  <Calendar className="h-4 w-4" />
                  Request inspection
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={handleSave}>
                  <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
                  {saved ? "Saved" : "Save property"}
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <a
                    href={`https://wa.me/${property.agent.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp agent
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Enquiry modal */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Your name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234…" />
            </div>
            <div className="space-y-2">
              <Label>Message (optional)</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnquiryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEnquiry}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspection modal */}
      <Dialog open={inspectionOpen} onOpenChange={setInspectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request inspection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Your name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Preferred date (optional)</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInspectionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEnquiry}>Request inspection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request submitted</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Thank you. The agent will contact you shortly. This is a prototype confirmation — no real
            message was sent.
          </p>
          <DialogFooter>
            <Button onClick={() => setSuccessOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

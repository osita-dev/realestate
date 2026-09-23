import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Plus,
  LogOut,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCurrentUser, logout } from "@/lib/auth";
import { getMyListings, getMockEnquiries } from "@/data/agentListings";
import { formatPrice } from "@/lib/matching";
import type { Property } from "@/types";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [listings, setListings] = useState<Property[]>([]);
  const enquiries = getMockEnquiries();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || (u.role !== "agent" && u.role !== "developer")) {
      navigate("/agent-login");
      return;
    }
    setUser(u);
    setListings(getMyListings());
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              {user.role === "agent" ? "Agent" : "Developer"} Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {user.name} · {user.company}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/dashboard/add">
                <Plus className="h-4 w-4 mr-1" />
                Add Listing
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Listings</p>
              <p className="text-3xl font-bold mt-1">{listings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">New Enquiries</p>
              <p className="text-3xl font-bold mt-1">{enquiries.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-xl font-semibold mt-1 capitalize">{user.role}</p>
            </CardContent>
          </Card>
        </div>

        {/* My Listings */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              My Listings
            </h2>
          </div>

          {listings.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No listings yet.{" "}
                <Link to="/dashboard/add" className="text-primary underline">
                  Add your first property
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {listings.map((p) => (
                <Card key={p.id}>
                  <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="h-20 w-28 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{p.title}</p>
                      <p className="text-sm text-primary font-semibold">
                        {formatPrice(p.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.location} · {p.bedrooms} bed · {p.propertyType}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          p.status === "available" ? "default" : "secondary"
                        }
                      >
                        {p.status}
                      </Badge>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/property/${p.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Enquiries */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5" />
            Recent Enquiries
          </h2>
          <div className="space-y-3">
            {enquiries.map((e) => (
              <Card key={e.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <p className="font-medium">{e.name}</p>
                      <p className="text-sm text-muted-foreground">{e.phone}</p>
                      <p className="text-sm mt-1">{e.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Re: {e.propertyTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {e.type}
                      </Badge>
                      <Badge>{e.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
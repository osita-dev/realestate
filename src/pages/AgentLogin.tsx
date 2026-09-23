import { useNavigate } from "react-router-dom";
import { Building2, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { loginAs } from "@/lib/auth";
import { toast } from "sonner";

export default function AgentLogin() {
  const navigate = useNavigate();

  const handleLogin = (role: "agent" | "developer") => {
    loginAs(role);
    toast.success(`Signed in as ${role === "agent" ? "Agent" : "Developer"}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">For Agents & Developers</h1>
          <p className="text-muted-foreground mt-2">
            This is a prototype. Choose a role to enter the mini dashboard.
            No real account is created.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-primary" />
                Continue as Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage listings, receive enquiries and request inspections from home seekers.
              </p>
              <Button className="w-full" onClick={() => handleLogin("agent")}>
                Enter Agent Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HardHat className="h-5 w-5 text-primary" />
                Continue as Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                List developments, offer build-to-order options and receive qualified leads.
              </p>
              <Button className="w-full" onClick={() => handleLogin("developer")}>
                Enter Developer Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
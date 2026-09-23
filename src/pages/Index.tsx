import { Link } from "react-router-dom";
import { Search, Home, Hammer, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/property/PropertyCard";
import { formatPrice } from "@/lib/matching";

export default function Index() {
  const featured = properties.filter((p) => !p.isLand).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-powered personalised real estate
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Tell us what you want.
              <br />
              <span className="text-primary">We help you find it — or build it.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Describe your ideal home in ordinary language. We understand your requirements,
              match you with real properties, explain every recommendation, and open a path
              to build when the market cannot deliver.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" variant="secondary">
                <Link to="/find">Find My Dream Home</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/build">Build instead</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/agent-login">For Agents & Developers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">How DreamHome works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Search,
                title: "Describe what you want",
                desc: "Type freely or answer a few questions. Location, budget, bedrooms, BQ, parking, security — in your own words.",
              },
              {
                icon: Sparkles,
                title: "We understand & match",
                desc: "Your description becomes structured requirements. Every property is scored with a clear match percentage and explanation.",
              },
              {
                icon: Home,
                title: "Find, compare or build",
                desc: "View strong matches, explore smart alternatives, or start a Build My Dream Home pathway with land and professionals.",
              },
            ].map((step) => (
              <Card key={step.title} className="border-0 shadow-sm bg-card">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-bold mb-3">From words to matches</h2>
            <p className="text-muted-foreground">
              Example: “I want a secure four-bedroom family home around Lekki, preferably quiet,
              with a BQ, parking for three cars and space for a small garden. Budget around ₦150 million.”
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
            {[
              "Location: Lekki",
              "Bedrooms: 4",
              "BQ: Required",
              "Parking: 3+",
              "Security: High",
              "Garden: Preferred",
              "Budget: ₦120–150m",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild>
              <Link to="/find">
                Try it yourself <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured properties</h2>
            <Button asChild variant="ghost">
              <Link to="/search">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} showMatch={false} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to find your place?</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Start with a simple description. We’ll turn it into clear requirements and real options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg" variant="secondary">
              <Link to="/find">Find My Dream Home</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/build">Build instead</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

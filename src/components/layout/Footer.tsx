import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Home className="h-5 w-5" />
              DreamHome
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tell us what you want. We help you find it, understand your options, or explore how to create it.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/find" className="hover:text-primary">Find My Dream Home</Link></li>
              <li><Link to="/build" className="hover:text-primary">Build My Dream Home</Link></li>
              <li><Link to="/search" className="hover:text-primary">Browse Properties</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">About (prototype)</span></li>
              <li><span className="cursor-default">How it works</span></li>
              <li><span className="cursor-default">For Agents & Developers</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Note</h4>
            <p className="text-sm text-muted-foreground">
              This is an interactive prototype. All data, matches and cost estimates are simulated for demonstration purposes.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} DreamHome Prototype. Built for client demonstration.
        </div>
      </div>
    </footer>
  );
}

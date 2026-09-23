import { Link } from "react-router-dom";
import { Bed, Bath, Car, MapPin, Heart, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Property, MatchResult } from "@/types";
import { formatPrice } from "@/lib/matching";
import { cn } from "@/lib/utils";

interface Props {
  property: Property;
  match?: MatchResult;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  compareSelected?: boolean;
  onToggleCompare?: (id: string) => void;
  showMatch?: boolean;
}

export function PropertyCard({
  property,
  match,
  saved,
  onToggleSave,
  compareSelected,
  onToggleCompare,
  showMatch = true,
}: Props) {
  const score = match?.score;

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.images[0]}
          alt={property.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {showMatch && score !== undefined && (
          <Badge
            className={cn(
              "absolute top-3 left-3 font-semibold",
              score >= 85
                ? "bg-emerald-600 hover:bg-emerald-600"
                : score >= 70
                  ? "bg-amber-600 hover:bg-amber-600"
                  : "bg-slate-600 hover:bg-slate-600"
            )}
          >
            {score}% Match
          </Badge>
        )}
        {property.isDeveloperProject && (
          <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-600">
            Developer
          </Badge>
        )}
        {property.isLand && (
          <Badge className="absolute top-3 right-3 bg-stone-600 hover:bg-stone-600">
            Land
          </Badge>
        )}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {onToggleSave && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onToggleSave(property.id);
              }}
            >
              <Heart
                className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")}
              />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-lg font-semibold text-primary">
            {formatPrice(property.price)}
          </p>
          <h3 className="font-medium leading-snug line-clamp-2 mt-0.5">
            <Link to={`/property/${property.id}`} className="hover:text-primary">
              {property.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.location}
          </p>
        </div>

        {!property.isLand && (
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {property.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms} bath
            </span>
            <span className="flex items-center gap-1">
              <Car className="h-4 w-4" /> {property.parking}
            </span>
            {property.bq && (
              <Badge variant="outline" className="text-xs">
                BQ
              </Badge>
            )}
          </div>
        )}

        {property.isLand && (
          <p className="text-sm text-muted-foreground">{property.size} sqm</p>
        )}

        {match && showMatch && (
          <div className="pt-2 border-t space-y-1.5">
            <div className="flex flex-wrap gap-1">
              {match.matched.slice(0, 4).map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-0.5 text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded"
                >
                  <Check className="h-3 w-3" /> {m}
                </span>
              ))}
              {match.missing.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded"
                >
                  <X className="h-3 w-3" /> {m}
                </span>
              ))}
            </div>
            {match.isAlternative && match.alternativeReason && (
              <p className="text-xs text-muted-foreground italic">
                Alternative: {match.alternativeReason}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/property/${property.id}`}>View details</Link>
          </Button>
          {onToggleCompare && (
            <Button
              size="sm"
              variant={compareSelected ? "default" : "outline"}
              onClick={() => onToggleCompare(property.id)}
            >
              {compareSelected ? "Selected" : "Compare"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

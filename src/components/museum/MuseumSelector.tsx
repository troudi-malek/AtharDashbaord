
import { Building2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MuseumSelectorProps {
  selectedMuseum: string;
  onMuseumChange: (museum: string) => void;
}

const museums = [
  {
    name: "Metropolitan Museum of Art",
    location: "New York, NY",
    logo: "🏛️",
    bannerImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=300&fit=crop&crop=center",
  },
  {
    name: "Louvre Museum",
    location: "Paris, France", 
    logo: "🎨",
    bannerImage: "https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1200&h=300&fit=crop&crop=center",
  },
  {
    name: "British Museum",
    location: "London, UK",
    logo: "🏺",
    bannerImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=300&fit=crop&crop=center",
  },
];

export function MuseumSelector({ selectedMuseum, onMuseumChange }: MuseumSelectorProps) {
  const currentMuseum = museums.find(m => m.name === selectedMuseum) || museums[0];

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      {/* Banner Image */}
      <div 
        className="h-48 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${currentMuseum.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Museum Info Overlay */}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="text-4xl bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                {currentMuseum.logo}
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">{currentMuseum.name}</h2>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span>{currentMuseum.location}</span>
                </div>
              </div>
            </div>
            
            <Select value={selectedMuseum} onValueChange={onMuseumChange}>
              <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {museums.map((museum) => (
                  <SelectItem key={museum.name} value={museum.name}>
                    <div className="flex items-center gap-2">
                      <span>{museum.logo}</span>
                      <div>
                        <div className="font-medium">{museum.name}</div>
                        <div className="text-sm text-muted-foreground">{museum.location}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

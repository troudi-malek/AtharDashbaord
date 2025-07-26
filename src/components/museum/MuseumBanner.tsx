import { MapPin, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const museumData = {
  name: "Metropolitan Museum of Art",
  location: "New York, NY",
  tagline: "Where art comes alive through innovation",
  bannerImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&h=300&fit=crop&crop=center",
  logo: "🏛️",
  totalVisitors: "1,247",
  monthlyGrowth: "+12%",
  activeExperiences: "4"
};

export function MuseumBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      {/* Banner Image */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${museumData.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Museum Info Overlay */}
        <div className="absolute inset-0 flex items-end p-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <div className="text-5xl bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                {museumData.logo}
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{museumData.name}</h1>
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{museumData.location}</span>
                </div>
                <p className="text-white/80 italic text-lg">{museumData.tagline}</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{museumData.totalVisitors}</div>
                <div className="text-white/80 text-sm">Daily Visitors</div>
                <div className="text-primary text-sm font-medium">{museumData.monthlyGrowth}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{museumData.activeExperiences}</div>
                <div className="text-white/80 text-sm">Active Experiences</div>
                <div className="text-green-400 text-sm font-medium">All Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Museum-themed decorative element */}
      <div className="absolute bottom-0 left-0 opacity-10">
        <svg width="200" height="60" viewBox="0 0 200 60" className="text-white">
          <path 
            d="M20 50 L40 50 L40 20 L160 20 L160 50 L180 50" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
          />
          <rect x="50" y="20" width="8" height="30" fill="currentColor" />
          <rect x="70" y="20" width="8" height="30" fill="currentColor" />
          <rect x="90" y="20" width="8" height="30" fill="currentColor" />
          <rect x="110" y="20" width="8" height="30" fill="currentColor" />
          <rect x="130" y="20" width="8" height="30" fill="currentColor" />
          <rect x="150" y="20" width="8" height="30" fill="currentColor" />
          <polygon points="40,20 100,5 160,20" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
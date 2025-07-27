import { useEffect, useState } from "react";
import { MapPin, Users, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GetMuseumById } from "@/services/SuperAdmin/museumsService";

interface MuseumBannerProps {
  museumId: string;
}

export function MuseumBanner({ museumId }: MuseumBannerProps) {
  const [museumData, setMuseumData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!museumId) return;
    setLoading(true);
    GetMuseumById(museumId)
      .then((data) => {
        console.log("API response:", data);
        setMuseumData(data.data); // <-- adjust here
      })
      .finally(() => setLoading(false));
  }, [museumId]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>;
  }
  if (!museumData) {
    return <div className="h-64 flex items-center justify-center text-red-500">Museum not found</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      {/* Banner Image */}
      <div 
        className="h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${museumData.bannerImage || `http://localhost:5000/uploads/${museumData.imageUrl}`})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        {/* Museum Info Overlay */}
        <div className="absolute inset-0 flex items-end p-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <div className="text-5xl bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                {museumData.logo || "🏛️"}
              </div>
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{museumData.name}</h1>
                <div className="flex items-center gap-2 text-white/90 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{museumData.location}</span>
                </div>
                <p className="text-white/80 italic text-lg">{museumData.tagline || museumData.description}</p>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="flex gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{museumData.totalVisits ?? "-"}</div>
                <div className="text-white/80 text-sm">Daily Visitors</div>
                <div className="text-primary text-sm font-medium">{museumData.monthlyGrowth ?? "-"}</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{museumData.nb_ArExperience ?? "-"}</div>
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
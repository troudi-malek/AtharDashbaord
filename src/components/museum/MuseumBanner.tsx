import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { GetMuseumById } from "@/services/museumsService";
import { getMediaUrl } from "@/lib/media";

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
        setMuseumData(data?.data ?? data);
      })
      .catch((error) => {
        console.error("Failed to load museum:", error);
        setMuseumData(null);
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
      {/* Banner Image (supports any aspect ratio) */}
      <div className="relative">
        <img
          src={getMediaUrl(museumData.imageUrl)}
          alt={museumData.name}
          className="w-full h-auto max-h-[28rem] object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 z-0" />
        {/* Museum Info Overlay */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6 w-full">
            {/* Info block */}
            <div className="flex items-start lg:items-center gap-4 lg:gap-6">
              <div className="text-3xl lg:text-5xl bg-white/10 p-3 lg:p-4 rounded-xl backdrop-blur-sm shrink-0">
                {museumData.logo || "🏛️"}
              </div>
              <div className="text-white max-w-full">
                <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2 break-words">{museumData.name}</h1>
                <div className="flex items-center gap-2 text-white/90 mb-1 lg:mb-2">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-base lg:text-lg break-words">{museumData.location}</span>
                </div>
                <p className="text-white/80 italic text-sm lg:text-lg break-words">{museumData.tagline || museumData.description}</p>
              </div>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 w-full lg:w-auto">
              {/* Daily Visitors */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <div className="text-lg lg:text-2xl font-bold text-white leading-tight">{museumData.totalVisits ?? "-"}</div>
                <div className="text-white/80 text-[10px] lg:text-sm leading-tight">Daily Visitors</div>
                <div className="text-primary text-[10px] lg:text-sm font-medium leading-tight">{museumData.monthlyGrowth ?? "-"}</div>
              </div>
              {/* Monthly Growth (replaces old premium/free widget) */}
              <div className="hidden lg:block text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <div className="text-lg lg:text-2xl font-bold text-white leading-tight">{museumData.monthlyGrowth ?? "-"}</div>
                <div className="text-white/80 text-[10px] lg:text-sm leading-tight">Monthly Growth</div>
                <div className="text-white/70 text-[10px] lg:text-xs leading-tight">vs last month</div>
              </div>
              {/* Active Experiences */}
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <div className="text-lg lg:text-2xl font-bold text-white leading-tight">{museumData.nb_ArExperience ?? "-"}</div>
                <div className="text-white/80 text-[10px] lg:text-sm leading-tight">Active Experiences</div>
                <div className="text-green-400 text-[10px] lg:text-sm font-medium leading-tight">All Online</div>
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
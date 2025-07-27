
import { useState } from "react";
import { StatsOverview } from "@/components/museum/StatsOverview";
import { MuseumBanner } from "@/components/museum/MuseumBanner";
import { ExperienceManagement } from "@/components/museum/ExperienceManagement";
import { AccessCodeInterface } from "@/components/museum/AccessCodeInterface";
import { MuseumSettings } from "@/components/museum/MuseumSettings";
import { ProfilePage } from "@/components/ProfilePage";

interface MuseumAdminDashboardProps {
  activeSection: string;
  museumId: string;
}

export function MuseumAdminDashboard({ activeSection, museumId }: MuseumAdminDashboardProps) {

  const renderContent = () => {
    switch (activeSection) {
      case "experiences":
        return <ExperienceManagement />;
      case "access-codes":
        return <AccessCodeInterface />;
      case "settings":
        return <MuseumSettings />;
      case "profile":
        return <ProfilePage userRole="museum_admin" />;
      default:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <MuseumBanner museumId={museumId} />
            <StatsOverview />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
}

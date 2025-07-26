
import { GlobalStats } from "@/components/super/GlobalStats";
import { MuseumDirectory } from "@/components/super/MuseumDirectory";
import { AdminManagement } from "@/components/super/AdminManagement";
import { SystemSettings } from "@/components/super/SystemSettings";
import { ProfilePage } from "@/components/ProfilePage";

interface SuperAdminDashboardProps {
  activeSection: string;
}

export function SuperAdminDashboard({ activeSection }: SuperAdminDashboardProps) {
  const renderContent = () => {
    switch (activeSection) {
      case "museums":
        return <MuseumDirectory />;
      case "admins":
        return <AdminManagement />;
      case "settings":
        return <SystemSettings />;
      case "profile":
        return <ProfilePage userRole="super_admin" />;
      default:
        return (
          <div className="space-y-6 animate-fade-in-up">
            <GlobalStats />
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

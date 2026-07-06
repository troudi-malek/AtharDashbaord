import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MuseumAdminDashboard } from "@/components/MuseumAdminDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { DashboardHeader } from "@/components/DashboardHeader";

type UserKind = "Admin" | "SuperAdmin";

const Index = () => {
  const [currentKind, setCurrentKind] = useState<UserKind | "">("");
  const [username, setUsername] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [museumId, setMuseumId] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const parts = token.split(".");
        const payload = parts[1];
        const decodedPayload = JSON.parse(atob(payload));
        setUsername(decodedPayload.username);
        if (decodedPayload.kind === "Admin" || decodedPayload.kind === "SuperAdmin") {
          setCurrentKind(decodedPayload.kind);
        } else {
          console.warn("Unknown kind in token:", decodedPayload.kind);
        }
        // Extract managed museum ID for Admin
        if (decodedPayload.kind === "Admin" && (decodedPayload.museumId || decodedPayload.mangedMuseum)) {
          setMuseumId(decodedPayload.museumId || decodedPayload.mangedMuseum);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const handleRoleSwitch = () => {
    setCurrentKind(currentKind === "Admin" ? "SuperAdmin" : "Admin");
    setActiveSection("dashboard");
  };

  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  const handleLogoutClick = () => {
    console.log("Logging out...");
    alert("Logout functionality would be implemented here");
  };

  if (!currentKind) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar 
            kind={currentKind} 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          
          <main className="flex-1 flex flex-col">
            <DashboardHeader 
              username={username}
              kind={currentKind}
              onProfileClick={handleProfileClick}
            />
            
            <div className="flex-1 p-6">
              {currentKind === "Admin" ? (
                museumId ? (
                  <MuseumAdminDashboard activeSection={activeSection} museumId={museumId} />
                ) : (
                  <div className="text-red-500">No museum assigned to this admin.</div>
                )
              ) : (
                <SuperAdminDashboard activeSection={activeSection} />
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;

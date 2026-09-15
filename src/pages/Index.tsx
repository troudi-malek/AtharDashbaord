import { useEffect, useState } from "react";
import axios from "axios";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MuseumAdminDashboard } from "@/components/MuseumAdminDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { DashboardHeader } from "@/components/DashboardHeader";

const API_URL = import.meta.env.VITE_API_URL; // adjust to however you currently define this

const getTokenFromCookies = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

type UserKind = "Admin" | "SuperAdmin";

const Index = () => {
  const [currentKind, setCurrentKind] = useState<UserKind | "">("");
  const [username, setUsername] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [museumId, setMuseumId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenFromCookies();

    axios
      .get(`${API_URL}admin/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      .then(({ data }) => {
        setUsername(data.username);
        if (data.kind === "Admin" || data.kind === "SuperAdmin") {
          setCurrentKind(data.kind);
        } else {
          setAuthError("Unrecognized account type.");
        }
        if (data.kind === "Admin" && data.museumId) {
          setMuseumId(data.museumId);
        }
      })
      .catch((err) => {
        console.error("Failed to verify session:", err);
        window.location.href = "/login";
      });
  }, []);

  const handleProfileClick = () => {
    setActiveSection("profile");
  };

  if (authError) {
    return <div className="p-6 text-red-500">{authError}</div>;
  }

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
              username={username ?? ""}
              kind={currentKind}
              onProfileClick={handleProfileClick}
              onKindSwitch={function (): void {
                throw new Error("Function not implemented.");
              }}
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
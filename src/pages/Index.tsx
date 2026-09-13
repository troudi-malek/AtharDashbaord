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
  const [museumId] = useState<string | null>(null);
const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
  const token = Cookies.get("token");
  if (!token) {
    console.warn("No token cookie found");
    setAuthError("no-token");
    return;
  }
  try {
    const parts = token.split(".");
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log("Decoded payload:", decodedPayload); // <-- check this in console
    setUsername(decodedPayload.username);
    if (decodedPayload.kind === "Admin" || decodedPayload.kind === "SuperAdmin") {
      setCurrentKind(decodedPayload.kind);
    } else {
      console.warn("Unknown kind in token:", decodedPayload.kind);
      setAuthError("bad-kind");
    }
  } catch (err) {
    console.error("Failed to decode token:", err);
    setAuthError("decode-failed");
  }
}, []);

if (authError) {
  return <div>Auth error: {authError} — check console.</div>;
}
if (!currentKind) {
  return <div>Loading...</div>;
}


  const handleProfileClick = () => {
    setActiveSection("profile");
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
              username={username ?? ""}
              kind={currentKind}
              onProfileClick={handleProfileClick} onKindSwitch={function (): void {
                throw new Error("Function not implemented.");
              } }            />
            
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

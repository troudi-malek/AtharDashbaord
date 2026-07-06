import { 
  BarChart3, 
  Building2, 
  Crown, 
  Image, 
  Key, 
  Settings, 
  Shield, 
  Users,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect } from "react";

interface AppSidebarProps {
  kind: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const adminItems = [
  { id: "dashboard", title: "Dashboard", icon: BarChart3 },
  { id: "experiences", title: "Experiences", icon: Image },
  { id: "access-codes", title: "Access Codes", icon: Key },
  { id: "settings", title: "Museum Settings", icon: Settings },
  { id: "profile", title: "Profile", icon: User },
];

const superAdminItems = [
  { id: "dashboard", title: "Global Dashboard", icon: BarChart3 },
  { id: "museums", title: "Museums", icon: Building2 },
  { id: "admins", title: "Admin Management", icon: Users },
  { id: "profile", title: "Profile", icon: User },
];

export function AppSidebar({ kind, activeSection, onSectionChange }: AppSidebarProps) {
  const items = kind === "SuperAdmin" ? superAdminItems : adminItems;
  const { setOpen } = useSidebar();
  console.log(kind +"inside app")
console.log(items)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setOpen]);
  return (
    <Sidebar className="border-r border-slate-200 bg-slate-900">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              {kind === "SuperAdmin" ? (
              <Crown className="w-5 h-5 text-slate-900" />
            ) : (
              <Building2 className="w-5 h-5 text-slate-900" />
            )}
            </div>
            <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">MuseumFlow</h2>
            <p className="text-xs text-sidebar-muted-foreground">
              {kind === "SuperAdmin" ? "Super Admin" : "Museum Admin"}
              </p>
            </div>
          </div>
          {/* Toggle button removed; controlled from header */}
        </div>
      </SidebarHeader>


      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel className="text-sidebar-muted-foreground text-xs uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    className={`
                      w-full justify-start gap-3 p-3 rounded-lg transition-all duration-200
                      ${activeSection === item.id 
                         ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-lg" 
                        : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

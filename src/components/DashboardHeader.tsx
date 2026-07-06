
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";


interface DashboardHeaderProps {
  kind: string; // Renamed from currentRole
  onKindSwitch: () => void;                    // Renamed from onRoleSwitch
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
  username: string;
}

export function DashboardHeader({ kind, onProfileClick, username }: DashboardHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Sidebar menu button (visible at all sizes) */}
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-slate-900">
            {kind === "super_admin" ? "Global Dashboard" : "Museum Dashboard"}
          </h1>
          <Badge 
            variant="secondary" 
            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
          >
            {kind === "super_admin" ? "Super Admin" : "Museum Admin"}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          {/* Demo Kind Switch Button */}


          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-900" />
                </div>
                <span className="text-sm font-medium text-slate-700">{username}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border-border z-50">
              <DropdownMenuItem 
                onClick={() => onProfileClick?.()}
                className="cursor-pointer hover:bg-muted"
              >
                <User className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() =>{
                  Cookies.remove('token');
                  navigate('/login')
                }}
                className="text-destructive cursor-pointer hover:bg-muted focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

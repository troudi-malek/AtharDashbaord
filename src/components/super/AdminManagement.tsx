
import { useState, useEffect } from "react";
import { Plus, Edit, Shield, ShieldCheck, Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GetAllUser, CreateAdmin } from '@/services/SuperAdmin/userManagementService';
import { GetMuseums } from '@/services/SuperAdmin/museumsService';

const museums = [
  "Metropolitan Museum of Art",
  "Louvre Museum", 
  "British Museum",
  "Science Discovery Center",
  "National Museum of Tunisia",
  "Bardo Museum"
];

export function AdminManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    museum: ""
  });
  const [admins, setAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [allMuseums, setAllMuseums] = useState<any[]>([]);
  const [loadingMuseums, setLoadingMuseums] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      const data = await GetAllUser();
      setAdmins(Array.isArray(data) ? data : []);
      setLoadingAdmins(false);
    };
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (showCreateForm) {
      setLoadingMuseums(true);
      GetMuseums().then((data) => {
        setAllMuseums(Array.isArray(data) ? data : []);
        setLoadingMuseums(false);
      });
    }
  }, [showCreateForm]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAdmin = async () => {
    setCreateError(null);
    setCreating(true);
    try {
      // You may want to add validation here
      const result = await CreateAdmin(
        formData.name,
        formData.email,
        formData.password,
        formData.museum
      );
      if (result) {
        setShowCreateForm(false);
        setFormData({ name: "", email: "", password: "", confirmPassword: "", museum: "" });
        // Refresh the admin list
        const data = await GetAllUser();
        setAdmins(Array.isArray(data) ? data : []);
      } else {
        setCreateError('Failed to create admin. Please try again.');
      }
    } catch (error: any) {
      setCreateError(error?.message || 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Admin Management</h2>
          <p className="text-muted-foreground mt-1">Manage system administrators and permissions</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {showCreateForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create New Admin
            </>
          )}
        </Button>
      </div>

      {/* Inline Create Admin Form */}
      {showCreateForm && (
        <Card className="border-2 border-primary/20 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Create New Administrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className="border-input bg-background"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter password"
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                  className="border-input bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="museum" className="text-foreground">Assign Museum</Label>
              <Select value={formData.museum} onValueChange={(value) => handleInputChange("museum", value)}>
                <SelectTrigger className="border-input bg-background">
                  <SelectValue placeholder={loadingMuseums ? "Loading museums..." : "Select a museum to assign"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingMuseums ? (
                    <div className="px-4 py-2 text-muted-foreground">Loading...</div>
                  ) : allMuseums.length === 0 ? (
                    <div className="px-4 py-2 text-muted-foreground">No museums found</div>
                  ) : allMuseums.map((museum) => (
                    <SelectItem key={museum._id || museum.id} value={museum._id || museum.id}>
                      {museum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSaveAdmin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={creating}
              >
                {creating ? 'Saving...' : 'Save Admin'}
              </Button>
              {createError && (
                <div className="text-destructive text-sm pt-2">{createError}</div>
              )}
              <Button 
                variant="outline" 
                onClick={() => setShowCreateForm(false)}
                className="border-border"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loadingAdmins ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">No admins found.</div>
        ) : admins.map((admin: any, index: number) => (
          <Card 
            key={admin._id || admin.id || index}
            className="hover:shadow-lg transition-all duration-300 animate-slide-in-right border bg-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    {admin.role === "SuperAdmin" ? (
                      <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{admin.name || admin.username}</h3>
                    <p className="text-muted-foreground text-sm">{admin.email}</p>
                    {admin.phone && <p className="text-muted-foreground text-sm">{admin.phone}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={admin.role === "SuperAdmin" ? "default" : "secondary"}
                        className={admin.role === "SuperAdmin" ? "bg-primary/10 text-primary" : ""}
                      >
                        {admin.role}
                      </Badge>
                      {admin.lastLogin && (
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Clock className="w-3 h-3" />
                          {admin.lastLogin}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">Assigned Museum</div>
                    <div className="text-xs text-muted-foreground">
                {admin.museumName}
                    </div>
                    <Badge 
                      variant={admin.status === "active" ? "default" : "secondary"}
                      className={`mt-1 ${admin.status === "active" ? "bg-green-100 text-green-800" : ""}`}
                    >
                      {admin.status}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={admin.status === "active" ? "text-destructive hover:text-destructive/90" : "text-green-600 hover:text-green-700"}
                    >
                      {admin.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

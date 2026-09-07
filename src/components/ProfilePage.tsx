import { useEffect, useState } from "react";
import { User, Mail, Shield, Building2, Edit, Camera, Save, X, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetProfile } from "@/services/profileService";

interface ProfilePageProps {
  userRole: "museum_admin" | "super_admin";
}

const profileData = {
  museum_admin: {
    name: "Sarah Johnson",
    email: "sarah@metmuseum.org",
    role: "Museum Administrator",
    assignedMuseums: ["Metropolitan Museum of Art"],
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b589?w=150&h=150&fit=crop&crop=face",
    joinDate: "March 2023",
    phone: "+1 (555) 123-4567"
  },
  super_admin: {
    name: "Michael Chen",
    email: "michael@system.admin",
    role: "Super Administrator",
    assignedMuseums: ["All Museums"],
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "January 2023",
    phone: "+1 (555) 987-6543"
  }
};

export function ProfilePage({ userRole }: ProfilePageProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: profileData[userRole].name,
    email: profileData[userRole].email,
    role: profileData[userRole].role,
    assignedMuseums: profileData[userRole].assignedMuseums,
    profileImage: profileData[userRole].profileImage,
    joinDate: profileData[userRole].joinDate,
    phone: profileData[userRole].phone
  });
  const [profileFormData, setProfileFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileErrors, setProfileErrors] = useState({
    name: false,
    email: false,
    phone: false
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  // Add image upload state
  const [, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await GetProfile();
        const d = resp?.data;
        if (d) {
          const mapped = {
            name: d.fullName || profile.name,
            email: d.email || profile.email,
            role: d.role || profile.role,
            assignedMuseums: Array.isArray(d.assignedMuseums) ? d.assignedMuseums : profile.assignedMuseums,
            profileImage: profile.profileImage,
            joinDate: d.memberSince ? new Date(d.memberSince).toLocaleString(undefined, { year: 'numeric', month: 'long' }) : profile.joinDate,
            phone: d.phoneNumber ?? profile.phone,
            passwordLastUpdated: d.passwordLastUpdated
          } as any;
          setProfile(mapped);
          setProfileFormData({
            name: mapped.name,
            email: mapped.email,
            phone: mapped.phone
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (profileErrors[field as keyof typeof profileErrors]) {
      setProfileErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (passwordErrors[field as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSaveProfile = () => {
    // Validate required fields
    const errors = {
      name: !profileFormData.name.trim(),
      email: !profileFormData.email.trim() || !/\S+@\S+\.\S+/.test(profileFormData.email),
      phone: !profileFormData.phone.trim()
    };
    
    setProfileErrors(errors);
    
    // If no errors, save the profile
    if (!Object.values(errors).some(error => error)) {
      console.log("Saving profile:", profileFormData);
      setIsEditingProfile(false);
    }
  };

  const handleSavePassword = () => {
    // Validate password fields
    const errors = {
      currentPassword: !passwordFormData.currentPassword.trim(),
      newPassword: !passwordFormData.newPassword.trim() || passwordFormData.newPassword.length < 6,
      confirmPassword: passwordFormData.newPassword !== passwordFormData.confirmPassword
    };
    
    setPasswordErrors(errors);
    
    // If no errors, save the password
    if (!Object.values(errors).some(error => error)) {
      console.log("Updating password");
      setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsEditingPassword(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone
    });
    setProfileErrors({ name: false, email: false, phone: false });
    setIsEditingProfile(false);
  };

  const handleCancelPassword = () => {
    setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordErrors({ currentPassword: false, newPassword: false, confirmPassword: false });
    setIsEditingPassword(false);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Optionally update preview immediately
      setProfile(prev => ({
        ...prev,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div className="text-center mb-2">
        <h2 className="text-4xl font-bold text-foreground mb-2">Profile</h2>
        <p className="text-muted-foreground text-lg">Manage your account settings and preferences</p>
        <div className="flex justify-center mt-4">
          <div className="w-24 h-1 bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img 
                  src={profile.profileImage} 
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
                <Button 
                  size="sm" 
                  className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <label htmlFor="profile-image-upload" className="cursor-pointer flex items-center">
                    <Camera className="w-4 h-4" />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </Button>
              </div>
              <Badge 
                variant={userRole === "super_admin" ? "default" : "secondary"}
                className={userRole === "super_admin" ? "bg-primary/10 text-primary" : ""}
              >
                {profile.role}
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Role</div>
                      <div className="text-sm text-muted-foreground">{profile.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-sm text-muted-foreground">{profile.email}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Assigned Museums</div>
                      <div className="text-sm text-muted-foreground">
                        {profile.assignedMuseums.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">Member Since</div>
                      <div className="text-sm text-muted-foreground">{profile.joinDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information Section */}
      <Card className="border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
            {!isEditingProfile && (
              <Button 
                onClick={() => setIsEditingProfile(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="profileName" 
                    className={`text-foreground ${profileErrors.name ? 'label-error' : ''}`}
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="profileName"
                    value={profileFormData.name}
                    onChange={(e) => handleProfileInputChange("name", e.target.value)}
                    className={`border-input bg-background ${profileErrors.name ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                    required
                  />
                  {profileErrors.name && (
                    <p className="text-xs text-destructive">Full name is required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="profileEmail" 
                    className={`text-foreground ${profileErrors.email ? 'label-error' : ''}`}
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="profileEmail"
                    type="email"
                    value={profileFormData.email}
                    onChange={(e) => handleProfileInputChange("email", e.target.value)}
                    className={`border-input bg-background ${profileErrors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email address"
                    required
                  />
                  {profileErrors.email && (
                    <p className="text-xs text-destructive">
                      {profileFormData.email ? "Please enter a valid email address" : "Email is required"}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="profilePhone" 
                  className={`text-foreground ${profileErrors.phone ? 'label-error' : ''}`}
                >
                  Phone Number *
                </Label>
                <Input
                  id="profilePhone"
                  type="tel"
                  value={profileFormData.phone}
                  onChange={(e) => handleProfileInputChange("phone", e.target.value)}
                  className={`border-input bg-background ${profileErrors.phone ? 'input-error' : ''}`}
                  placeholder="Enter your phone number"
                  required
                />
                {profileErrors.phone && (
                  <p className="text-xs text-destructive">Phone number is required</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelProfile}
                  className="border-border"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-sm">Full Name</Label>
                  <p className="text-foreground font-medium">{profile.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Email Address</Label>
                  <p className="text-foreground font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-sm">Phone Number</Label>
                  <p className="text-foreground font-medium">{profile.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Account Type</Label>
                  <p className="text-foreground font-medium">{profile.role}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Security Section */}
      <Card className="border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Password & Security
            </CardTitle>
            {!isEditingPassword && (
              <Button 
                onClick={() => setIsEditingPassword(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingPassword ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="currentPassword" 
                    className={`text-foreground ${passwordErrors.currentPassword ? 'label-error' : ''}`}
                  >
                    Current Password *
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordFormData.currentPassword}
                    onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    className={`border-input bg-background ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                    required
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-destructive">Current password is required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="newPassword" 
                    className={`text-foreground ${passwordErrors.newPassword ? 'label-error' : ''}`}
                  >
                    New Password *
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordFormData.newPassword}
                    onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                    className={`border-input bg-background ${passwordErrors.newPassword ? 'input-error' : ''}`}
                    required
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-destructive">
                      {passwordFormData.newPassword ? "Password must be at least 6 characters" : "New password is required"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor="confirmPassword" 
                    className={`text-foreground ${passwordErrors.confirmPassword ? 'label-error' : ''}`}
                  >
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className={`border-input bg-background ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                    required
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-destructive">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSavePassword}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelPassword}
                  className="border-border"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Password</div>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {profile.joinDate}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                For security reasons, we recommend updating your password regularly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Museum-themed decorative element */}
      <div className="flex justify-center pt-8">
        <div className="opacity-10">
          <svg width="200" height="60" viewBox="0 0 200 60" className="text-foreground">
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
    </div>
  );
}
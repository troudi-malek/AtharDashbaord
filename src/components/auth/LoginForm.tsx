import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Login } from '@/services/authenticationService';
import { useNavigate } from 'react-router-dom';
import museumBg from '@/assets/jamil-kabar-JrnrB3HgETc-unsplash.jpg';
import Logo from '@/assets/ATHAR.png';

//

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const fillDemo = (role: "admin" | "superadmin") => {
  if (role === "superadmin") {
    setFormData({
      email: "superadmin@athar-demo.com",
      password: "Demo123!",
      rememberMe: true,
    });
  } else {
    setFormData({
      email: "admin@athar-demo.com",
      password: "Demo123!",
      rememberMe: true,
    });
  }
};
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const result = await Login(formData.email, formData.password);

    console.log("LOGIN RESULT:", result);
    console.log("TOKEN AFTER LOGIN:", localStorage.getItem("token"));

    if (!result) {
      console.log("LOGIN FAILED - NO RESULT");
      setErrors({ general: 'Invalid email or password.' });
      return;
    }

    console.log("LOGIN SUCCESS - NAVIGATING");
    navigate('/');
    console.log("LOGIN SUCCESS - NAVIGATING");

navigate("/admin/dashboard");

setTimeout(() => {
    console.log("AFTER NAVIGATION:", window.location.href);
    console.log("TOKEN:", localStorage.getItem("token"));
}, 500);
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    const message =
      error?.response?.data?.message || 'Invalid email or password.';

    setErrors({ general: message, email: '', password: '' });
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Full Museum Gallery Background */}
      <div className="w-1/2 relative overflow-hidden hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${museumBg})` }}
        />
        {/* Dark gradient overlay from left for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-tunisian-sand/20 via-primary/10 to-accent/20" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center text-white max-w-sm">
            <div className="flex justify-center items-center">
              <div
                className="w-96 h-24 bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${Logo})`,
                  backgroundSize: 'contain',
                }}
              ></div>
            </div>

            <h2 className="text-3xl font-bold mb-3 font-poppins">Museum Heritage</h2>
            <p className="text-lg italic opacity-90 leading-relaxed">"Preserving Tunisia's cultural treasures"</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-tunisian-sand/20 via-background to-tunisian-ochre/15 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md glass-card border-0 shadow-2xl relative">
          {/* Decorative zellige pattern border */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-accent via-primary to-secondary rounded-full opacity-60" />

          <CardHeader className="text-center pb-6 pt-8">
            {/* Cultural Logo */}
            

            <h1 className="text-3xl font-bold text-foreground mb-2 font-poppins field-reveal">
              Bienvenue
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed field-reveal-delay-1">
              "مرحباً بك في عالم التراث"
            </p>
            <p className="text-muted-foreground text-xs mt-1 field-reveal-delay-2">
              Enter your curator credentials
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3 field-reveal-delay-1">
                <Label htmlFor="email" className="text-foreground text-sm font-medium font-poppins">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl font-poppins focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="curator@museum.tn"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3 field-reveal-delay-2">
                <Label htmlFor="password" className="text-foreground text-sm font-medium font-poppins">
                  Vault Key
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl font-poppins focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="Enter your vault key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2 field-reveal-delay-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="rememberMe" className="text-muted-foreground text-sm font-poppins">
                    Remember this curator
                  </Label>
                </div>
                <a
                  href="/reset-password"
                  className="text-sm text-accent hover:text-accent/80 underline-offset-4 hover:underline transition-all font-poppins"
                >
                  Lost your key?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-secondary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 font-poppins mt-8 field-reveal-delay-2"
              >
                <Leaf className="w-5 h-5 mr-2" />
                {isLoading ? 'Entering...' : 'Enter the Museum'}
              </Button>

              {errors.general && (
                <p className="text-xs text-destructive text-center mt-2">{errors.general}</p>
              )}

              {/* Cultural Quote */}
              <div className="text-center pt-6 border-t border-border/30 field-reveal-delay-3">
                <p className="text-muted-foreground text-xs italic font-poppins">
                  "كل قطعة أثرية تحكي قصة، كل قصة تحفظ التاريخ"
                </p>
                <p className="text-muted-foreground text-xs mt-1 font-poppins">
                  "Every artifact tells a story, every story preserves history"
                </p>
              </div>
            </form>
          
          </CardContent>
          <div className="mb-6 p-4 rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm">
  <p className="text-sm font-medium text-foreground mb-3 font-poppins">
    Demo Accounts (for recruiters)
  </p>

  <div className="space-y-2 text-xs text-muted-foreground mb-3">
    <div>
      <span className="font-semibold">Super Admin:</span> superadmin@athar-demo.com / Demo123!
    </div>
    <div>
      <span className="font-semibold">Admin:</span> admin@athar-demo.com / Demo123!
    </div>
  </div>

  <div className="flex gap-2">
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={() => fillDemo("superadmin")}
      className="text-xs flex-1"
    >
      Login as Super Admin
    </Button>

    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={() => fillDemo("admin")}
      className="text-xs flex-1"
    >
      Login as Admin
    </Button>
  </div>
</div>
        </Card>
      </div>
    </div>
  );
};
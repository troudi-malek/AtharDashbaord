import React, { useState, useContext, createContext } from 'react';
import { Eye, EyeOff, Mail, Lock, Building2, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Login } from '@/services/authenticationService';
import { useNavigate } from 'react-router-dom';
import museumBg from '@/assets/jamil-kabar-JrnrB3HgETc-unsplash.jpg';
import Logo from '@/assets/ATHAR.png';

const MuseumColumnSVG = () => (
  <svg viewBox="0 0 200 300" className="absolute top-10 left-10 w-16 h-24 opacity-5 text-foreground">
    <path d="M20 280 L20 40 L180 40 L180 280" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="30" y="50" width="20" height="220" fill="currentColor" opacity="0.3" />
    <rect x="60" y="50" width="20" height="220" fill="currentColor" opacity="0.3" />
    <rect x="90" y="50" width="20" height="220" fill="currentColor" opacity="0.3" />
    <rect x="120" y="50" width="20" height="220" fill="currentColor" opacity="0.3" />
    <rect x="150" y="50" width="20" height="220" fill="currentColor" opacity="0.3" />
    <path d="M10 40 L190 40 L100 10 Z" fill="currentColor" opacity="0.2" />
    <rect x="10" y="280" width="180" height="10" fill="currentColor" opacity="0.2" />
  </svg>
);

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Login(formData.email, formData.password)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
    console.log('Login attempt:', formData);
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
          <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Logo})` }}
        />
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
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2 font-poppins field-reveal">
              Bienvenue, Curator
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
                className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-poppins mt-8 field-reveal-delay-3"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Enter the Museum
              </Button>

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
        </Card>
      </div>
    </div>
  );
};
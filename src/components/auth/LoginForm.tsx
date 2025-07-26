import React, { useState,useContext, createContext } from 'react';
import { Eye, EyeOff, Mail, Lock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Login } from '@/services/authenticationService';
import { useNavigate } from 'react-router-dom';


const MuseumColumnSVG = () => (
  <svg viewBox="0 0 200 300" className="absolute top-10 left-10 w-16 h-24 opacity-5 text-foreground">
    <path d="M20 280 L20 40 L180 40 L180 280" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="30" y="50" width="20" height="220" fill="currentColor" opacity="0.3"/>
    <rect x="60" y="50" width="20" height="220" fill="currentColor" opacity="0.3"/>
    <rect x="90" y="50" width="20" height="220" fill="currentColor" opacity="0.3"/>
    <rect x="120" y="50" width="20" height="220" fill="currentColor" opacity="0.3"/>
    <rect x="150" y="50" width="20" height="220" fill="currentColor" opacity="0.3"/>
    <path d="M10 40 L190 40 L100 10 Z" fill="currentColor" opacity="0.2"/>
    <rect x="10" y="280" width="180" height="10" fill="currentColor" opacity="0.2"/>
  </svg>
);

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate= useNavigate();
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

  const handleSubmit = async(e: React.FormEvent) => {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <MuseumColumnSVG />
      <div className="absolute bottom-10 right-10 opacity-5">
        <MuseumColumnSVG />
      </div>
      
      <Card className="w-full max-w-md bg-card border border-border shadow-lg relative">
        <CardHeader className="text-center pb-6">
          {/* Museum Logo */}
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Museum Admin</h1>
          <p className="text-muted-foreground">Sign in to your dashboard</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email or Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11 bg-background border-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-11 bg-background border-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                  Remember me
                </Label>
              </div>
              <a
                href="/reset-password"
                className="text-sm text-primary hover:underline underline-offset-4 transition-all"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Sign In
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const FloorplanSVG = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full opacity-5 text-foreground">
    <rect x="20" y="20" width="260" height="160" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="40" y="40" width="60" height="40" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.1"/>
    <rect x="120" y="40" width="60" height="40" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.1"/>
    <rect x="200" y="40" width="60" height="40" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.1"/>
    <rect x="40" y="100" width="80" height="60" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.1"/>
    <rect x="140" y="100" width="80" height="60" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.1"/>
    <circle cx="70" cy="120" r="8" stroke="currentColor" strokeWidth="1" fill="none"/>
    <circle cx="180" cy="120" r="8" stroke="currentColor" strokeWidth="1" fill="none"/>
    <path d="M20 100 L40 100 M280 100 L260 100" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const ResetPasswordForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset request for:', formData.email);
    // Simulate API call
    setTimeout(() => setStep(2), 1000);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New password set:', formData.password);
  };

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background floorplan watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-64">
          <FloorplanSVG />
        </div>
      </div>
      
      <Card className="w-full max-w-md bg-card border border-border shadow-lg relative z-10">
        <CardHeader className="text-center pb-6">
          {/* Museum Logo */}
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground">
            {step === 1 ? 'Enter your email to receive reset instructions' : 'Create your new password'}
          </p>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-sm ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                Email
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className={`text-sm ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                New Password
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
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
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We'll send password reset instructions to this email.
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                Send Reset Instructions
              </Button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <button className="text-sm text-primary hover:underline underline-offset-4 transition-all">
                  ← Back to login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
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
                    placeholder="Enter new password"
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 h-11 bg-background border-input ${
                      formData.confirmPassword && !passwordsMatch ? 'border-destructive' : ''
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive">Passwords don't match</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                disabled={!passwordsMatch || formData.password.length < 6}
              >
                Reset Password
              </Button>

              {/* Success message placeholder */}
              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  Your password will be updated and you'll be redirected to login.
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
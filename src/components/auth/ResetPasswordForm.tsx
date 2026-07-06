import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Key, Sparkles, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import museumBg from '@/assets/museum-gallery-bg.jpg';
import { requestPasswordReset, verifyPasswordResetCode, resetPassword } from '@/services/authenticationService';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/ATHAR.png';
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-center mb-8">
    <div className="flex items-center space-x-3">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-xs transition-all ${
        currentStep >= 1 ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
      }`}>
        1
      </div>
      <div className={`w-8 h-0.5 rounded-full transition-all ${
        currentStep >= 2 ? 'bg-primary' : 'bg-muted'
      }`} />
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-xs transition-all ${
        currentStep >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
      }`}>
        2
      </div>
      <div className={`w-8 h-0.5 rounded-full transition-all ${
        currentStep >= 3 ? 'bg-primary' : 'bg-muted'
      }`} />
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-xs transition-all ${
        currentStep >= 3 ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground'
      }`}>
        3
      </div>
    </div>
  </div>
);

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; code?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name === 'verificationCode' ? 'code' : name]: undefined, general: undefined }));
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(formData.email);
      setCurrentStep(2);
    } catch (error) {
      setErrors(prev => ({ ...prev, email: 'Failed to send code. Please check the email and try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyPasswordResetCode(formData.email, formData.verificationCode);
      setCurrentStep(3);
    } catch (error) {
      setErrors(prev => ({ ...prev, code: 'Invalid or expired code. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(formData.email, formData.verificationCode, formData.password);
      setErrors({});
      navigate('/login');
    } catch (error) {
      setErrors(prev => ({ ...prev, password: 'Could not reset password. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await requestPasswordReset(formData.email);
    } catch (error) {
      setErrors(prev => ({ ...prev, email: 'Failed to resend code. Try again later.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const passwordValid = formData.password.length >= 8;

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
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/20" />
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
            <h2 className="text-3xl font-bold mb-3 font-poppins">Vault Recovery</h2>
            <p className="text-lg italic opacity-90 leading-relaxed">"Restoring access to cultural heritage"</p>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Reset Form */}
      <div className="flex-1 lg:w-1/2 bg-gradient-to-br from-tunisian-sand/20 via-background to-tunisian-ochre/15 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md glass-card border-0 shadow-2xl relative">
          {/* Decorative border */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-secondary via-accent to-primary rounded-full opacity-60" />
          
          <CardHeader className="text-center pb-6 pt-8">
            {/* Cultural Logo */}
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center shadow-xl">
              <Key className="w-10 h-10 text-white" />
            </div>
            
            <StepIndicator currentStep={currentStep} />
            
            <h1 className="text-3xl font-bold text-foreground mb-2 font-poppins field-reveal">
              {currentStep === 1 ? "Forgot Your Key?" : currentStep === 2 ? "Enter Verification Code" : "Set New Vault Key"}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed field-reveal-delay-1">
              {currentStep === 1 
                ? "لا تقلق، سنساعدك في استعادة الوصول" 
                : currentStep === 2 
                ? "أدخل الرمز المرسل إلى بريدك الإلكتروني"
                : "اختر مفتاحاً جديداً آمناً للخزانة"
              }
            </p>
            <p className="text-muted-foreground text-xs mt-1 field-reveal-delay-2">
              {currentStep === 1 
                ? "Enter your curator email to receive reset instructions"
                : currentStep === 2
                ? "We sent a 6-digit code to your email address"
                : "Create a strong password for your account"
              }
            </p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {currentStep === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3 field-reveal-delay-1">
                  <Label htmlFor="email" className="text-foreground text-sm font-medium font-poppins">
                    Curator Email
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

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-secondary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 font-poppins mt-8 field-reveal-delay-2"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <a
                    href="/login"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80 underline-offset-4 hover:underline transition-all font-poppins"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Museum Entrance
                  </a>
                </div>
              </form>
            ) : currentStep === 2 ? (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                {/* Verification Code Field */}
                <div className="space-y-3 field-reveal-delay-1">
                  <Label htmlFor="verificationCode" className="text-foreground text-sm font-medium font-poppins">
                    Verification Code
                  </Label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl font-poppins focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                  {errors.code && (
                    <p className="text-xs text-destructive">{errors.code}</p>
                  )}
                </div>

                {/* Resend Code */}
                <div className="text-center field-reveal-delay-2">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80 underline-offset-4 hover:underline transition-all font-poppins disabled:opacity-50"
                  >
                    <Leaf className="w-4 h-4 mr-2" />
                    Didn't receive the code? Resend
                  </button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || formData.verificationCode.length !== 6}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 font-poppins mt-8 field-reveal-delay-2"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-2" />
                      Verify Code
                    </>
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <a
                    href="/login"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80 underline-offset-4 hover:underline transition-all font-poppins"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Museum Entrance
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStep3Submit} className="space-y-6">
                {/* New Password Field */}
                <div className="space-y-3 field-reveal-delay-1">
                  <Label htmlFor="password" className="text-foreground text-sm font-medium font-poppins">
                    New Vault Key
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-12 pr-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl font-poppins focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                        passwordValid ? 'input-success' : formData.password.length > 0 ? 'input-warning' : ''
                      }`}
                      placeholder="Enter your new vault key"
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
                  {formData.password.length > 0 && (
                    <p className={`text-xs ${passwordValid ? 'text-success' : 'text-warning'}`}>
                      {passwordValid ? '✓ Strong vault key' : '⚠ Vault key must be at least 8 characters'}
                    </p>
                  )}
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3 field-reveal-delay-2">
                  <Label htmlFor="confirmPassword" className="text-foreground text-sm font-medium font-poppins">
                    Confirm Vault Key
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-12 pr-12 h-12 bg-background/50 backdrop-blur-sm border-border/50 rounded-xl font-poppins focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${
                        formData.confirmPassword.length > 0 ? (passwordsMatch ? 'input-success' : 'input-error') : ''
                      }`}
                      placeholder="Confirm your vault key"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword.length > 0 && (
                    <p className={`text-xs ${passwordsMatch ? 'text-success' : 'text-destructive'}`}>
                      {passwordsMatch ? '✓ Vault keys match' : '✗ Vault keys do not match'}
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={isLoading || !passwordsMatch || !passwordValid}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 font-poppins mt-8 field-reveal-delay-3"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Securing Vault...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-2" />
                      Reset My Key
                    </>
                  )}
                </Button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <a
                    href="/login"
                    className="inline-flex items-center text-sm text-accent hover:text-accent/80 underline-offset-4 hover:underline transition-all font-poppins"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Museum Entrance
                  </a>
                </div>
              </form>
            )}
            
            {/* Cultural Quote */}
            <div className="text-center pt-6 border-t border-border/30 field-reveal-delay-3">
              <p className="text-muted-foreground text-xs italic font-poppins">
                "الأمان أساس الحفاظ على التراث"
              </p>
              <p className="text-muted-foreground text-xs mt-1 font-poppins">
                "Security is the foundation of heritage preservation"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
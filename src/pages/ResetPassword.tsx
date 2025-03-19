
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/store/authStore";
import { mockMembers } from "@/lib/mockData";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [otp, setOtp] = useState("");
  const [storedOtp, setStoredOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [formStep, setFormStep] = useState(0);
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get stored OTP from session storage
    const resetOtp = sessionStorage.getItem("resetOtp");
    const resetUserId = sessionStorage.getItem("resetUserId");
    
    if (!resetOtp || !resetUserId) {
      toast({
        title: "Session Expired",
        description: "Your password reset session has expired. Please try again.",
        variant: "destructive",
      });
      navigate("/forgot-password");
      return;
    }
    
    setStoredOtp(resetOtp);
    setUserId(resetUserId);
  }, [navigate, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Verify OTP
  const verifyOtp = () => {
    if (otp.length !== 6) {
      setErrors({ otp: "Please enter a complete 6-digit code" });
      return;
    }
    
    if (otp !== storedOtp) {
      setErrors({ otp: "Invalid verification code" });
      return;
    }
    
    // OTP verified, move to password reset
    setFormStep(1);
    setErrors({});
  };

  // Handle password reset form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    
    // If no errors, reset password
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call with mock data
      setTimeout(() => {
        // Find user by ID
        const user = mockMembers.find(member => member.id === userId);
        
        if (user) {
          // In a real app, you would update the user's password in the database
          console.log("Password reset for user:", user.name);
          
          toast({
            title: "Password Reset Complete",
            description: "Your password has been successfully reset.",
          });
          
          // Clear session storage
          sessionStorage.removeItem("resetOtp");
          sessionStorage.removeItem("resetUserId");
          
          // Automatically log the user in
          login(user, "dummy-token");
          
          navigate("/dashboard");
        } else {
          toast({
            title: "Error",
            description: "User not found. Please try again.",
            variant: "destructive",
          });
        }
        
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-mkneutral-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900 mb-4">
                Reset Password
              </h1>
              <p className="text-mkneutral-600 max-w-md mx-auto">
                {formStep === 0 
                  ? "Enter the verification code sent to your contact information" 
                  : "Create a new password for your account"}
              </p>
            </div>
            
            <Card className="shadow-glass border-mkneutral-200">
              {formStep === 0 ? (
                <div className="p-6 space-y-6">
                  {/* OTP Input */}
                  <div className="space-y-4">
                    <Label htmlFor="otp">
                      Verification Code <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {errors.otp && (
                      <p className="form-error flex items-center text-xs justify-center">
                        <AlertCircle size={12} className="mr-1" /> {errors.otp}
                      </p>
                    )}
                  </div>
                  
                  {/* Verify OTP Button */}
                  <Button
                    onClick={verifyOtp}
                    className="w-full"
                    disabled={otp.length !== 6}
                  >
                    Verify Code
                  </Button>
                  
                  {/* Back to Forgot Password */}
                  <div className="text-center space-y-2 text-sm text-mkneutral-600">
                    <p>
                      Didn't receive a code? <Link to="/forgot-password" className="text-primary hover:underline">Try again</Link>
                    </p>
                    <p>
                      <Link to="/login" className="text-primary hover:underline flex items-center justify-center">
                        <ArrowLeft size={16} className="mr-1" /> Back to Login
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      New Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${errors.password ? "border-red-500" : ""}`}
                      placeholder="Enter your new password"
                    />
                    {errors.password && (
                      <p className="form-error flex items-center text-xs">
                        <AlertCircle size={12} className="mr-1" /> {errors.password}
                      </p>
                    )}
                  </div>
                  
                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${errors.confirmPassword ? "border-red-500" : ""}`}
                      placeholder="Confirm your new password"
                    />
                    {errors.confirmPassword && (
                      <p className="form-error flex items-center text-xs">
                        <AlertCircle size={12} className="mr-1" /> {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <>
                        <Check size={16} className="mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;

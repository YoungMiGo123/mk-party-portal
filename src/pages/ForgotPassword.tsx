
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { mockMembers } from "@/lib/mockData";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    contactInfo: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.contactInfo) {
      newErrors.contactInfo = "Email or Cellphone is required";
    }
    
    setErrors(newErrors);
    
    // If no errors, attempt to send OTP
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call with mock data
      setTimeout(() => {
        // Find member with matching email/phone
        const foundMember = mockMembers.find(member => 
          member.email === formData.contactInfo || member.cellphone === formData.contactInfo
        );
        
        if (foundMember) {
          // Generate random 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          
          // In a real app, you would send this OTP to the user via email/SMS
          console.log("Generated OTP:", otp);
          
          toast({
            title: "OTP Sent",
            description: "A verification code has been sent to your contact information.",
          });
          
          // Store OTP in session storage for verification on the next page
          // In production, this should be handled securely on the backend
          sessionStorage.setItem("resetOtp", otp);
          sessionStorage.setItem("resetUserId", foundMember.id);
          
          navigate("/reset-password");
        } else {
          // User not found
          toast({
            title: "Account Not Found",
            description: "No account found with this contact information.",
            variant: "destructive",
          });
          
          setErrors({
            contactInfo: "No account found with this contact information.",
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
                Forgot Password
              </h1>
              <p className="text-mkneutral-600 max-w-md mx-auto">
                Enter your email or cellphone to receive a verification code
              </p>
            </div>
            
            <Card className="shadow-glass border-mkneutral-200">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Email or Cellphone */}
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">
                    Email or Cellphone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className={`form-input ${errors.contactInfo ? "border-red-500" : ""}`}
                    placeholder="Enter your email or cellphone"
                  />
                  {errors.contactInfo && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.contactInfo}
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
                    "Send Verification Code"
                  )}
                </Button>
                
                {/* Back to Login */}
                <div className="text-center space-y-2 text-sm text-mkneutral-600">
                  <p>
                    <Link to="/login" className="text-primary hover:underline flex items-center justify-center">
                      <ArrowLeft size={16} className="mr-1" /> Back to Login
                    </Link>
                  </p>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;

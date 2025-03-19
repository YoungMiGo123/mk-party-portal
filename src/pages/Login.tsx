
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/authStore";
import { mockMembers } from "@/lib/mockData";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    idNumber: "",
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
    
    if (!formData.idNumber) {
      newErrors.idNumber = "ID Number is required";
    } else if (formData.idNumber.length !== 13) {
      newErrors.idNumber = "ID Number must be 13 digits";
    }
    
    if (!formData.contactInfo) {
      newErrors.contactInfo = "Email or Cellphone is required";
    }
    
    setErrors(newErrors);
    
    // If no errors, attempt login
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call with mock data
      setTimeout(() => {
        // Find member with matching ID and email/phone
        const foundMember = mockMembers.find(member => 
          member.idNumber === formData.idNumber && 
          (member.email === formData.contactInfo || member.cellphone === formData.contactInfo)
        );
        
        if (foundMember) {
          // Login successful
          login(foundMember, "dummy-token");
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${foundMember.name}!`,
          });
          
          navigate("/dashboard");
        } else {
          // Login failed
          toast({
            title: "Login Failed",
            description: "Invalid ID Number or contact information.",
            variant: "destructive",
          });
          
          setErrors({
            form: "Invalid ID Number or contact information. Please try again.",
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
                Member Login
              </h1>
              <p className="text-mkneutral-600 max-w-md mx-auto">
                Log in to access your MK Party membership account
              </p>
            </div>
            
            <Card className="shadow-glass border-mkneutral-200">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* ID Number */}
                <div className="space-y-2">
                  <Label htmlFor="idNumber">
                    ID Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className={`form-input ${errors.idNumber ? "border-red-500" : ""}`}
                    placeholder="Enter your ID number"
                    maxLength={13}
                  />
                  {errors.idNumber && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.idNumber}
                    </p>
                  )}
                </div>
                
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
                
                {/* Form Error */}
                {errors.form && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={16} />
                      <p>{errors.form}</p>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    "Log In"
                  )}
                </Button>
                
                {/* Help Text */}
                <div className="text-center space-y-2 text-sm text-mkneutral-600">
                  <p>
                    Not a member yet? <Link to="/register" className="text-primary hover:underline">Register here</Link>
                  </p>
                  <p>
                    <Link to="/forgot-password" className="text-primary hover:underline">Forgot your login details?</Link>
                  </p>
                </div>
              </form>
            </Card>
            
            {/* Demo Login */}
            <div className="mt-8 p-4 rounded-md bg-blue-50 border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Login Credentials</h3>
              <p className="text-xs text-blue-700 mb-2">
                For demonstration purposes, you can use any of the following credentials:
              </p>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="flex justify-between">
                  <div><span className="font-medium">ID Number:</span> 8501015800085</div>
                  <div><span className="font-medium">Email:</span> john.doe@example.com</div>
                </div>
                <div className="flex justify-between">
                  <div><span className="font-medium">ID Number:</span> 9203025800085</div>
                  <div><span className="font-medium">Email:</span> sarah.j@example.com</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth, User } from "@/store/authStore";
import { mockMembers } from "@/lib/mockData";
import { usePostLoginRequest } from "@/api/auth/login";
import { usePostSendLoginOTPRequest } from "@/api/auth/sendOtp";
import LoginForm, { devModeUserFakeData } from "@/components/login/LoginForm";
import OTPForm from "@/components/login/OTPForm";
import { useToast } from "@/hooks/use-toast";

enum LoginStep {
  LoginForm,
  OTPForm,
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const sendLoginOTPRequest = usePostSendLoginOTPRequest();
  const loginRequest = usePostLoginRequest();
  const [currentStep, setCurrentStep] = useState<LoginStep>(
    LoginStep.LoginForm
  );
  const [formData, setFormData] = useState({
    idNumber: "",
    contactInfo: "",
  });

  const handleLoginFormSubmission = (data: typeof formData) => {
    setFormData(data);
    sendLoginOTPRequest
      .mutateAsync({ email: data.contactInfo })
      .then((res) => {
        setCurrentStep(LoginStep.OTPForm);
        toast({
          title: "OTP Sent",
          description: "We've sent a verification code to your device",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "An error occurred while sending the OTP.",
          variant: "destructive",
        });
      });
  };

  const handleResendOTP = () => {
    if (sendLoginOTPRequest.isPending) return;
    if (!formData.contactInfo) {
      toast({
        title: "Error",
        description: "An error occurred while sending the OTP.",
        variant: "destructive",
      });
      setCurrentStep(LoginStep.LoginForm);
      return;
    }
    handleLoginFormSubmission({ ...formData });
  };

  const handleOTPFormSubmission = (otp: string) => {
    loginRequest
      .mutateAsync({ email: formData.contactInfo, otpToken: otp })
      .then((res) => {
        const token = res?.data?.token;
        const user = res?.data?.user;
        if (!user || !token?.token) {
          toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive",
          });
          return;
        }

        login(user as User, token.token);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.fullName}!`,
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      });
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

            {currentStep === LoginStep.LoginForm && (
              <LoginForm
                onSubmit={handleLoginFormSubmission}
                isLoading={sendLoginOTPRequest.isPending}
              />
            )}

            {currentStep === LoginStep.OTPForm && (
              <OTPForm
                onBack={() => setCurrentStep(LoginStep.LoginForm)}
                onSubmit={handleOTPFormSubmission}
                onResendOTP={handleResendOTP}
                blockCount={6}
                isLoading={loginRequest.isPending}
                title="Enter Verification Code"
                description="We've sent a code to your device"
              />
            )}

            {/* Demo Login */}
            <div className="mt-8 p-4 rounded-md bg-blue-50 border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Demo Login Credentials
              </h3>
              <p className="text-xs text-blue-700 mb-2">
                For demonstration purposes, you can use any of the following
                credentials:
              </p>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">ID Number:</span>{" "}
                    0001025205087
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    Sukwanamasilakhe1977@gmail.com
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">ID Number:</span>{" "}
                    9203025800085
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    sarah.j@example.com
                  </div>
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

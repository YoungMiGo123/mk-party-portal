import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Bookmark, FileCheck, Check, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/authStore";
import { extractDateFromSAID, extractGenderFromSAID, generateMembershipNumber } from "@/lib/mockData";

// Import step components
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import ContactDetailsStep from "./steps/ContactDetailsStep";
import MembershipDetailsStep from "./steps/MembershipDetailsStep";
import MembershipOathStep from "./steps/MembershipOathStep";
import PaymentStep from "./steps/PaymentStep";
import DevModeToggle from "./DevModeToggle";
import RegistrationSuccess from "./RegistrationSuccess";
import NavigationButtons from "./NavigationButtons";
import ProgressSteps from "./ProgressSteps";
import FormContainer from "./FormContainer";

// Import utility functions and constants
import {
  devModeData,
  initialFormData,
  registrationSteps as steps,
  validatePersonalDetails,
  validateContactDetails,
  validateMembershipDetails,
  validateMembershipOath,
  validatePayment,
  motionVariants,
} from "./registerUtils";

// Step icons for visual representation
const stepIcons = [
  <User size={20} />,
  <Bookmark size={20} />,
  <FileCheck size={20} />,
  <Check size={20} />,
  <CreditCard size={20} />
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isIDValid, setIsIDValid] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [validationEnabled, setValidationEnabled] = useState(true);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [devMode, setDevMode] = useState(true);

  // Handle toggling dev mode
  const toggleDevMode = (enabled: boolean) => {
    setDevMode(enabled);
    setValidationEnabled(enabled);
    
    if (!enabled) {
      setFormData(devModeData);
      setIsIDValid(true);
    } else {
      setFormData({...initialFormData});
      setIsIDValid(false);
    }
  };

  // Handle ID Number validation and auto-populate
  useEffect(() => {
    if (formData.idNumber.length === 13) {
      const extractedDate = extractDateFromSAID(formData.idNumber);
      const extractedGender = extractGenderFromSAID(formData.idNumber);
      
      if (extractedDate && extractedGender) {
        setFormData(prev => ({
          ...prev,
          dateOfBirth: extractedDate,
          gender: extractedGender,
        }));
        setIsIDValid(true);
      } else {
        setIsIDValid(false);
      }
    } else {
      setIsIDValid(false);
    }
  }, [formData.idNumber]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file upload (photo)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhoto(event.target.result as string);
          setFormData(prev => ({ ...prev, photoUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate current step
  const validateStep = () => {
    let newErrors: Record<string, string> = {};
    
    switch (currentStep) {
      case 0:
        newErrors = validatePersonalDetails(formData, validationEnabled);
        break;
      case 1:
        newErrors = validateContactDetails(formData, validationEnabled);
        break;
      case 2:
        newErrors = validateMembershipDetails(formData, validationEnabled);
        break;
      case 3:
        newErrors = validateMembershipOath(formData, validationEnabled);
        break;
      case 4:
        newErrors = validatePayment(formData, validationEnabled);
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      // If we're on the payment step, process the payment
      if (currentStep === steps.length - 1) {
        processPayment();
      } else {
        // Otherwise, just move to the next step
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Process payment
  const processPayment = () => {
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        paymentCompleted: true,
      }));
      
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed. Please complete your registration.",
      });
      
      setIsLoading(false);
    }, 2000);
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep()) {
      handleNext();
    }
  };

  // Handle final registration completion - separate from payment processing
  const handleCompleteRegistration = () => {
    setSubmissionComplete(true);
    
    toast({
      title: "Registration Complete",
      description: "Your membership registration has been completed successfully.",
    });
  };

  // Handle login after payment completion - separate action from form submission
  const handleLoginAfterPayment = () => {
    const membershipNumber = generateMembershipNumber();
    const today = new Date().toISOString().split('T')[0];
    
    login(
      {
        id: Math.random().toString(36).substring(7),
        ...formData,
        membershipNumber,
        joinDate: today,
        name: `${formData.firstName} ${formData.lastName}`,
        surname: formData.lastName,
      },
      "dummy-token"
    );
    
    navigate("/membership-card");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <DevModeToggle devMode={devMode} toggleDevMode={toggleDevMode} />

      {submissionComplete ? (
        <RegistrationSuccess 
          formData={formData}
          handleLoginAfterPayment={handleLoginAfterPayment}
        />
      ) : (
        <>
          <ProgressSteps steps={steps} currentStep={currentStep} stepIcons={stepIcons} />

          <FormContainer>
            <form onSubmit={handleSubmit}>
              {currentStep === 0 && (
                <PersonalDetailsStep
                  formData={formData}
                  errors={errors}
                  isIDValid={isIDValid}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  variants={motionVariants}
                />
              )}

              {currentStep === 1 && (
                <ContactDetailsStep
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  handleCheckboxChange={handleCheckboxChange}
                  variants={motionVariants}
                />
              )}
              
              {currentStep === 2 && (
                <MembershipDetailsStep
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  variants={motionVariants}
                />
              )}
              
              {currentStep === 3 && (
                <MembershipOathStep
                  formData={formData}
                  errors={errors}
                  handleCheckboxChange={handleCheckboxChange}
                  variants={motionVariants}
                />
              )}
              
              {currentStep === 4 && (
                <PaymentStep
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  variants={motionVariants}
                />
              )}
              
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                isLoading={isLoading}
                isPaymentComplete={formData.paymentCompleted}
                handleCompleteRegistration={handleCompleteRegistration}
              />
            </form>
          </FormContainer>
        </>
      )}
    </div>
  );
};

export default RegisterForm;

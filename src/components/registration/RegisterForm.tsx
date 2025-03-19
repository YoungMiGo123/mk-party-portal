
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Upload, AlertCircle, ChevronRight, ChevronLeft, Loader2, ToggleRight, CreditCard, User, Bookmark, FileCheck, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/authStore";
import { extractDateFromSAID, extractGenderFromSAID, generateMembershipNumber, mockOptions } from "@/lib/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Steps in the registration process
const steps = [
  "Personal Details",
  "Contact Details",
  "Membership Details",
  "Membership Oath",
  "Registration Payment",
];

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
  const [formData, setFormData] = useState({
    idNumber: "",
    name: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    race: "",
    language: "",
    nationality: "",
    employmentStatus: "",
    occupation: "",
    disability: "No",
    email: "",
    cellphone: "",
    address: "",
    addressLine2: "",
    postalCode: "",
    province: "",
    municipality: "",
    ward: "",
    votingStation: "",
    emailConfirmation: true,
    membershipType: "Standard",
    acceptTerms: false,
    paymentMethod: "EFT",
    paymentAmount: "100",
    photoUrl: "",
    paymentCompleted: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isIDValid, setIsIDValid] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [validationEnabled, setValidationEnabled] = useState(true);
  const [submissionComplete, setSubmissionComplete] = useState(false);

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
    
    // Clear error when field is modified
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
    
    // Clear error when field is modified
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
    
    // Clear error when field is modified
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
    // Skip validation if disabled
    if (!validationEnabled) {
      return true;
    }

    const newErrors: Record<string, string> = {};
    
    // Personal Details validation
    if (currentStep === 0) {
      if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
      else if (formData.idNumber.length !== 13) newErrors.idNumber = "ID Number must be 13 digits";
      
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.surname) newErrors.surname = "Surname is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.race) newErrors.race = "Race is required";
      if (!formData.language) newErrors.language = "Language is required";
      if (!formData.nationality) newErrors.nationality = "Nationality is required";
      if (!formData.employmentStatus) newErrors.employmentStatus = "Employment Status is required";
    }
    
    // Contact Details validation
    else if (currentStep === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      
      if (!formData.cellphone) newErrors.cellphone = "Cellphone Number is required";
      else if (!/^0\d{9}$/.test(formData.cellphone)) newErrors.cellphone = "Cellphone must be 10 digits starting with 0";
      
      if (!formData.address) newErrors.address = "Address is required";
    }
    
    // Membership Details validation
    else if (currentStep === 2) {
      if (!formData.membershipType) newErrors.membershipType = "Membership Type is required";
    }
    
    // Membership Oath validation
    else if (currentStep === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the membership oath declaration";
    }
    
    // Payment validation
    else if (currentStep === 4) {
      if (!formData.paymentAmount || parseFloat(formData.paymentAmount) < 20) {
        newErrors.paymentAmount = "Donation amount must be at least R20";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submission - modified to not automatically redirect
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === steps.length - 1) {
      if (validateStep()) {
        setIsLoading(true);
        
        // Simulate payment processing
        setTimeout(() => {
          const membershipNumber = generateMembershipNumber();
          const today = new Date().toISOString().split('T')[0];
          
          // Mark submission as complete - this doesn't automatically log the user in
          setSubmissionComplete(true);
          
          // Show success message
          toast({
            title: "Payment Successful",
            description: "Your membership payment has been processed. You can now login to access your account.",
          });
          
          // End loading state
          setIsLoading(false);
          
          // Here we set paymentCompleted to true but don't auto-redirect
          setFormData(prev => ({
            ...prev,
            paymentCompleted: true,
          }));
          
        }, 2000);
      }
    } else {
      handleNext();
    }
  };

  // Handle login after payment completion - separate action from form submission
  const handleLoginAfterPayment = () => {
    const membershipNumber = generateMembershipNumber();
    const today = new Date().toISOString().split('T')[0];
    
    // Now we actually log the user in and navigate
    login(
      {
        id: Math.random().toString(36).substring(7),
        ...formData,
        membershipNumber,
        joinDate: today,
      },
      "dummy-token"
    );
    
    navigate("/membership-card");
  };

  // Motion variants for animation
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Dev Mode - Validation Toggle */}
      <div className="fixed top-4 right-4 z-50 bg-mkneutral-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center gap-2 text-white">
        <Label htmlFor="validation-toggle" className="text-sm font-medium cursor-pointer flex items-center">
          <code className="bg-mkneutral-700 px-2 py-1 rounded text-xs mr-2">DEV MODE</code>
          Form Validation
        </Label>
        <Switch
          id="validation-toggle"
          checked={validationEnabled}
          onCheckedChange={setValidationEnabled}
          className="data-[state=checked]:bg-primary-600"
        />
        <span className="text-xs text-mkneutral-300 ml-1">
          {validationEnabled ? 'On' : 'Off'}
        </span>
      </div>

      {/* Payment Success Screen */}
      {submissionComplete ? (
        <Card className="shadow-lg border-mkneutral-200 overflow-hidden rounded-xl">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl text-white font-medium">
              Registration Complete
            </h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-xl font-medium text-mkneutral-700 mb-3">Thank you for joining!</p>
            <p className="text-mkneutral-500 mb-8">
              Your membership registration has been successfully processed. You can now access your membership card and benefits.
            </p>
            
            <div className="max-w-md mx-auto p-6 bg-cream-50 rounded-xl mb-8">
              <h3 className="text-lg font-medium text-mkneutral-800 mb-4">Registration Details</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-mkneutral-500">Name:</span>
                  <span className="font-medium">{formData.name} {formData.surname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mkneutral-500">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mkneutral-500">Membership Type:</span>
                  <span className="font-medium">{formData.membershipType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mkneutral-500">Payment Method:</span>
                  <span className="font-medium">{formData.paymentMethod}</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleLoginAfterPayment}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-full"
            >
              View My Membership Card
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Progress Steps - Improved UI */}
          <div className="flex justify-between mb-8 md:mb-12 overflow-hidden rounded-xl shadow-md bg-white border border-mkneutral-100">
            {steps.map((step, index) => (
              <div 
                key={step} 
                className={`flex-1 flex items-center justify-center py-4 px-2 text-sm font-medium transition-all duration-300
                  ${currentStep === index 
                    ? "bg-primary-50 text-primary-700 border-b-2 border-primary-500" 
                    : currentStep > index 
                    ? "bg-cream-50 text-primary-600" 
                    : "bg-cream-50 text-mkneutral-500"}
                  ${index > 0 && "border-l border-mkneutral-100"}
                `}
              >
                <div className="hidden sm:flex sm:items-center">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 
                    ${currentStep === index ? "bg-primary-100 text-primary-600" : 
                     currentStep > index ? "bg-primary-600 text-white" : "bg-mkneutral-100 text-mkneutral-500"}`}>
                    {currentStep > index ? <Check size={14} /> : index + 1}
                  </span>
                  {step}
                </div>
                <div className="sm:hidden flex flex-col items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                    ${currentStep === index ? "bg-primary-100 text-primary-600" : 
                     currentStep > index ? "bg-primary-600 text-white" : "bg-mkneutral-100 text-mkneutral-500"}`}>
                    {currentStep > index ? <Check size={14} /> : stepIcons[index]}
                  </span>
                  <span className="text-xs">{step.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <Card className="shadow-lg border-mkneutral-200 overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-5 text-center">
              <h2 className="text-xl text-white font-medium">
                Complete Your Registration
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="text-center mb-6">
                <p className="text-mkneutral-600">Please fill out the information below to create your membership</p>
              </div>

              {/* Step 1: Personal Details */}
              {currentStep === 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
                      <User size={22} className="mr-2 text-primary-500" /> Personal Details
                    </h2>
                    <p className="text-mkneutral-500">Please enter your personal information</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-mkneutral-700 font-medium">
                        ID Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="idNumber"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleChange}
                          className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.idNumber ? "border-red-500 ring-1 ring-red-500" : ""}`}
                          placeholder="Enter your ID number"
                          maxLength={13}
                        />
                        {isIDValid && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                            <Check size={16} />
                          </span>
                        )}
                      </div>
                      {errors.idNumber && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.idNumber}
                        </p>
                      )}
                      {isIDValid && (
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <Check size={12} className="mr-1" /> ID Number validated
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-mkneutral-700 font-medium">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="surname" className="text-mkneutral-700 font-medium">
                        Surname <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.surname ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        placeholder="Enter your surname"
                      />
                      {errors.surname && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.surname}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="text-mkneutral-700 font-medium">
                        Date of Birth <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.dateOfBirth ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        disabled={isIDValid}
                      />
                      {errors.dateOfBirth && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.dateOfBirth}
                        </p>
                      )}
                      {isIDValid && (
                        <p className="text-xs text-mkneutral-500">Auto-populated from ID Number</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-mkneutral-700 font-medium">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                        disabled={isIDValid}
                      >
                        <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.gender ? "border-red-500 ring-1 ring-red-500" : ""}`}>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOptions.genders.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.gender}
                        </p>
                      )}
                      {isIDValid && (
                        <p className="text-xs text-mkneutral-500">Auto-populated from ID Number</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="race" className="text-mkneutral-700 font-medium">
                        Race <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="race"
                        value={formData.race}
                        onValueChange={(value) => handleSelectChange("race", value)}
                      >
                        <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.race ? "border-red-500 ring-1 ring-red-500" : ""}`}>
                          <SelectValue placeholder="Select your race" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOptions.races.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.race && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.race}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-mkneutral-700 font-medium">
                        Language <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="language"
                        value={formData.language}
                        onValueChange={(value) => handleSelectChange("language", value)}
                      >
                        <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.language ? "border-red-500 ring-1 ring-red-500" : ""}`}>
                          <SelectValue placeholder="Select your language" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOptions.languages.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.language && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.language}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality" className="text-mkneutral-700 font-medium">
                        Nationality <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="nationality"
                        value={formData.nationality}
                        onValueChange={(value) => handleSelectChange("nationality", value)}
                      >
                        <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.nationality ? "border-red-500 ring-1 ring-red-500" : ""}`}>
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOptions.nationalities.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.nationality && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.nationality}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employmentStatus" className="text-mkneutral-700 font-medium">
                        Employment Status <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                      >
                        <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.employmentStatus ? "border-red-500 ring-1 ring-red-500" : ""}`}>
                          <SelectValue placeholder="Select your employment status" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOptions.employmentStatuses.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.employmentStatus && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.employmentStatus}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupation" className="text-mkneutral-700 font-medium">Occupation</Label>
                      <Input
                        id="occupation"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
                        placeholder="Enter your occupation"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="disability" className="text-mkneutral-700 font-medium">Disability</Label>
                      <Select
                        name="disability"
                        value={formData.disability}
                        onValueChange={(value) => handleSelectChange("disability", value)}
                      >
                        <SelectTrigger className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm h-12">
                          <SelectValue placeholder="Do you have a disability?" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockOptions.disabilities.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 1 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
                      <Bookmark size={22} className="mr-2 text-primary-500" /> Contact Details
                    </h2>
                    <p className="text-mkneutral-500">We'll use these details to keep you updated</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="cellphone" className="text-mkneutral-700 font-medium">
                        Cellphone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="cellphone"
                          name="cellphone"
                          value={formData.cellphone}
                          onChange={handleChange}
                          className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.cellphone ? "border-red-500 ring-1 ring-red-500" : ""}`}
                          placeholder="(073) 123 4567"
                          maxLength={10}
                        />
                      </div>
                      {errors.cellphone && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.cellphone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-mkneutral-700 font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.email ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        placeholder="name@example.com"
                      />
                      {errors.email && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address" className="text-mkneutral-700 font-medium">
                        Residential Address - Line 1 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.address ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        placeholder="Street address"
                      />
                      {errors.address && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="addressLine2" className="text-mkneutral-700 font-medium">
                        Residential Address - Line 2
                      </Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
                        placeholder="Apartment, suite, unit, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-mkneutral-700 font-medium">
                        Postal Code
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
                        placeholder="0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-mkneutral-700 font-medium">
                        Province
                      </Label>
                      <Select
                        name="province"
                        value={formData.province}
                        onValueChange={(value) => handleSelectChange("province", value)}
                      >
                        <SelectTrigger className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm h-12">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"].map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-mkneutral-100 bg-cream-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailConfirmation"
                        checked={formData.emailConfirmation}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("emailConfirmation", checked as boolean)
                        }
                        className="rounded border-primary-500 text-primary-600 focus:ring-primary-500/20"
                      />
                      <Label htmlFor="emailConfirmation" className="text-sm cursor-pointer text-mkneutral-700">
                        I would like to receive email updates about membership benefits
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Membership Details */}
              {currentStep === 2 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
                      <FileCheck size={22} className="mr-2 text-primary-500" /> Membership Details
                    </h2>
                    <p className="text-mkneutral-500">Help us understand your local context</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="membershipType" className="text-mkneutral-700 font-medium">
                        Membership Type <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup 
                        defaultValue={formData.membershipType}
                        onValueChange={(value) => handleSelectChange("membershipType", value)}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border border-mkneutral-200 p-3 bg-cream-50 hover:bg-cream-100 transition-colors">
                          <RadioGroupItem 
                            value="Standard" 
                            id="standard-membership" 
                            className="text-primary-600" 
                          />
                          <Label htmlFor="standard-membership" className="font-medium cursor-pointer">Standard Membership</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border border-mkneutral-200 p-3 bg-cream-50 hover:bg-cream-100 transition-colors">
                          <RadioGroupItem 
                            value="Premium" 
                            id="premium-membership" 
                            className="text-primary-600" 
                          />
                          <Label htmlFor="premium-membership" className="font-medium cursor-pointer">Premium Membership</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="municipality" className="text-mkneutral-700 font-medium">
                        Municipality
                      </Label>
                      <Input
                        id="municipality"
                        name="municipality"
                        value={formData.municipality}
                        onChange={handleChange}
                        className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
                        placeholder="e.g. Johannesburg Metro"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ward" className="text-mkneutral-700 font-medium">
                        Ward
                      </Label>
                      <Input
                        id="ward"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
                        placeholder="e.g. Ward 77"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="votingStation" className="text-mkneutral-700 font-medium">
                        Voting Station
                      </Label>
                      <Input
                        id="votingStation"
                        name="votingStation"
                        value={formData.votingStation}
                        onChange={handleChange}
                        className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
                        placeholder="Your local voting station"
                      />
                    </div>
                  </div>

                  <div className="p-6 mt-6 border border-primary-100 rounded-xl bg-primary-50 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                        <FileCheck className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-700">Membership Benefits</h3>
                        <p className="text-sm text-mkneutral-600">Access to exclusive member areas, voting rights, and more</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Membership Oath */}
              {currentStep === 3 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
                      <Check size={22} className="mr-2 text-primary-500" /> Membership Oath
                    </h2>
                    <p className="text-mkneutral-500">Please read and accept the membership oath</p>
                  </div>

                  <div className="bg-cream-50 p-6 rounded-xl border border-mkneutral-200">
                    <h3 className="font-medium text-lg text-mkneutral-800 mb-4">Membership Declaration</h3>
                    <div className="prose prose-sm mb-6 text-mkneutral-700">
                      <p>I, the undersigned, hereby solemnly declare that:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>I am joining this membership of my own free will</li>
                        <li>I will abide by the constitution and code of conduct</li>
                        <li>I will participate in the activities of the organization</li>
                        <li>I will uphold the values and principles of the organization</li>
                        <li>All the information I have provided is true and accurate</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("acceptTerms", checked as boolean)
                        }
                        className={`rounded border-primary-500 text-primary-600 focus:ring-primary-500/20 ${errors.acceptTerms ? "border-red-500" : ""}`}
                      />
                      <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer text-mkneutral-700">
                        I accept the membership oath declaration
                      </Label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="form-error flex items-center text-xs mt-2">
                        <AlertCircle size={12} className="mr-1" /> {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 4 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
                      <CreditCard size={22} className="mr-2 text-primary-500" /> Registration Payment
                    </h2>
                    <p className="text-mkneutral-500">Finalize your membership with a payment</p>
                  </div>

                  <div className="bg-cream-50 p-6 rounded-xl border border-mkneutral-200 mb-6">
                    <h3 className="font-medium text-lg text-mkneutral-800 mb-4">Select Payment Method</h3>
                    
                    <RadioGroup 
                      defaultValue={formData.paymentMethod}
                      onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border border-mkneutral-200 p-3 bg-white hover:bg-cream-100 transition-colors">
                        <RadioGroupItem 
                          value="CreditCard" 
                          id="credit-card" 
                          className="text-primary-600" 
                        />
                        <Label htmlFor="credit-card" className="font-medium cursor-pointer flex items-center">
                          <CreditCard size={18} className="mr-2" /> Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border border-mkneutral-200 p-3 bg-white hover:bg-cream-100 transition-colors">
                        <RadioGroupItem 
                          value="EFT" 
                          id="eft" 
                          className="text-primary-600" 
                        />
                        <Label htmlFor="eft" className="font-medium cursor-pointer flex items-center">
                          <DollarSign size={18} className="mr-2" /> Electronic Funds Transfer (EFT)
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="mt-6">
                      <Label htmlFor="paymentAmount" className="text-mkneutral-700 font-medium block mb-2">
                        Donation Amount (R) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="paymentAmount"
                        name="paymentAmount"
                        type="number"
                        value={formData.paymentAmount}
                        onChange={handleChange}
                        className={`form-input rounded-xl bg-white border-mkneutral-200 shadow-sm max-w-xs ${errors.paymentAmount ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        min="20"
                      />
                      {errors.paymentAmount && (
                        <p className="form-error flex items-center text-xs mt-2">
                          <AlertCircle size={12} className="mr-1" /> {errors.paymentAmount}
                        </p>
                      )}
                      <p className="text-sm text-mkneutral-500 mt-2">
                        Minimum donation amount: R20
                      </p>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                        <span className="text-mkneutral-700">Processing payment...</span>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl shadow-sm flex items-center justify-center"
                    >
                      Complete Registration & Make Payment
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Form Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-4 border-t border-mkneutral-100">
                  {currentStep > 0 ? (
                    <Button
                      type="button"
                      onClick={handlePrevious}
                      className="bg-cream-50 text-mkneutral-700 hover:bg-cream-100 border border-mkneutral-200"
                    >
                      <ChevronLeft size={16} className="mr-1" /> Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Next <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </>
      )}
    </div>
  );
};

export default RegisterForm;


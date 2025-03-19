
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Upload, AlertCircle, ChevronRight, ChevronLeft, Loader2, ToggleRight } from "lucide-react";
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isIDValid, setIsIDValid] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [validationEnabled, setValidationEnabled] = useState(true);

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === steps.length - 1) {
      if (validateStep()) {
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
          const membershipNumber = generateMembershipNumber();
          const today = new Date().toISOString().split('T')[0];
          
          // Register the user
          login(
            {
              id: Math.random().toString(36).substring(7),
              ...formData,
              membershipNumber,
              joinDate: today,
            },
            "dummy-token"
          );
          
          // Show success message
          toast({
            title: "Registration Successful",
            description: "Your membership has been created. Redirecting to your membership card.",
          });
          
          // Redirect to membership card
          setTimeout(() => {
            setIsLoading(false);
            navigate("/membership-card");
          }, 1500);
        }, 2000);
      }
    } else {
      handleNext();
    }
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
          className="data-[state=checked]:bg-green-600"
        />
        <span className="text-xs text-mkneutral-300 ml-1">
          {validationEnabled ? 'On' : 'Off'}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 md:mb-12 overflow-hidden rounded-xl shadow-md bg-white border border-mkneutral-100">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`flex-1 flex items-center justify-center py-4 px-2 text-sm font-medium transition-all duration-300
              ${currentStep === index 
                ? "bg-green-50 text-green-700 border-b-4 border-green-500" 
                : currentStep > index 
                ? "bg-cream-50 text-green-600" 
                : "bg-cream-50 text-mkneutral-500"}
              ${index > 0 && "border-l border-mkneutral-100"}
            `}
          >
            <div className="hidden sm:block">{step}</div>
            <div className="sm:hidden text-xs">
              {index + 1}. {step.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <Card className="shadow-lg border-mkneutral-200 overflow-hidden rounded-xl">
        <div className="bg-green-600 py-4 text-center">
          <h2 className="text-xl text-white font-medium">
            Join the MK Party
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="text-center mb-6">
            <p className="text-mkneutral-600">Please complete the registration form to become a member.</p>
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
                <h2 className="text-2xl font-heading font-medium text-green-600">Personal Details</h2>
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
                <h2 className="text-2xl font-heading font-medium text-green-600">Contact Details</h2>
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
                    className={`form-input rounded-xl bg-green-50 border-mkneutral-200 shadow-sm ${errors.address ? "border-red-500 ring-1 ring-red-500" : ""}`}
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
                    className="form-input rounded-xl bg-green-50 border-mkneutral-200 shadow-sm"
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
                    className="form-input rounded-xl bg-green-50 border-mkneutral-200 shadow-sm"
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
                    <SelectTrigger className="form-input rounded-xl bg-green-50 border-mkneutral-200 shadow-sm h-12">
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
                    className="rounded border-green-500 text-green-600 focus:ring-green-500/20"
                  />
                  <Label htmlFor="emailConfirmation" className="text-sm cursor-pointer text-mkneutral-700">
                    I would like to receive email updates from MK Party
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
                <h2 className="text-2xl font-heading font-medium text-green-600">Membership Details</h2>
                <p className="text-mkneutral-500">Help us understand your local context</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="votingStation" className="text-mkneutral-700 font-medium">
                    Voting Station
                  </Label>
                  <Input
                    id="votingStation"
                    name="votingStation"
                    value={formData.votingStation}
                    onChange={handleChange}
                    className="form-input rounded-xl bg-green-50 border-mkneutral-200 shadow-sm"
                    placeholder="Your local voting station"
                  />
                </div>
              </div>

              <div className="p-6 mt-6 border border-green-100 rounded-xl bg-green-50 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-700">Standard Membership</h3>
                    <p className="text-sm text-green-600">Your selected membership type</p>
                  </div>
                </div>
                <ul className="text-sm space-y-2 text-mkneutral-600 ml-16">
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Access to MK Party membership benefits</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Digital membership card</span>
                  </li>
                  <li className="flex items-start">
                    <Check size={16} className="text-green-500 mt-0.5 mr-2 shrink-0" />
                    <span>Regular updates on party activities</span>
                  </li>
                </ul>
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
                <h2 className="text-2xl font-heading font-medium text-green-600">Membership Oath</h2>
                <p className="text-mkneutral-500">Please read and accept the MK Party Membership Oath</p>
              </div>

              <div className="p-6 rounded-lg bg-cream-50 border border-mkneutral-200 space-y-4">
                <div className="overflow-y-auto max-h-64 p-4 bg-white rounded-md text-mkneutral-800">
                  <p className="mb-4">
                    I voluntarily join Umkhonto weSizwe Party as an individual who is committed to abide by and uphold its
                    constitution, values, objectives, principles, and discipline. I commit that I will never be involved in divisive
                    and factional activities and programmes that seek to undermine the unity and discipline of the
                    organisation. I vow to not associate with external forces that seek to destroy and undermine the unity of the
                    organisation. I will tirelessly work to realise all its aims and objectives. I join the MKP with full knowledge
                    and understanding that the National High Command and National Officials have the right to terminate my
                    membership at any given point for political, ideological and organisational reasons and purposes.
                  </p>
                  <p>
                    I join the MKP with full knowledge that I am not entitled to any position of responsibility in the organisation
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("acceptTerms", checked as boolean)
                    }
                    className={`rounded border-green-500 text-green-500 ${
                      errors.acceptTerms ? "border-red-500" : ""
                    }`}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                    I agree to the MK Party Membership Oath Declaration.
                  </Label>
                </div>
                {errors.acceptTerms && (
                  <p className="form-error flex items-center text-xs">
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
                <h2 className="text-2xl font-heading font-medium text-green-600">Registration Payment</h2>
                <p className="text-mkneutral-500">Support the party with a membership donation</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="p-6 rounded-lg bg-green-50 border border-green-100 space-y-4">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-700">Membership Fee / Donation</h3>
                      <p className="text-sm text-green-600">Support the MK Party with your registration</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount" className="text-mkneutral-700 font-medium">
                        Donation Amount (Minimum R20) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mkneutral-500">R</span>
                        <Input
                          id="paymentAmount"
                          name="paymentAmount"
                          type="number"
                          min="20"
                          value={formData.paymentAmount}
                          onChange={handleChange}
                          className={`form-input rounded-xl bg-white pl-8 border-mkneutral-200 shadow-sm ${errors.paymentAmount ? "border-red-500 ring-1 ring-red-500" : ""}`}
                          placeholder="100"
                        />
                      </div>
                      {errors.paymentAmount && (
                        <p className="form-error flex items-center text-xs">
                          <AlertCircle size={12} className="mr-1" /> {errors.paymentAmount}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod" className="text-mkneutral-700 font-medium">
                        Payment Method
                      </Label>
                      <RadioGroup 
                        defaultValue="EFT" 
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 rounded-lg border border-green-100 p-3 bg-white">
                          <RadioGroupItem value="EFT" id="EFT" className="text-green-600" />
                          <Label htmlFor="EFT" className="cursor-pointer">Electronic Transfer (EFT)</Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg border border-green-100 p-3 bg-white">
                          <RadioGroupItem value="Card" id="Card" className="text-green-600" />
                          <Label htmlFor="Card" className="cursor-pointer">Card Payment</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-4 border-t border-mkneutral-100 flex justify-between">
            {currentStep > 0 ? (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevious}
                className="gap-2 text-mkneutral-600 rounded-xl"
              >
                <ChevronLeft size={16} /> Previous
              </Button>
            ) : (
              <div></div>
            )}
            {currentStep < steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="gap-2 bg-green-600 hover:bg-green-700 rounded-xl"
              >
                Next <ChevronRight size={16} />
              </Button>
            ) : (
              <Button 
                type="submit"
                className="gap-2 bg-green-600 hover:bg-green-700 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;


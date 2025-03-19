
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Upload, AlertCircle, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
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

// Steps in the registration process
const steps = [
  "Personal Details",
  "Contact Details",
  "Membership",
  "Confirmation",
  "Payment",
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
    nationality: "South African",
    employmentStatus: "",
    occupation: "",
    disability: "No",
    email: "",
    cellphone: "",
    address: "",
    emailConfirmation: true,
    membershipType: "Standard",
    acceptTerms: false,
    paymentMethod: "EFT",
    photoUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isIDValid, setIsIDValid] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

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
      if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms and conditions";
    }
    
    // Payment validation
    else if (currentStep === 3) {
      if (!formData.paymentMethod) newErrors.paymentMethod = "Payment Method is required";
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
              province: "Gauteng", // Placeholder
              ward: "Ward 42", // Placeholder
              votingStation: "Local Community Hall", // Placeholder
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
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 md:mb-12 px-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`step-item ${
              currentStep === index 
                ? "active" 
                : currentStep > index 
                ? "complete" 
                : ""
            }`}
          >
            <div 
              className={`step ${
                currentStep === index 
                  ? "active" 
                  : currentStep > index 
                  ? "complete" 
                  : ""
              }`}
            >
              {currentStep > index ? (
                <Check className="w-6 h-6" />
              ) : (
                index + 1
              )}
            </div>
            <div 
              className={`step-text ${
                currentStep === index 
                  ? "active" 
                  : currentStep > index 
                  ? "complete" 
                  : ""
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <Card className="shadow-glass border-mkneutral-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
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
                <h2 className="text-2xl font-heading font-medium">Personal Details</h2>
                <p className="text-mkneutral-500">Please enter your personal information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">
                    ID Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="idNumber"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className={`form-input ${errors.idNumber ? "border-red-500" : ""}`}
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
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? "border-red-500" : ""}`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname">
                    Surname <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className={`form-input ${errors.surname ? "border-red-500" : ""}`}
                    placeholder="Enter your surname"
                  />
                  {errors.surname && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.surname}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`form-input ${errors.dateOfBirth ? "border-red-500" : ""}`}
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
                  <Label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                    disabled={isIDValid}
                  >
                    <SelectTrigger className={`form-input ${errors.gender ? "border-red-500" : ""}`}>
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
                  <Label htmlFor="race">
                    Race <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="race"
                    value={formData.race}
                    onValueChange={(value) => handleSelectChange("race", value)}
                  >
                    <SelectTrigger className={`form-input ${errors.race ? "border-red-500" : ""}`}>
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
                  <Label htmlFor="language">
                    Language <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="language"
                    value={formData.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                  >
                    <SelectTrigger className={`form-input ${errors.language ? "border-red-500" : ""}`}>
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
                  <Label htmlFor="nationality">
                    Nationality <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="nationality"
                    value={formData.nationality}
                    onValueChange={(value) => handleSelectChange("nationality", value)}
                  >
                    <SelectTrigger className={`form-input ${errors.nationality ? "border-red-500" : ""}`}>
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
                  <Label htmlFor="employmentStatus">
                    Employment Status <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onValueChange={(value) => handleSelectChange("employmentStatus", value)}
                  >
                    <SelectTrigger className={`form-input ${errors.employmentStatus ? "border-red-500" : ""}`}>
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
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disability">Disability</Label>
                  <Select
                    name="disability"
                    value={formData.disability}
                    onValueChange={(value) => handleSelectChange("disability", value)}
                  >
                    <SelectTrigger className="form-input">
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
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-medium">Contact Details</h2>
                <p className="text-mkneutral-500">How can we reach you?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? "border-red-500" : ""}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cellphone">
                    Cellphone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cellphone"
                    name="cellphone"
                    value={formData.cellphone}
                    onChange={handleChange}
                    className={`form-input ${errors.cellphone ? "border-red-500" : ""}`}
                    placeholder="0XXXXXXXXX"
                    maxLength={10}
                  />
                  {errors.cellphone && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.cellphone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">
                    Physical Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input min-h-[100px] ${errors.address ? "border-red-500" : ""}`}
                    placeholder="Enter your full address"
                  />
                  {errors.address && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-mkneutral-100">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailConfirmation"
                    checked={formData.emailConfirmation}
                    onChange={(e) => handleCheckboxChange("emailConfirmation", e.target.checked)}
                    className="rounded border-mkneutral-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="emailConfirmation" className="text-sm cursor-pointer">
                    I would like to receive email updates from MK Party
                  </Label>
                </div>
              </div>

              {/* IEC Information (placeholder) */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Voter Registration Details</h3>
                <p className="text-xs text-blue-700">
                  When we connect to the IEC API, we'll automatically retrieve your ward, voting district, and voting station information.
                </p>
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
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-medium">Membership Details</h2>
                <p className="text-mkneutral-500">Choose your membership type and upload a photo</p>
              </div>

              {/* Membership Type */}
              <div className="space-y-4">
                <Label>
                  Membership Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`
                    rounded-lg border border-mkneutral-200 p-4 cursor-pointer transition-all
                    ${formData.membershipType === 'Standard' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
                  `}
                  onClick={() => handleSelectChange("membershipType", "Standard")}>
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full border border-mkneutral-300 flex items-center justify-center mr-2">
                        {formData.membershipType === 'Standard' && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <h4 className="font-medium">Standard Member</h4>
                    </div>
                    <ul className="text-sm space-y-1 text-mkneutral-600 ml-6">
                      <li className="list-disc">Basic membership</li>
                      <li className="list-disc">Digital membership card</li>
                      <li className="list-disc">Monthly newsletter</li>
                    </ul>
                  </div>
                  
                  <div className={`
                    rounded-lg border border-mkneutral-200 p-4 cursor-pointer transition-all
                    ${formData.membershipType === 'Premium' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
                  `}
                  onClick={() => handleSelectChange("membershipType", "Premium")}>
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full border border-mkneutral-300 flex items-center justify-center mr-2">
                        {formData.membershipType === 'Premium' && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <h4 className="font-medium">Premium Member</h4>
                    </div>
                    <ul className="text-sm space-y-1 text-mkneutral-600 ml-6">
                      <li className="list-disc">All Standard benefits</li>
                      <li className="list-disc">Invitation to special events</li>
                      <li className="list-disc">Priority voting on party polls</li>
                    </ul>
                  </div>
                  
                  <div className={`
                    rounded-lg border border-mkneutral-200 p-4 cursor-pointer transition-all
                    ${formData.membershipType === 'Volunteer' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
                  `}
                  onClick={() => handleSelectChange("membershipType", "Volunteer")}>
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 rounded-full border border-mkneutral-300 flex items-center justify-center mr-2">
                        {formData.membershipType === 'Volunteer' && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <h4 className="font-medium">Volunteer Member</h4>
                    </div>
                    <ul className="text-sm space-y-1 text-mkneutral-600 ml-6">
                      <li className="list-disc">All Standard benefits</li>
                      <li className="list-disc">Active participation in campaigns</li>
                      <li className="list-disc">Leadership opportunities</li>
                    </ul>
                  </div>
                </div>
                {errors.membershipType && (
                  <p className="form-error flex items-center text-xs">
                    <AlertCircle size={12} className="mr-1" /> {errors.membershipType}
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <Label htmlFor="photoUpload">Profile Photo (Optional)</Label>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-mkneutral-300 flex items-center justify-center bg-mkneutral-50 overflow-hidden">
                    {uploadedPhoto ? (
                      <img 
                        src={uploadedPhoto} 
                        alt="Uploaded profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload size={24} className="mx-auto text-mkneutral-400 mb-2" />
                        <span className="text-xs text-mkneutral-500">No photo uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="photoUpload"
                        className="px-4 py-2 bg-mkneutral-100 hover:bg-mkneutral-200 rounded-lg cursor-pointer inline-flex items-center transition-colors"
                      >
                        <Upload size={16} className="mr-2" />
                        <span>{uploadedPhoto ? "Change Photo" : "Upload Photo"}</span>
                      </Label>
                      {uploadedPhoto && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedPhoto(null);
                            setFormData(prev => ({ ...prev, photoUrl: "" }));
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <input
                      id="photoUpload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-mkneutral-500 mt-2">
                      Upload a clear photo of yourself for your membership card. 
                      JPG, PNG or GIF formats accepted, max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Membership Oath */}
              <div className="p-6 rounded-lg bg-mkneutral-50 border border-mkneutral-200 space-y-4">
                <h3 className="font-medium text-lg">Membership Oath</h3>
                <p className="text-mkneutral-700">
                  As a member of the MK Party, I pledge to uphold the values and principles of the party. 
                  I commit to working towards a united, prosperous and democratic South Africa where all citizens 
                  have equal opportunities and rights. I will conduct myself with integrity and respect at all times.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleCheckboxChange("acceptTerms", e.target.checked)}
                    className={`rounded border-mkneutral-300 text-primary focus:ring-primary ${
                      errors.acceptTerms ? "border-red-500" : ""
                    }`}
                  />
                  <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                    I agree to the <a href="/terms" className="text-primary hover:underline">terms and conditions</a> and acknowledge the <a href="/privacy" className="text-primary hover:underline">privacy policy</a>
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

          {/* Step 4: Payment */}
          {currentStep === 3 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-heading font-medium">Payment Options</h2>
                <p className="text-mkneutral-500">Choose your preferred payment method</p>
              </div>

              <div className="bg-mkneutral-50 border border-mkneutral-200 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Membership Fee</h3>
                  <p className="text-2xl font-medium text-primary">R100.00</p>
                  <p className="text-sm text-mkneutral-500">Annual membership fee</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-mkneutral-200">
                  <div className="space-y-2">
                    <Label>Select Payment Method</Label>
                    <RadioGroup 
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className={`
                        flex items-center space-x-2 p-4 rounded-lg border border-mkneutral-200
                        ${formData.paymentMethod === 'EFT' ? 'border-primary bg-primary/5' : ''}
                      `}>
                        <RadioGroupItem value="EFT" id="eft" />
                        <Label htmlFor="eft" className="flex-1 cursor-pointer">
                          <div className="font-medium">Electronic Funds Transfer (EFT)</div>
                          <div className="text-sm text-mkneutral-500">Manual bank transfer</div>
                        </Label>
                      </div>
                      
                      <div className={`
                        flex items-center space-x-2 p-4 rounded-lg border border-mkneutral-200
                        ${formData.paymentMethod === 'Online' ? 'border-primary bg-primary/5' : ''}
                      `}>
                        <RadioGroupItem value="Online" id="online" />
                        <Label htmlFor="online" className="flex-1 cursor-pointer">
                          <div className="font-medium">Online Payment</div>
                          <div className="text-sm text-mkneutral-500">Credit card or instant EFT</div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.paymentMethod && (
                      <p className="form-error flex items-center text-xs">
                        <AlertCircle size={12} className="mr-1" /> {errors.paymentMethod}
                      </p>
                    )}
                  </div>

                  {formData.paymentMethod === 'EFT' && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mt-4">
                      <h4 className="font-medium text-blue-800 mb-2">Bank Details</h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p><span className="font-medium">Bank:</span> South African Bank</p>
                        <p><span className="font-medium">Account Name:</span> MK Party</p>
                        <p><span className="font-medium">Account Number:</span> 1234567890</p>
                        <p><span className="font-medium">Branch Code:</span> 123456</p>
                        <p><span className="font-medium">Reference:</span> Your ID Number</p>
                      </div>
                      <p className="text-xs text-blue-700 mt-4">
                        Please use your ID Number as the reference when making the payment.
                        Send proof of payment to <a href="mailto:payments@mkparty.org" className="underline">payments@mkparty.org</a>
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'Online' && (
                    <div className="mt-4">
                      <p className="text-sm text-mkneutral-500 mb-4">
                        You will be redirected to our secure payment gateway after completing this form.
                      </p>
                      <div className="flex items-center space-x-2 p-4 rounded-lg bg-mkneutral-50 border border-mkneutral-200">
                        <div className="text-mkneutral-400">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-sm">Your payment will be processed securely.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2 py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-heading font-medium">Registration Complete!</h2>
                <p className="text-mkneutral-500">Thank you for registering with MK Party</p>
              </div>

              <div className="bg-mkneutral-50 border border-mkneutral-200 rounded-lg p-6 space-y-4">
                <h3 className="font-medium">Registration Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-mkneutral-500">Personal Details</h4>
                    <ul className="mt-2 space-y-1">
                      <li><span className="font-medium">Name:</span> {formData.name} {formData.surname}</li>
                      <li><span className="font-medium">ID Number:</span> {formData.idNumber}</li>
                      <li><span className="font-medium">Date of Birth:</span> {new Date(formData.dateOfBirth).toLocaleDateString()}</li>
                      <li><span className="font-medium">Gender:</span> {formData.gender}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-mkneutral-500">Contact Details</h4>
                    <ul className="mt-2 space-y-1">
                      <li><span className="font-medium">Email:</span> {formData.email}</li>
                      <li><span className="font-medium">Cellphone:</span> {formData.cellphone}</li>
                      <li><span className="font-medium">Address:</span> {formData.address}</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-mkneutral-200">
                  <h4 className="text-sm font-medium text-mkneutral-500">Membership Details</h4>
                  <ul className="mt-2 space-y-1">
                    <li><span className="font-medium">Membership Type:</span> {formData.membershipType}</li>
                    <li><span className="font-medium">Payment Method:</span> {formData.paymentMethod}</li>
                    <li><span className="font-medium">Membership Fee:</span> R100.00</li>
                    <li><span className="font-medium">Status:</span> <span className="text-green-600">Paid</span></li>
                  </ul>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p>Your virtual membership card is now available!</p>
                <Button 
                  type="button"
                  className="mx-auto w-full max-w-md" 
                  onClick={() => navigate('/membership-card')}
                >
                  View Membership Card
                </Button>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </Button>
            )}
            
            {currentStep === 0 && (
              <div></div> // Empty div for flexbox spacing
            )}
            
            {currentStep < steps.length - 1 && (
              <Button
                type="submit"
                className="flex items-center ml-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <>
                    {currentStep === steps.length - 2 ? "Complete Registration" : "Next"}
                    <ChevronRight size={16} className="ml-1" />
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


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
import { Checkbox } from "@/components/ui/checkbox";

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
    nationality: "South African",
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
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8 md:mb-12 px-4 overflow-x-auto">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className={`step-item flex-1 text-center ${
              currentStep === index 
                ? "active bg-green-50" 
                : currentStep > index 
                ? "complete bg-cream-50" 
                : "bg-cream-50"
            } ${index === currentStep ? 'border-b-4 border-green-500' : ''}`}
          >
            <div className="py-3 px-1 text-sm font-medium">
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <Card className="shadow-glass border-mkneutral-200 overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl text-green-600 font-medium">
              Final Stage. Please fill in the form below to help us serve you better.
            </h2>
          </div>

          {/* Step 1: Personal Details - keeping existing code */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cellphone">
                    Cellphone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cellphone"
                    name="cellphone"
                    value={formData.cellphone}
                    onChange={handleChange}
                    className={`form-input rounded-full ${errors.cellphone ? "border-red-500" : ""}`}
                    placeholder="(Cellphone Number) 073 123 4567"
                    maxLength={10}
                  />
                  {errors.cellphone && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.cellphone}
                    </p>
                  )}
                </div>

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
                    className={`form-input rounded-full bg-cream-50 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="Email Address"
                  />
                  {errors.email && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">
                    Residential Address - Line 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input rounded-full bg-green-50 ${errors.address ? "border-red-500" : ""}`}
                    placeholder="Residential Address - Line 1"
                  />
                  {errors.address && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.address}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="addressLine2">
                    Residential Address - Line 2
                  </Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="form-input rounded-full bg-green-50"
                    placeholder="Residential Address - Line 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    Postal Code
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="form-input rounded-full bg-green-50"
                    placeholder="Postal Code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">
                    Province
                  </Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="form-input rounded-full bg-green-50"
                    placeholder="Province"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-mkneutral-100">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailConfirmation"
                    checked={formData.emailConfirmation}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("emailConfirmation", checked as boolean)
                    }
                    className="rounded border-mkneutral-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="emailConfirmation" className="text-sm cursor-pointer">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="municipality">
                    Municipality
                  </Label>
                  <Input
                    id="municipality"
                    name="municipality"
                    value={formData.municipality}
                    onChange={handleChange}
                    className="form-input rounded-full"
                    placeholder="(Municipality) Johannesburg Metro - Midrand"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">
                    Ward
                  </Label>
                  <Input
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    className="form-input rounded-full"
                    placeholder="WARD 77 - Waterfall"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="votingStation">
                    Voting Station
                  </Label>
                  <Input
                    id="votingStation"
                    name="votingStation"
                    value={formData.votingStation}
                    onChange={handleChange}
                    className="form-input rounded-full bg-green-50"
                    placeholder="Voting Station Name"
                  />
                </div>
              </div>

              <div className="space-y-4 hidden">
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
                </div>
                {errors.membershipType && (
                  <p className="form-error flex items-center text-xs">
                    <AlertCircle size={12} className="mr-1" /> {errors.membershipType}
                  </p>
                )}
              </div>

              {/* Photo Upload - keeping existing code but hidden for now */}
              <div className="space-y-4 hidden">
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
              <div className="p-6 rounded-lg bg-cream-50 border border-mkneutral-200 space-y-4">
                <div className="overflow-y-auto max-h-64 p-4 bg-cream-50 rounded-md text-mkneutral-800">
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
              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-medium">Registration Payment</h2>
                <p className="text-mkneutral-500">Please select your payment method and amount</p>

                <div className="space-y-4">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border border-mkneutral-200 rounded-lg p-4">
                      <RadioGroupItem value="EFT" id="EFT" />
                      <Label htmlFor="EFT" className="font-medium cursor-pointer">EFT (Bank Transfer)</Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-mkneutral-200 rounded-lg p-4">
                      <RadioGroupItem value="Card" id="Card" />
                      <Label htmlFor="Card" className="font-medium cursor-pointer">Credit/Debit Card</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="paymentAmount">
                    Donation Amount (min R20) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mkneutral-600">R</span>
                    <Input
                      id="paymentAmount"
                      name="paymentAmount"
                      type="number"
                      min="20"
                      value={formData.paymentAmount}
                      onChange={handleChange}
                      className={`form-input pl-8 ${errors.paymentAmount ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.paymentAmount && (
                    <p className="form-error flex items-center text-xs">
                      <AlertCircle size={12} className="mr-1" /> {errors.paymentAmount}
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration & Make Payment"
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-mkneutral-100">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="rounded-full"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;

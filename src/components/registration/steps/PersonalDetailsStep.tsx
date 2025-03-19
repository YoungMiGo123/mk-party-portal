
import { motion } from "framer-motion";
import { AlertCircle, Check, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOptions } from "@/lib/mockData";

interface PersonalDetailsStepProps {
  formData: any;
  errors: Record<string, string>;
  isIDValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  variants: any;
}

const PersonalDetailsStep = ({
  formData,
  errors,
  isIDValid,
  handleChange,
  handleSelectChange,
  variants,
}: PersonalDetailsStepProps) => {
  return (
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
          <Label htmlFor="firstName" className="text-mkneutral-700 font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.firstName ? "border-red-500 ring-1 ring-red-500" : ""}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-mkneutral-700 font-medium">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.lastName ? "border-red-500 ring-1 ring-red-500" : ""}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.lastName}
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
  );
};

export default PersonalDetailsStep;

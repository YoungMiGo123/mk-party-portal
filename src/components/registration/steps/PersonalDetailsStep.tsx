import { motion } from "framer-motion";
import { AlertCircle, User } from "lucide-react";
import { Input as BaseInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getEnumValues,
  Gender,
  Race,
  Language,
  Nationality,
  EmploymentStatus,
  YesNo,
} from "@/utilities/enums";
import { useState } from "react";
import Input from "@/components/input/Input";
import { FormDataType } from "../RegisterForm";
import { MotionVariantsType, validatePersonalDetails } from "../registerUtils";

const genderOptions = getEnumValues(Gender);
const raceOptions = getEnumValues(Race);
const languageOptions = getEnumValues(Language);
const NationalityOptions = getEnumValues(Nationality);
const employmentStatusOptions = getEnumValues(EmploymentStatus);
const disabilityOptions = getEnumValues(YesNo);

export interface PersonalDetailsStepProps {
  formData: FormDataType;
  variants: MotionVariantsType;
  validationRef: React.MutableRefObject<() => boolean>;
  handleSelectChange: (name: string, value: string) => void;
}

const PersonalDetailsStep = (props: PersonalDetailsStepProps) => {
  const { formData, variants, validationRef, handleSelectChange } = props;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleValidation = () => {
    let newErrors: Record<string, string> = {};
    newErrors = validatePersonalDetails(formData, true);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      setErrors(newErrors);
    }
    return isValid;
  };
  validationRef.current = handleValidation;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    handleSelectChange(name, value);
  };

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
        <p className="text-mkneutral-500">
          Please enter your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          error={errors.firstName}
        />

        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          error={errors.lastName}
        />

        <div className="space-y-2">
          <Label
            htmlFor="dateOfBirth"
            className="text-mkneutral-700 font-medium"
          >
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <BaseInput
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
              errors.dateOfBirth ? "border-red-500 ring-1 ring-red-500" : ""
            }`}
            disabled={true}
          />
          {errors.dateOfBirth && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.dateOfBirth}
            </p>
          )}
          <p className="text-xs text-mkneutral-500">
            Auto-populated from ID Number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-mkneutral-700 font-medium">
            Gender <span className="text-red-500">*</span>
          </Label>
          <Select
            name="gender"
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
            disabled={true}
          >
            <SelectTrigger
              className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                errors.gender ? "border-red-500 ring-1 ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((option) => (
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
          <p className="text-xs text-mkneutral-500">
            Auto-populated from ID Number
          </p>
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
            <SelectTrigger
              className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                errors.race ? "border-red-500 ring-1 ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select your race" />
            </SelectTrigger>
            <SelectContent>
              {raceOptions.map((option) => (
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
            <SelectTrigger
              className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                errors.language ? "border-red-500 ring-1 ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select your language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
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
          <Label
            htmlFor="nationality"
            className="text-mkneutral-700 font-medium"
          >
            Nationality <span className="text-red-500">*</span>
          </Label>
          <Select
            name="nationality"
            value={formData.nationality}
            onValueChange={(value) => handleSelectChange("nationality", value)}
          >
            <SelectTrigger
              className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                errors.nationality ? "border-red-500 ring-1 ring-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select your nationality" />
            </SelectTrigger>
            <SelectContent>
              {NationalityOptions.map((option) => (
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
          <Label
            htmlFor="employmentStatus"
            className="text-mkneutral-700 font-medium"
          >
            Employment Status <span className="text-red-500">*</span>
          </Label>
          <Select
            name="employmentStatus"
            value={formData.employmentStatus}
            onValueChange={(value) =>
              handleSelectChange("employmentStatus", value)
            }
          >
            <SelectTrigger
              className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                errors.employmentStatus
                  ? "border-red-500 ring-1 ring-red-500"
                  : ""
              }`}
            >
              <SelectValue placeholder="Select your employment status" />
            </SelectTrigger>
            <SelectContent>
              {employmentStatusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employmentStatus && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" />{" "}
              {errors.employmentStatus}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="occupation"
            className="text-mkneutral-700 font-medium"
          >
            Occupation
          </Label>
          <BaseInput
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
            placeholder="Enter your occupation"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="disability"
            className="text-mkneutral-700 font-medium"
          >
            Disability
          </Label>
          <Select
            name="disability"
            value={formData.disability}
            onValueChange={(value) => handleSelectChange("disability", value)}
          >
            <SelectTrigger className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm h-12">
              <SelectValue placeholder="Do you have a disability?" />
            </SelectTrigger>
            <SelectContent>
              {disabilityOptions.map((option) => (
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

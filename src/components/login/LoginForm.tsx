import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DevModeToggle from "../registration/DevModeToggle";

const initialFormData = {
  idNumber: "",
  contactInfo: "",
};

export interface LoginFormProps {
  onSubmit: (formData: typeof initialFormData) => void;
  isLoading: boolean;
}

export default function LoginForm(props: LoginFormProps) {
  const [devMode, setDevMode] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = handleValidateForm();
    if (isValid) {
      props.onSubmit(formData);
    }
  };

  const handleValidateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.idNumber) {
      newErrors.idNumber = "ID Number is required";
    } else if (formData.idNumber.length !== 13) {
      newErrors.idNumber = "ID Number must be 13 digits";
    }

    if (!formData.contactInfo) {
      newErrors.contactInfo = "Email is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const toggleDevMode = (enabled: boolean) => {
    setDevMode(enabled);

    if (!enabled) {
      setFormData({
        idNumber: devModeUserFakeData.idNumber,
        contactInfo: devModeUserFakeData.email,
      });
    } else {
      setFormData({ ...initialFormData });
    }
  };

  return (
    <>
      <DevModeToggle devMode={devMode} toggleDevMode={toggleDevMode} />
      <Card className="shadow-glass border-mkneutral-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ID Number */}
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
                className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                  errors.idNumber ? "border-red-500 ring-1 ring-red-500" : ""
                }`}
                placeholder="Enter your ID number"
                maxLength={13}
                disabled={props.isLoading}
              />
              {!errors.idNumber && formData.idNumber.length == 13 && (
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
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="contactInfo">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                  errors.contactInfo ? "border-red-500 ring-1 ring-red-500" : ""
                }`}
                placeholder="Enter your email"
                type="email"
                disabled={props.isLoading}
              />
              {!errors.contactInfo && formData.contactInfo.includes("@") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <Check size={16} />
                </span>
              )}
            </div>
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
          <Button type="submit" className="w-full" disabled={props.isLoading}>
            {props.isLoading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              "Log In"
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center space-y-2 text-sm text-mkneutral-600">
            <p>
              Not a member yet?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
            <p>
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </>
  );
}

export const devModeUserFakeData = {
  id: "008ae377-9a9c-4bf2-87f0-d6fb643b7444",
  name: "Masilakhe",
  surname: "Sukwana",
  email: "Sukwanamasilakhe1977@gmail.com",
  idNumber: "0001025205087",
  cellphone: "0737504787",
  dateOfBirth: "2000-01-02",
  gender: "Male",
  race: "African",
  language: "IsiXhosa",
  nationality: "South Africa",
  employmentStatus: "Unemployed",
  occupation: "",
  disability: "No",
  address: "20123 Mpozolo Street Philippi Cape Town",
  addressLine2: "",
  postalCode: "7750",
  membershipType: "Basic",
  membershipNumber: "d631206d-4cb0-41e8-b652-ce6330b19bdf",
  provinceId: "008ae377-9a9c-4bf2-87f0-d6fb643b7444", // "Western Cape"
  province: "Western Cape",
  municipalityId: "1c1d0898-3545-4308-ba3d-e570ccfabbb3", // "CPT - City of Cape Town"
  municipality: "CPT - City of Cape Town",
  votingStationId: "4b89d296-9688-4ca6-9946-ee8618570626", //"BONGOLWETHU PRIMARY SCHOOL"
  votingStation: "BONGOLWETHU PRIMARY SCHOOL",
  wardId: "7ddca064-38c2-4f32-a42b-eda9f6bc934e",
  wardNumber: "8000010",
  ward: "Ward 10",
  joinDate: "2025-03-30",
};

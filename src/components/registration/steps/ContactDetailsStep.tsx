
import { motion } from "framer-motion";
import { AlertCircle, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockOptions } from "@/lib/mockData";

interface ContactDetailsStepProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSelectChange?: (name: string, value: string) => void;
  handleCheckboxChange?: (name: string, checked: boolean) => void;
  variants: any;
}

const ContactDetailsStep = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
  handleCheckboxChange,
  variants,
}: ContactDetailsStepProps) => {
  return (
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
        
        <div className="space-y-2">
          <Label htmlFor="address" className="text-mkneutral-700 font-medium">
            Residential Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.address ? "border-red-500 ring-1 ring-red-500" : ""}`}
            placeholder="Enter your street address"
          />
          {errors.address && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.address}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="addressLine2" className="text-mkneutral-700 font-medium">
            Address Line 2
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
            Postal Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.postalCode ? "border-red-500 ring-1 ring-red-500" : ""}`}
            placeholder="Enter postal code"
            maxLength={4}
          />
          {errors.postalCode && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.postalCode}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            {handleCheckboxChange && (
              <Checkbox 
                id="emailConfirmation" 
                checked={formData.emailConfirmation} 
                onCheckedChange={(checked) => handleCheckboxChange("emailConfirmation", checked === true)}
                className="mt-1"
              />
            )}
            <Label 
              htmlFor="emailConfirmation" 
              className="text-mkneutral-700 font-medium cursor-pointer text-sm"
            >
              I would like to receive emails about party events and updates
            </Label>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactDetailsStep;


import { motion } from "framer-motion";
import { AlertCircle, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactDetailsStepProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  variants: any;
}

const ContactDetailsStep = ({
  formData,
  errors,
  handleChange,
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
        
        {/* Additional fields would go here */}
      </div>
    </motion.div>
  );
};

export default ContactDetailsStep;

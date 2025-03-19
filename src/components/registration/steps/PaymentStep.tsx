
import { motion } from "framer-motion";
import { AlertCircle, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOptions } from "@/lib/mockData";

interface PaymentStepProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  variants: any;
}

const PaymentStep = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
  variants,
}: PaymentStepProps) => {
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
          <CreditCard size={22} className="mr-2 text-primary-500" /> Registration Payment
        </h2>
        <p className="text-mkneutral-500">Please complete your registration payment</p>
      </div>

      <div className="bg-cream-50 p-6 rounded-xl border border-mkneutral-200 mb-6">
        <h3 className="text-lg font-medium text-primary-700 mb-4">Membership Contribution</h3>
        
        <div className="prose prose-sm max-w-none text-mkneutral-700">
          <p className="mb-4">
            Your contribution helps uMkhonto we Sizwe Party to continue its mission of bringing positive change to South Africa. 
            A minimum donation of R20 is required to complete your registration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod" className="text-mkneutral-700 font-medium">
            Payment Method <span className="text-red-500">*</span>
          </Label>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onValueChange={(value) => handleSelectChange("paymentMethod", value)}
          >
            <SelectTrigger className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.paymentMethods.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentAmount" className="text-mkneutral-700 font-medium">
            Donation Amount (R) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="paymentAmount"
            name="paymentAmount"
            type="number"
            min="20"
            step="10"
            value={formData.paymentAmount}
            onChange={handleChange}
            className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.paymentAmount ? "border-red-500 ring-1 ring-red-500" : ""}`}
            placeholder="Enter donation amount (min. R20)"
          />
          {errors.paymentAmount && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.paymentAmount}
            </p>
          )}
          <p className="text-xs text-mkneutral-500">Minimum donation: R20</p>
        </div>
      </div>

      <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 mt-4">
        <p className="text-sm text-primary-700">
          <strong>Note:</strong> This is a demonstration. No actual payment will be processed.
        </p>
      </div>
    </motion.div>
  );
};

export default PaymentStep;

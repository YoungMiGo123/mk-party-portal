
import { motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface MembershipOathStepProps {
  formData: any;
  errors: Record<string, string>;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  variants: any;
}

const MembershipOathStep = ({
  formData,
  errors,
  handleCheckboxChange,
  variants,
}: MembershipOathStepProps) => {
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
          <Check size={22} className="mr-2 text-primary-500" /> Membership Oath
        </h2>
        <p className="text-mkneutral-500">Please read and accept the membership oath</p>
      </div>

      <div className="bg-cream-50 p-6 rounded-xl border border-mkneutral-200 mb-6">
        <h3 className="text-lg font-medium text-primary-700 mb-4">uMkhonto we Sizwe Party Membership Oath</h3>
        
        <div className="prose prose-sm max-w-none text-mkneutral-700">
          <p className="mb-2">I, solemnly declare that:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>I am joining uMkhonto we Sizwe Party voluntarily and without motives of material advantage or personal gain.</li>
            <li>I agree with the aims and objectives of uMkhonto we Sizwe Party as set out in the Constitution and other policy positions.</li>
            <li>I will work towards the attainment of the aims and objectives of uMkhonto we Sizwe Party.</li>
            <li>I will observe discipline, behave honestly, and carry out loyally and to the best of my ability decisions of the majority and decisions of higher bodies.</li>
            <li>I will put the interest of the people of South Africa first in all my actions as a member of uMkhonto we Sizwe Party.</li>
            <li>I will strive to combat all forms of tribalism, regionalism, and discrimination.</li>
            <li>I confirm that I have not been convicted of a serious criminal offense by a court of law in the past 5 years.</li>
          </ul>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox 
          id="acceptTerms" 
          checked={formData.acceptTerms} 
          onCheckedChange={(checked) => handleCheckboxChange("acceptTerms", checked === true)}
          className={errors.acceptTerms ? "border-red-500 data-[state=checked]:bg-primary-600" : ""}
        />
        <div>
          <Label 
            htmlFor="acceptTerms" 
            className="text-mkneutral-700 font-medium cursor-pointer"
          >
            I accept the membership oath declaration <span className="text-red-500">*</span>
          </Label>
          {errors.acceptTerms && (
            <p className="form-error flex items-center text-xs mt-1">
              <AlertCircle size={12} className="mr-1" /> {errors.acceptTerms}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipOathStep;

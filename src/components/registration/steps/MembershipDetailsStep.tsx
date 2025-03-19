
import { motion } from "framer-motion";
import { AlertCircle, FileCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOptions } from "@/lib/mockData";
import { Textarea } from "@/components/ui/textarea";

interface MembershipDetailsStepProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  variants: any;
}

const MembershipDetailsStep = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
  variants,
}: MembershipDetailsStepProps) => {
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
          <FileCheck size={22} className="mr-2 text-primary-500" /> Membership Details
        </h2>
        <p className="text-mkneutral-500">Please provide your voting and party membership preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="province" className="text-mkneutral-700 font-medium">
            Province <span className="text-red-500">*</span>
          </Label>
          <Select
            name="province"
            value={formData.province}
            onValueChange={(value) => handleSelectChange("province", value)}
          >
            <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.province ? "border-red-500 ring-1 ring-red-500" : ""}`}>
              <SelectValue placeholder="Select your province" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.provinces.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.province && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.province}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipality" className="text-mkneutral-700 font-medium">
            Municipality <span className="text-red-500">*</span>
          </Label>
          <Select
            name="municipality"
            value={formData.municipality}
            onValueChange={(value) => handleSelectChange("municipality", value)}
          >
            <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.municipality ? "border-red-500 ring-1 ring-red-500" : ""}`}>
              <SelectValue placeholder="Select your municipality" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.municipalities.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.municipality && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.municipality}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward" className="text-mkneutral-700 font-medium">
            Ward Number
          </Label>
          <Input
            id="ward"
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
            placeholder="Enter your ward number if known"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="votingStation" className="text-mkneutral-700 font-medium">
            Voting Station
          </Label>
          <Input
            id="votingStation"
            name="votingStation"
            value={formData.votingStation}
            onChange={handleChange}
            className="form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm"
            placeholder="Enter your voting station if known"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="membershipType" className="text-mkneutral-700 font-medium">
            Membership Type <span className="text-red-500">*</span>
          </Label>
          <Select
            name="membershipType"
            value={formData.membershipType}
            onValueChange={(value) => handleSelectChange("membershipType", value)}
          >
            <SelectTrigger className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${errors.membershipType ? "border-red-500 ring-1 ring-red-500" : ""}`}>
              <SelectValue placeholder="Select membership type" />
            </SelectTrigger>
            <SelectContent>
              {mockOptions.membershipTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.membershipType && (
            <p className="form-error flex items-center text-xs">
              <AlertCircle size={12} className="mr-1" /> {errors.membershipType}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipDetailsStep;

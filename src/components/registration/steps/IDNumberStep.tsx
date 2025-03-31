import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Check,
  ChevronRight,
  IdCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ErrorPopupDialog } from "@/components/dialog/ErrorPopupDialog";
import { FormDataType, RegistrationFormStep } from "../RegisterForm";
import { MotionVariantsType, validateIDNumber } from "../registerUtils";
import { useGetVotingStationByIdRequest } from "@/api/member-details/votingStation";
import { extractDateFromSAID, extractGenderFromSAID } from "@/lib/mockData";

export interface IDNumberStepProps {
  formData: FormDataType;
  variants: MotionVariantsType;
  validationRef: React.MutableRefObject<() => boolean>;
  handleSelectChange: (name: string, value: string) => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<RegistrationFormStep>>;
}

export default function IDNumberStep(props: IDNumberStepProps) {
  const {
    formData,
    variants,
    validationRef,
    handleSelectChange,
    setCurrentStep,
  } = props;

  const [dialogError, setDialogError] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    additional: JSX.Element;
  }>();

  const { errors, isVerifying, startVerification } = useIDVerification({
    idNumber: formData.idNumber,
    onSuccess: (data) => {
      handleSelectChange("province", data.provinceID);
      handleSelectChange("municipality", data.municipalityID);
      handleSelectChange("ward", data.wardId);
      handleSelectChange("votingStation", data.votingStationId);
      handleSelectChange("gender", extractGenderFromSAID(formData.idNumber));
      handleSelectChange("dateOfBirth", extractDateFromSAID(formData.idNumber));
      setCurrentStep((prev) => prev + 1);
    },
    onError: (message) => {
      setDialogError({
        isOpen: true,
        title: "Error Registration Status",
        message: undefined,
        additional: (
          <div className="text-sm text-muted-foreground mt-2">
            {message}
            <p className="mt-2 font-bold">
              Please try again or contact support if the problem persists.
            </p>
          </div>
        ),
      });
    },
  });

  const handleVerification = () => {
    const isValid = startVerification(formData);
    validationRef.current = () => isValid;
  };

  const isValid = validationRef.current?.();

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
          <IdCard size={22} className="mr-2 text-primary-500" /> ID Number
        </h2>
        <p className="text-mkneutral-500">Please enter your ID number</p>
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
              onChange={(e) => handleSelectChange("idNumber", e.target.value)}
              className={`form-input rounded-xl bg-cream-50 border-mkneutral-200 shadow-sm ${
                errors.idNumber ? "border-red-500 ring-1 ring-red-500" : ""
              }`}
              placeholder="Enter your ID number"
              maxLength={13}
            />
            {isValid && (
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
          {isValid && (
            <p className="text-xs text-green-500 flex items-center mt-1">
              <Check size={12} className="mr-1" /> ID Number validated
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          onClick={handleVerification}
          disabled={isVerifying}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying ...
            </>
          ) : (
            <>
              Verify
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <ErrorPopupDialog
        open={dialogError?.isOpen || false}
        message={undefined!}
        title={dialogError?.message || ""}
        onClose={() => setDialogError(undefined)}
        onAction={() => {
          console.log("Retry action triggered");
          setDialogError(undefined);
          handleVerification();
        }}
        additionalContent={dialogError?.additional}
      />
    </motion.div>
  );
}

export interface UseIDVerificationProps {
  idNumber: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
}

export const useIDVerification = ({
  idNumber,
  onSuccess,
  onError,
}: UseIDVerificationProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const votingStationRequest = useGetVotingStationByIdRequest(
    idNumber,
    isVerifying
  );

  useEffect(() => {
    if (votingStationRequest.error && isVerifying) {
      let message = (votingStationRequest?.error as any)?.body?.message;
      if (message?.includes("Checksum")) {
        message = "Invalid ID Number provided, please double check.";
      }
      setIsVerifying(false);
      onError(message);
    }
  }, [votingStationRequest.error, isVerifying, onError]);

  useEffect(() => {
    if (
      votingStationRequest.isSuccess &&
      votingStationRequest.data &&
      isVerifying
    ) {
      setIsVerifying(false);
      onSuccess(votingStationRequest.data.data);
    }
  }, [
    votingStationRequest.isSuccess,
    votingStationRequest.data,
    isVerifying,
    onSuccess,
  ]);

  const validateID = (formData: FormDataType) => {
    const newErrors = validateIDNumber(formData, true);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startVerification = (formData: FormDataType) => {
    const isValid = validateID(formData);
    if (isValid) {
      setIsVerifying(true);
    }
    return isValid;
  };

  return {
    errors,
    isVerifying: votingStationRequest.isLoading,
    startVerification,
  };
};

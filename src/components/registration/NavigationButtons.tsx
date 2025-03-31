import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from "lucide-react";

export interface NavigationButtonsProps {
  isLoading: boolean;
  hasPrevious: boolean;
  customPrevText?: string;
  handlePrevious: () => void;
  hasNext: boolean;
  customNextText?: string;
  handleNext: () => void;
  hasSubmit: boolean;
  submitText?: string;
  submitTextLoading?: string;
  submitIcon?: React.ReactNode;
  handleSubmit: () => void;
}

const NavigationButtons = (props: NavigationButtonsProps) => {
  const {
    isLoading = false,
    hasPrevious = true,
    customPrevText,
    handlePrevious,
    hasNext = true,
    customNextText,
    handleNext,
    hasSubmit = true,
    submitText = "Submit",
    submitTextLoading = "Submitting",
    submitIcon = <CheckCircle className="ml-2 h-4 w-4" />,
    handleSubmit,
  } = props;

  const applyJustifyBetween =
    (hasPrevious && hasNext) || (hasPrevious && hasSubmit);
  return (
    <div
      className={cn(
        "mt-8 flex",
        applyJustifyBetween ? "justify-between" : "justify-end"
      )}
    >
      {hasPrevious && (
        <Button
          type="button"
          disabled={isLoading}
          onClick={handlePrevious}
          className="bg-mkneutral-100 text-mkneutral-700 hover:bg-mkneutral-200"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />{" "}
          {customPrevText ?? "Previous"}
        </Button>
      )}

      {hasNext && (
        <Button
          type="button"
          onClick={handleNext}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          {customNextText ?? "Next"} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {hasSubmit && (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          {isLoading && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
              {submitTextLoading}
            </>
          )}

          {!isLoading && (
            <>
              {submitText}
              {submitIcon}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;

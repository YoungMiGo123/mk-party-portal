
import { ChevronLeft, ChevronRight, DollarSign, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isLoading: boolean;
  isPaymentComplete?: boolean;
  handleCompleteRegistration?: () => void;
}

const NavigationButtons = ({
  currentStep,
  totalSteps,
  handlePrevious,
  handleNext,
  isLoading,
  isPaymentComplete = false,
  handleCompleteRegistration,
}: NavigationButtonsProps) => {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 0 ? (
        <Button
          type="button"
          onClick={handlePrevious}
          className="bg-mkneutral-100 text-mkneutral-700 hover:bg-mkneutral-200"
          disabled={isLoading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
      ) : (
        <div></div> // Empty div to maintain layout
      )}
      
      {currentStep < totalSteps - 1 ? (
        <Button
          type="button"
          onClick={handleNext}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button" 
          onClick={handleCompleteRegistration || handleNext}
          disabled={isLoading}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
            </>
          ) : (
            <>
              Complete Registration <DollarSign className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;

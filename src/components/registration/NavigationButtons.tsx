
import { ChevronLeft, ChevronRight, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  handlePrevious: () => void;
  handleNext: () => void;
  isLoading: boolean;
}

const NavigationButtons = ({
  currentStep,
  totalSteps,
  handlePrevious,
  handleNext,
  isLoading,
}: NavigationButtonsProps) => {
  return (
    <div className="mt-8 flex justify-between">
      {currentStep > 0 ? (
        <Button
          type="button"
          onClick={handlePrevious}
          className="bg-mkneutral-100 text-mkneutral-700 hover:bg-mkneutral-200"
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
          type="submit"
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

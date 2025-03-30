import { Check } from "lucide-react";

export type Step = {
  index: number;
  icon: JSX.Element;
  title: string;
};

export interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="flex justify-between mb-8 md:mb-12 overflow-hidden rounded-xl shadow-md bg-white border border-mkneutral-100">
      {steps.map((step, index) => (
        <div
          key={step.index}
          className={`flex-1 flex items-center justify-center py-4 px-2 text-sm font-medium transition-all duration-300
            ${
              currentStep === index
                ? "bg-primary-50 text-primary-700 border-b-2 border-primary-500"
                : currentStep > index
                ? "bg-cream-50 text-primary-600"
                : "bg-cream-50 text-mkneutral-500"
            }
            ${index > 0 && "border-l border-mkneutral-100"}
          `}
        >
          <div className="hidden sm:flex sm:items-center">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 
              ${
                currentStep === index
                  ? "bg-primary-100 text-primary-600"
                  : currentStep > index
                  ? "bg-primary-600 text-white"
                  : "bg-mkneutral-100 text-mkneutral-500"
              }`}
            >
              {currentStep > index ? <Check size={14} /> : index + 1}
            </span>
            {step.title}
          </div>
          <div className="sm:hidden flex flex-col items-center">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
              ${
                currentStep === index
                  ? "bg-primary-100 text-primary-600"
                  : currentStep > index
                  ? "bg-primary-600 text-white"
                  : "bg-mkneutral-100 text-mkneutral-500"
              }`}
            >
              {currentStep > index ? <Check size={14} /> : step.icon}
            </span>
            <span className="text-xs">{step.title.split(" ")[0]}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;

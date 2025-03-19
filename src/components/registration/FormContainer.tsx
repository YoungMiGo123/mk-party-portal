
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return (
    <Card className="shadow-lg border-mkneutral-200 overflow-hidden rounded-xl">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-5 text-center">
        <h2 className="text-xl text-white font-medium">
          Complete Your Registration
        </h2>
      </div>
      <div className="p-6 md:p-8">
        <div className="text-center mb-6">
          <p className="text-mkneutral-600">Please fill out the information below to create your membership</p>
        </div>
        {children}
      </div>
    </Card>
  );
};

export default FormContainer;

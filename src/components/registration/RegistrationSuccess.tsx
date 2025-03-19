
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RegistrationSuccessProps {
  formData: any;
  handleLoginAfterPayment: () => void;
}

const RegistrationSuccess = ({ formData, handleLoginAfterPayment }: RegistrationSuccessProps) => {
  return (
    <Card className="shadow-lg border-mkneutral-200 overflow-hidden rounded-xl">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl text-white font-medium">
          Registration Complete
        </h2>
      </div>
      <div className="p-8 text-center">
        <p className="text-xl font-medium text-mkneutral-700 mb-3">Thank you for joining!</p>
        <p className="text-mkneutral-500 mb-8">
          Your membership registration has been successfully processed. You can now access your dashboard and benefits.
        </p>
        
        <div className="max-w-md mx-auto p-6 bg-cream-50 rounded-xl mb-8">
          <h3 className="text-lg font-medium text-mkneutral-800 mb-4">Registration Details</h3>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Name:</span>
              <span className="font-medium">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Email:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Membership Type:</span>
              <span className="font-medium">{formData.membershipType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Payment Method:</span>
              <span className="font-medium">{formData.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleLoginAfterPayment}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-full"
        >
          Go to Dashboard
        </Button>
      </div>
    </Card>
  );
};

export default RegistrationSuccess;

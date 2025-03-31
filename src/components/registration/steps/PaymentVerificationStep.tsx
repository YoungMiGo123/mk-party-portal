import { motion } from "framer-motion";
import { Check, CreditCard, DollarSign, XOctagon } from "lucide-react";
import { FormDataType } from "../RegisterForm";
import { MotionVariantsType } from "../registerUtils";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePostRegisterRequest } from "@/api/auth/register";
import { usePostPaymentInitializationRequest } from "@/api/payment/initialize";
import { toast } from "@/hooks/use-toast";
import {
  PaymentVerificationData,
  usePaymentVerificationPolling,
} from "@/api/payment/verify";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export interface PaymentVerificationStepProps {
  formData: FormDataType;
  variants: MotionVariantsType;
}

export default function PaymentVerificationStep(
  props: PaymentVerificationStepProps
) {
  const { formData, variants } = props;
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const registerRequest = usePostRegisterRequest();
  const paymentInitializationRequest = usePostPaymentInitializationRequest();
  const paymentVerificationRequest = usePaymentVerificationPolling(
    paymentInitializationRequest.data?.data.reference,
    isPaymentComplete
  );

  useEffect(() => {
    registerAndInitializePayment();
  }, []);

  const registerAndInitializePayment = async () => {
    const requestResut = await registerRequest.mutateAsync({
      idNumber: formData.idNumber,
      email: formData.email,
      cellphone: formData.cellphone,
      name: formData.firstName,
      surname: formData.lastName,
      dateofBirth: formData.dateOfBirth,
      gender: formData.gender,
      race: formData.race,
      language: formData.language,
      nationality: formData.nationality,
      employmentStatus: formData.employmentStatus,
      occupation: formData.occupation,
      disability: formData.disability === "Yes" ? true : false,
      residentialAddress: formData.address,
      addressLine2: formData.addressLine2,
      postalCode: formData.postalCode,
      provinceId: formData.province,
      municipalityId: formData.municipality,
      wardId: formData.ward,
      votingStationId: formData.votingStation,
      subscriptionId: formData.membershipType,
      acceptedMembershipOAuthDeclaration: formData.acceptTerms,
      donationAmount: Number(formData.paymentAmount),
      recieveEventCommunicationAndUpdates: formData.emailConfirmation,
    });

    if (!requestResut.successful) {
      toast({
        title: "Registration Failed",
        description: "Registration could not be completed.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Registration in Progress",
      description:
        "We're processing your registration and payment. You'll receive a confirmation shortly.",
    });

    const paymentResult = await paymentInitializationRequest.mutateAsync({
      subscriptionId: formData.membershipType,
      idNumber: formData.idNumber,
      email: formData.email,
    });

    if (!paymentResult.successful) {
      toast({
        title: "Payment Initialization Failed",
        description: "Payment could not be initialized.",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {registerRequest.isPending ||
      paymentInitializationRequest.isPending ||
      paymentVerificationRequest.isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spinner />
          <p className="text-mkneutral-500">Processing ...</p>
        </div>
      ) : undefined}
      {!isPaymentComplete &&
      paymentInitializationRequest.isSuccess &&
      paymentInitializationRequest.data?.data ? (
        <LoadIFramePaymentGateway
          url={paymentInitializationRequest.data?.data?.authorizationUrl}
          reference={paymentInitializationRequest.data?.data?.reference}
          setIsPaymentComplete={setIsPaymentComplete}
        />
      ) : undefined}
      {!paymentVerificationRequest.isLoading &&
      paymentVerificationRequest.isSuccess &&
      paymentVerificationRequest.data?.data ? (
        <ShowPaymentStatus
          formData={formData}
          paymentVerificationData={paymentVerificationRequest.data?.data}
        />
      ) : undefined}
      {paymentVerificationRequest.isError ? (
        <>
          <div className="flex flex-col items-center justify-center space-y-4">
            <XOctagon className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl text-red-500 font-medium">
              Payment Verification Failed
            </h2>
            <p className="text-mkneutral-500 mb-8">
              Your payment could not be verified. Please try again later.
            </p>
            <p className="text-mkneutral-500 mb-8">
              If the problem persists, please contact support.
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                paymentVerificationRequest.refetch();
              }}
              disabled={paymentVerificationRequest.isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Try Again <DollarSign className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : undefined}
    </motion.div>
  );
}

interface LoadIFramePaymentGatewayProps {
  url: string;
  reference: string;
  setIsPaymentComplete: (isPaymentComplete: boolean) => void;
}

function LoadIFramePaymentGateway(props: LoadIFramePaymentGatewayProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.data?.status === "success" &&
        event.data?.data?.trxref === props.reference
      ) {
        console.log("event.data?.data? : ", event.data?.data);
        props.setIsPaymentComplete(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
          <CreditCard size={22} className="mr-2 text-primary-500" /> Complete
          Payment
        </h2>
        <p className="text-mkneutral-500">Please complete your payment</p>
      </div>

      <div className="space-y-4">
        <div className="w-full h-[500px] border rounded-md overflow-hidden bg-white">
          <iframe
            ref={iframeRef}
            src={props.url}
            className="w-full h-full"
            title="Payment Gateway"
          />
        </div>
      </div>
    </>
  );
}

interface ShowPaymentStatusProps {
  formData: FormDataType;
  paymentVerificationData: PaymentVerificationData;
}

function ShowPaymentStatus(props: ShowPaymentStatusProps) {
  const { formData, paymentVerificationData } = props;
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-6 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
          <Check className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl text-white font-medium">
          Registration & Payment Complete
        </h2>
      </div>

      <div className="p-8 text-center">
        <p className="text-xl font-medium text-mkneutral-700 mb-3">
          Thank you for joining!
        </p>
        <p className="text-mkneutral-500 mb-8">
          Your membership registration has been successfully processed. You can
          now access your dashboard and benefits.
        </p>

        <div className="max-w-md mx-auto p-6 bg-cream-50 rounded-xl mb-8">
          <h3 className="text-lg font-medium text-mkneutral-800 mb-4">
            Registration Details
          </h3>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Name:</span>
              <span className="font-medium">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Email:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Membership Type:</span>
              <span className="font-medium">Basic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Payment Method:</span>
              <span className="font-medium">{formData.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Payment Ref:</span>
              <span className="font-medium">
                {paymentVerificationData.reference}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-mkneutral-500">Payment Status:</span>
              <span className="font-medium">
                {paymentVerificationData.status}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            navigate("/login");
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-2.5 rounded-full"
        >
          Go to Login
        </Button>
      </div>
    </>
  );
}

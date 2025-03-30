import {
  IdCard,
  User,
  Bookmark,
  FileCheck,
  Check,
  CreditCard,
  ShieldCheck,
  DollarSign,
} from "lucide-react";
import { useRef, useState } from "react";
import DevModeToggle from "./DevModeToggle";
import ProgressSteps, { Step } from "./ProgressSteps";
import FormContainer from "./FormContainer";
import NavigationButtons from "./NavigationButtons";
import IDNumberStep from "./steps/IDNumberStep";
import { motionVariants } from "./registerUtils";
import PersonalDetailsStep from "./steps/PersonalDetailsStep";
import ContactDetailsStep from "./steps/ContactDetailsStep";
import MembershipDetailsStep from "./steps/MembershipDetailsStep";
import MembershipOathStep from "./steps/MembershipOathStep";
import PaymentDetailsStep from "./steps/PaymentDetailsStep";
import PaymentVerificationStep from "./steps/PaymentVerificationStep";

const iconSize = 20;

export enum RegistrationFormStep {
  IDNumber = 0,
  PersonalDetails = 1,
  ContactDetails = 2,
  MembershipDetails = 3,
  MembershipOath = 4,
  PaymentDetails = 5,
  Verification = 6,
}

const steps: Step[] = [
  {
    index: RegistrationFormStep.IDNumber,
    icon: <IdCard size={iconSize} />,
    title: "ID Number",
  },
  {
    index: RegistrationFormStep.PersonalDetails,
    icon: <User size={iconSize} />,
    title: "Personal Details",
  },
  {
    index: RegistrationFormStep.ContactDetails,
    icon: <Bookmark size={iconSize} />,
    title: "Contact Details",
  },
  {
    index: RegistrationFormStep.MembershipDetails,
    icon: <FileCheck size={iconSize} />,
    title: "Membership Details",
  },
  {
    index: RegistrationFormStep.MembershipOath,
    icon: <Check size={iconSize} />,
    title: "Membership Oath",
  },
  {
    index: RegistrationFormStep.PaymentDetails,
    icon: <CreditCard size={iconSize} />,
    title: "Payment Details",
  },
  {
    index: RegistrationFormStep.Verification,
    icon: <ShieldCheck size={iconSize} />,
    title: "Verification",
  },
];

function useValidationRefs() {
  return steps.map(() => useRef<() => boolean>(() => false));
}

export default function RegisterForm() {
  const validationRefs = useValidationRefs();
  const [currentStep, setCurrentStep] = useState<RegistrationFormStep>(0);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
  };

  const FormSteps = [
    <IDNumberStep
      formData={formData}
      variants={motionVariants}
      validationRef={validationRefs[currentStep]}
      setCurrentStep={setCurrentStep}
      handleSelectChange={handleSelectChange}
    />,
    <PersonalDetailsStep
      formData={formData}
      variants={motionVariants}
      validationRef={validationRefs[currentStep]}
      handleSelectChange={handleSelectChange}
    />,
    <ContactDetailsStep
      formData={formData}
      variants={motionVariants}
      validationRef={validationRefs[currentStep]}
      handleSelectChange={handleSelectChange}
      handleCheckboxChange={handleCheckboxChange}
    />,
    <MembershipDetailsStep
      formData={formData}
      variants={motionVariants}
      validationRef={validationRefs[currentStep]}
      handleSelectChange={handleSelectChange}
    />,
    <MembershipOathStep
      formData={formData}
      variants={motionVariants}
      validationRef={validationRefs[currentStep]}
      handleCheckboxChange={handleCheckboxChange}
    />,
    <PaymentDetailsStep
      formData={formData}
      variants={motionVariants}
      validationRef={validationRefs[currentStep]}
      handleSelectChange={handleSelectChange}
    />,
    <PaymentVerificationStep formData={formData} variants={motionVariants} />,
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <RegistrationDevModeToggle setFormData={setFormData} />

      <ProgressSteps steps={steps} currentStep={currentStep} />

      <FormContainer
        heading="Complete Your Registration"
        description="Please fill out the information below to create your membership"
      >
        <form onSubmit={undefined!}>
          {FormSteps[currentStep]}

          <RegisterationNavigationButtons
            isLoading={false}
            currentStep={currentStep}
            validationRefs={validationRefs}
            setCurrentStep={setCurrentStep}
            handleSubmit={handleSubmit}
          />
        </form>
      </FormContainer>
    </div>
  );
}

interface RegistrationDevModeToggleProps {
  setFormData: (data: any) => void;
}

function RegistrationDevModeToggle(props: RegistrationDevModeToggleProps) {
  const [devMode, setDevMode] = useState(true);

  const toggleDevMode = (enabled: boolean) => {
    if (!enabled) {
      props.setFormData(devModeData);
    } else {
      props.setFormData({ ...initialFormData });
    }
    setDevMode(enabled);
  };

  return <DevModeToggle devMode={devMode} toggleDevMode={toggleDevMode} />;
}

interface RegisterationNavigationButtonsProps {
  isLoading?: boolean;
  currentStep: RegistrationFormStep;
  validationRefs: React.MutableRefObject<() => boolean>[];
  setCurrentStep: React.Dispatch<React.SetStateAction<RegistrationFormStep>>;
  handleSubmit: () => void;
}

function RegisterationNavigationButtons(
  props: RegisterationNavigationButtonsProps
) {
  const { isLoading, currentStep, setCurrentStep, handleSubmit } = props;

  const handleNext = () => {
    const isValid = props.validationRefs[currentStep]?.current?.() ?? false;
    if (isValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        return nextStep < RegistrationFormStep.Verification
          ? nextStep
          : RegistrationFormStep.Verification;
      });
    }
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep((prev) => {
      const prevStep = prev - 1;
      return prevStep >= RegistrationFormStep.IDNumber
        ? prevStep
        : RegistrationFormStep.IDNumber;
    });
  };

  return (
    <NavigationButtons
      isLoading={isLoading}
      hasPrevious={currentStep > RegistrationFormStep.IDNumber}
      handlePrevious={handlePrevious}
      hasNext={
        currentStep != RegistrationFormStep.IDNumber &&
        currentStep < RegistrationFormStep.Verification
      }
      customNextText={
        currentStep === RegistrationFormStep.PaymentDetails
          ? "Proceed to Payment"
          : undefined
      }
      handleNext={handleNext}
      hasSubmit={false}
      submitText="Complete"
      submitTextLoading="Processing..."
      submitIcon={<DollarSign className="ml-2 h-4 w-4" />}
      handleSubmit={handleSubmit}
    />
  );
}
export interface FormDataType {
  idNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  race: string;
  language: string;
  nationality: string;
  employmentStatus: string;
  occupation: string;
  disability: string;
  email: string;
  cellphone: string;
  address: string;
  addressLine2: string;
  postalCode: string;
  province: string;
  municipality: string;
  ward: string;
  votingStation: string;
  emailConfirmation: boolean;
  membershipType: string;
  acceptTerms: boolean;
  paymentMethod: string;
  paymentAmount: string;
  photoUrl: string;
  paymentCompleted: boolean;
  minimumDonationAmount: string;
}

export const devModeData = {
  idNumber: "0001025205087",
  firstName: "Masilakhe",
  lastName: "Sukwana",
  dateOfBirth: "2000-01-02",
  gender: "Male",
  race: "African",
  language: "IsiXhosa",
  nationality: "South Africa",
  employmentStatus: "Unemployed",
  occupation: "",
  disability: "No",
  email: "Sukwanamasilakhe1977@gmail.com",
  cellphone: "0737504787",
  address: "20123 Mpozolo Street Philippi Cape Town",
  addressLine2: "",
  postalCode: "7750",
  province: "008ae377-9a9c-4bf2-87f0-d6fb643b7444", // "Western Cape"
  municipality: "1c1d0898-3545-4308-ba3d-e570ccfabbb3", // "CPT - City of Cape Town"
  ward: "7ddca064-38c2-4f32-a42b-eda9f6bc934e", // "Ward 10"
  votingStation: "4b89d296-9688-4ca6-9946-ee8618570626", //"BONGOLWETHU PRIMARY SCHOOL"
  emailConfirmation: true,
  membershipType: "d631206d-4cb0-41e8-b652-ce6330b19bdf", // "Basic",
  acceptTerms: true,
  paymentMethod: "EFT",
  paymentAmount: "10",
  photoUrl: "",
  paymentCompleted: false,
  minimumDonationAmount: "10",
};

const initialFormData = {
  idNumber: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  race: "",
  language: "",
  nationality: "",
  employmentStatus: "",
  occupation: "",
  disability: "No",
  email: "",
  cellphone: "",
  address: "",
  addressLine2: "",
  postalCode: "",
  province: "",
  municipality: "",
  ward: "",
  votingStation: "",
  emailConfirmation: true,
  membershipType: "Standard",
  acceptTerms: false,
  paymentMethod: "EFT",
  paymentAmount: "100",
  minimumDonationAmount: "20",
  photoUrl: "",
  paymentCompleted: false,
};

import { isAllDigits } from "@/utilities/utils";

// Sample data for dev mode
export const devModeData = {
  idNumber: "0001025205087",
  firstName: "Masilakhe",
  lastName: "Sukwana",
  dateOfBirth: "2000-01-02",
  gender: "Male",
  race: "Black",
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

// Initial form data state
export const initialFormData = {
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

// Steps in the registration process
export const registrationSteps = [
  "ID Number",
  "Personal Details",
  "Contact Details",
  "Membership Details",
  "Membership Oath",
  "Registration Payment",
];

// Validation functions

export const validateIDNumber = (formData: any, validationEnabled: boolean) => {
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};

  if (!formData.idNumber) errors.idNumber = "ID Number is required";

  if (formData.idNumber.length !== 13)
    errors.idNumber = "ID Number must be 13 digits";

  if (!isAllDigits(formData.idNumber)) {
    errors.idNumber = "ID Number must contain only digits";
  }

  return errors;
};

export const validatePersonalDetails = (
  formData: any,
  validationEnabled: boolean
) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};

  if (!formData.idNumber) errors.idNumber = "ID Number is required";
  else if (formData.idNumber.length !== 13)
    errors.idNumber = "ID Number must be 13 digits";

  if (!formData.firstName) errors.firstName = "First Name is required";
  if (!formData.lastName) errors.lastName = "Last Name is required";
  if (!formData.dateOfBirth) errors.dateOfBirth = "Date of Birth is required";
  if (!formData.gender) errors.gender = "Gender is required";
  if (!formData.race) errors.race = "Race is required";
  if (!formData.language) errors.language = "Language is required";
  if (!formData.nationality) errors.nationality = "Nationality is required";
  if (!formData.employmentStatus)
    errors.employmentStatus = "Employment Status is required";

  return errors;
};

export const validateContactDetails = (
  formData: any,
  validationEnabled: boolean
) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};

  if (!formData.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Email is invalid";

  if (!formData.cellphone) errors.cellphone = "Cellphone Number is required";
  else if (!/^0\d{9}$/.test(formData.cellphone))
    errors.cellphone = "Cellphone must be 10 digits starting with 0";

  if (!formData.address) errors.address = "Address is required";

  return errors;
};

export const validateMembershipDetails = (
  formData: any,
  validationEnabled: boolean
) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};

  if (!formData.membershipType)
    errors.membershipType = "Membership Type is required";

  return errors;
};

export const validateMembershipOath = (
  formData: any,
  validationEnabled: boolean
) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};

  if (!formData.acceptTerms)
    errors.acceptTerms = "You must accept the membership oath declaration";

  return errors;
};

export const validatePayment = (formData: any, validationEnabled: boolean) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};

  const minimumDonationAmount = parseFloat(formData.minimumDonationAmount);
  if (
    !formData.paymentAmount ||
    parseFloat(formData.paymentAmount) < minimumDonationAmount
  ) {
    errors.paymentAmount = `Donation amount must be at least R${minimumDonationAmount}`;
  }

  return errors;
};

// Motion variants for animation
export const motionVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export type MotionVariantsType = typeof motionVariants;

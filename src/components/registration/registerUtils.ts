
// Sample data for dev mode
export const devModeData = {
  idNumber: "9001015800083",
  firstName: "John",
  lastName: "Developer",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  race: "White",
  language: "English",
  nationality: "South African",
  employmentStatus: "Employed",
  occupation: "Software Developer",
  disability: "No",
  email: "dev@example.com",
  cellphone: "0721234567",
  address: "123 Dev Street",
  addressLine2: "Silicon Valley",
  postalCode: "2000",
  province: "Gauteng",
  municipality: "Johannesburg Metro",
  ward: "Ward 123",
  votingStation: "Central Library",
  emailConfirmation: true,
  membershipType: "Standard",
  acceptTerms: true,
  paymentMethod: "EFT",
  paymentAmount: "100",
  photoUrl: "",
  paymentCompleted: false,
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
  photoUrl: "",
  paymentCompleted: false,
};

// Steps in the registration process
export const registrationSteps = [
  "Personal Details",
  "Contact Details",
  "Membership Details",
  "Membership Oath",
  "Registration Payment",
];

// Validation functions
export const validatePersonalDetails = (formData: any, validationEnabled: boolean) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};
  
  if (!formData.idNumber) errors.idNumber = "ID Number is required";
  else if (formData.idNumber.length !== 13) errors.idNumber = "ID Number must be 13 digits";
  
  if (!formData.firstName) errors.firstName = "First Name is required";
  if (!formData.lastName) errors.lastName = "Last Name is required";
  if (!formData.dateOfBirth) errors.dateOfBirth = "Date of Birth is required";
  if (!formData.gender) errors.gender = "Gender is required";
  if (!formData.race) errors.race = "Race is required";
  if (!formData.language) errors.language = "Language is required";
  if (!formData.nationality) errors.nationality = "Nationality is required";
  if (!formData.employmentStatus) errors.employmentStatus = "Employment Status is required";
  
  return errors;
};

export const validateContactDetails = (formData: any, validationEnabled: boolean) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};
  
  if (!formData.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
  
  if (!formData.cellphone) errors.cellphone = "Cellphone Number is required";
  else if (!/^0\d{9}$/.test(formData.cellphone)) errors.cellphone = "Cellphone must be 10 digits starting with 0";
  
  if (!formData.address) errors.address = "Address is required";
  
  return errors;
};

export const validateMembershipDetails = (formData: any, validationEnabled: boolean) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};
  
  if (!formData.membershipType) errors.membershipType = "Membership Type is required";
  
  return errors;
};

export const validateMembershipOath = (formData: any, validationEnabled: boolean) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};
  
  if (!formData.acceptTerms) errors.acceptTerms = "You must accept the membership oath declaration";
  
  return errors;
};

export const validatePayment = (formData: any, validationEnabled: boolean) => {
  // Skip validation if disabled
  if (!validationEnabled) {
    return {};
  }

  const errors: Record<string, string> = {};
  
  if (!formData.paymentAmount || parseFloat(formData.paymentAmount) < 20) {
    errors.paymentAmount = "Donation amount must be at least R20";
  }
  
  return errors;
};

// Motion variants for animation
export const motionVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

import { User } from "@/store/authStore";
import { getEnumValues, Province } from "@/utilities/enums";

// Mock member users for admin panel
export const mockMembers: User[] = [
  {
    id: "1",
    name: "John",
    surname: "Doe",
    email: "john.doe@example.com",
    idNumber: "8501015800085",
    cellphone: "0731234567",
    dateOfBirth: "1985-01-01",
    gender: "Male",
    race: "African",
    language: "English",
    nationality: "South African",
    employmentStatus: "Employed",
    occupation: "Software Developer",
    disability: "No",
    address: "123 Main St, Johannesburg, Gauteng",
    membershipType: "Premium",
    membershipNumber: "MK10001",
    province: "Gauteng",
    ward: "Ward 42",
    votingStation: "Sandton Community Center",
    joinDate: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    name: "Sarah",
    surname: "Johnson",
    email: "sarah.j@example.com",
    idNumber: "9203025800085",
    cellphone: "0827654321",
    dateOfBirth: "1992-03-02",
    gender: "Female",
    race: "Coloured",
    language: "Afrikaans",
    nationality: "South African",
    employmentStatus: "Self-employed",
    occupation: "Business Owner",
    disability: "No",
    address: "456 Oak Avenue, Cape Town, Western Cape",
    membershipType: "Premium",
    membershipNumber: "MK10002",
    province: "Western Cape",
    ward: "Ward 23",
    votingStation: "Cape Town City Hall",
    joinDate: "2023-10-05",
  },
  {
    id: "3",
    name: "Thabo",
    surname: "Mbeki",
    email: "thabo.m@example.com",
    idNumber: "7805125800085",
    cellphone: "0631234567",
    dateOfBirth: "1978-05-12",
    gender: "Male",
    race: "African",
    language: "Zulu",
    nationality: "South African",
    employmentStatus: "Employed",
    occupation: "Teacher",
    disability: "No",
    address: "789 Baobab Street, Durban, KwaZulu-Natal",
    membershipType: "Standard",
    membershipNumber: "MK10003",
    province: "KwaZulu-Natal",
    ward: "Ward 15",
    votingStation: "Durban Central School",
    joinDate: "2023-08-22",
  },
  {
    id: "4",
    name: "Priya",
    surname: "Naidoo",
    email: "priya.n@example.com",
    idNumber: "8904125800085",
    cellphone: "0845678901",
    dateOfBirth: "1989-04-12",
    gender: "Female",
    race: "Indian",
    language: "English",
    nationality: "South African",
    employmentStatus: "Employed",
    occupation: "Doctor",
    disability: "No",
    address: "101 Hospital Road, Pretoria, Gauteng",
    membershipType: "Premium",
    membershipNumber: "MK10004",
    province: "Gauteng",
    ward: "Ward 5",
    votingStation: "Pretoria Central Hospital",
    joinDate: "2023-11-10",
  },
  {
    id: "5",
    name: "Willem",
    surname: "van der Merwe",
    email: "willem.v@example.com",
    idNumber: "7510105800085",
    cellphone: "0761234567",
    dateOfBirth: "1975-10-10",
    gender: "Male",
    race: "White",
    language: "Afrikaans",
    nationality: "South African",
    employmentStatus: "Employed",
    occupation: "Accountant",
    disability: "No",
    address: "222 Farm Road, Bloemfontein, Free State",
    membershipType: "Standard",
    membershipNumber: "MK10005",
    province: "Free State",
    ward: "Ward 8",
    votingStation: "Bloemfontein City Hall",
    joinDate: "2023-07-30",
  },
];

// Mock upcoming events for dashboard
export const mockEvents = [
  {
    id: "1",
    title: "MK Party Rally",
    date: "2023-12-15",
    time: "14:00",
    location: "Johannesburg Stadium",
    description:
      "Join us for our largest rally of the year. Meet party leadership and hear about our vision for South Africa.",
  },
  {
    id: "2",
    title: "Community Outreach",
    date: "2023-12-20",
    time: "09:00",
    location: "Soweto Community Center",
    description:
      "Help us give back to the community. We'll be distributing supplies and registering new voters.",
  },
  {
    id: "3",
    title: "Policy Discussion",
    date: "2024-01-05",
    time: "18:30",
    location: "Virtual Meeting",
    description:
      "Online discussion about our policy proposals for economic development and job creation.",
  },
];

// Mock polls/surveys for dashboard
export const mockPolls = [
  {
    id: "1",
    question: "What issue matters most to you?",
    options: [
      "Education",
      "Healthcare",
      "Economy",
      "Crime",
      "Infrastructure",
      "Other",
    ],
    endDate: "2023-12-31",
  },
  {
    id: "2",
    question: "Which MK Party initiative would you like to see expanded?",
    options: [
      "Youth Development Programs",
      "Small Business Support",
      "Community Safety",
      "Environmental Protection",
    ],
    endDate: "2024-01-15",
  },
  {
    id: "3",
    question: "How would you rate your experience with our party so far?",
    options: ["Excellent", "Good", "Average", "Needs Improvement"],
    endDate: "2023-12-20",
  },
];

// Mock form data options
export const mockOptions = {
  genders: ["Male", "Female", "Other", "Prefer not to say"],
  races: ["African", "White", "Coloured", "Indian", "Asian", "Other"],
  languages: [
    "English",
    "Afrikaans",
    "Zulu",
    "Xhosa",
    "Sotho",
    "Tswana",
    "Venda",
    "Tsonga",
    "Swati",
    "Ndebele",
    "Other",
  ],
  nationalities: ["South African", "Other"],
  employmentStatuses: [
    "Employed",
    "Self-employed",
    "Unemployed",
    "Student",
    "Retired",
    "Other",
  ],
  disabilities: ["No", "Yes"],
  membershipTypes: [
    { value: "Standard", label: "Standard Membership" },
    { value: "Premium", label: "Premium Membership" },
    { value: "Volunteer", label: "Volunteer Member" },
  ],
  provinces: getEnumValues(Province),
  municipalities: [
    "Johannesburg Metro",
    "Cape Town Metro",
    "eThekwini Metro",
    "Tshwane Metro",
    "Ekurhuleni Metro",
    "Buffalo City",
    "Mangaung",
    "Nelson Mandela Bay",
    "Other Local Municipality",
    "JHB - City of Johannesburg",
  ],
  paymentMethods: [
    { value: "EFT", label: "Bank Transfer/EFT" },
    { value: "CreditCard", label: "Credit/Debit Card" },
    { value: "Cash", label: "Cash Deposit" },
  ],
};

// Helper function to extract date of birth from South African ID number
export const extractDateFromSAID = (idNumber: string): string | null => {
  if (!idNumber || idNumber.length !== 13) {
    return null;
  }

  try {
    const year = idNumber.substring(0, 2);
    const month = idNumber.substring(2, 4);
    const day = idNumber.substring(4, 6);

    // Determine century (1900s or 2000s)
    const currentYear = new Date().getFullYear();
    const century = parseInt(year) > currentYear % 100 ? "19" : "20";

    const fullYear = `${century}${year}`;

    // Format as YYYY-MM-DD
    return `${fullYear}-${month}-${day}`;
  } catch (error) {
    console.error("Error extracting date from ID:", error);
    return null;
  }
};

// Helper function to extract gender from South African ID number
export const extractGenderFromSAID = (idNumber: string): string | null => {
  if (!idNumber || idNumber.length !== 13) {
    return null;
  }

  try {
    // Gender is determined by the 7th digit (positions 6-9)
    // 0-4: Female, 5-9: Male
    const genderDigit = parseInt(idNumber.substring(6, 10));
    return genderDigit < 5000 ? "Female" : "Male";
  } catch (error) {
    console.error("Error extracting gender from ID:", error);
    return null;
  }
};

// Generate a mock membership number
export const generateMembershipNumber = (): string => {
  const prefix = "MK";
  const number = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${number}`;
};

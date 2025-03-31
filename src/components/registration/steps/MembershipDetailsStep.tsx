import { motion } from "framer-motion";
import { FileCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetVotingStationSelectOptionsRequest } from "@/api/member-details/votingStation";
import { useGetAllSubscriptionsRequest } from "@/api/member-details/allSubscriptions";
import { Select } from "@/components/select/Select";
import SearchableSelect from "@/components/select/SearchableSelect";
import { useGetMunicipalitySelectOptionsRequest } from "@/api/municipality/municipalities";
import { useGetWardSelectOptionsRequest } from "@/api/wards/wards";
import { useGetProvinceSelectOptionsRequest } from "@/api/province/provinces";
import { Province } from "@/utilities/enums";
import { normalizeWardQuery } from "@/utilities/utils";
import {
  MotionVariantsType,
  validateMembershipDetails,
} from "../registerUtils";
import { FormDataType } from "../RegisterForm";

interface MembershipDetailsStepProps {
  formData: FormDataType;
  variants: MotionVariantsType;
  validationRef: React.MutableRefObject<() => boolean>;
  handleSelectChange: (name: string, value: string) => void;
}

const MembershipDetailsStep = (props: MembershipDetailsStepProps) => {
  const { formData, variants, validationRef, handleSelectChange } = props;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const provinceSelectOptionsRequest = useGetProvinceSelectOptionsRequest();
  const [municipalityQueryText, setMunicipalityQueryText] =
    useState<string>("");
  const municipalitySelectOptionsRequest =
    useGetMunicipalitySelectOptionsRequest(municipalityQueryText);

  const getProvinceName = (provinceId: string) => {
    const province = provinceSelectOptionsRequest.data?.find(
      (province) => province.value === provinceId
    );
    return province ? province.label : "";
  };

  const [wardQueryText, setWardQueryText] = useState<string>("");
  const wardsSelectOptionsRequest = useGetWardSelectOptionsRequest(
    formData.municipality,
    normalizeWardQuery(
      wardQueryText,
      getProvinceName(formData.province) as Province
    )
  );

  const [votingStationQueryText, setVotingStationQueryText] =
    useState<string>("");
  const votingStationSelectOptionsRequest =
    useGetVotingStationSelectOptionsRequest(
      formData.ward,
      votingStationQueryText
    );

  const allSubscriptionsRequest = useGetAllSubscriptionsRequest();
  const membershipTypeOptions =
    allSubscriptionsRequest.data
      .filter((s) => s.name == "Basic")
      .map((s) => ({
        value: s.id,
        label: s.name,
      })) ?? [];

  useEffect(() => {
    if (
      allSubscriptionsRequest.isSuccess &&
      allSubscriptionsRequest.data &&
      allSubscriptionsRequest.data.length > 0
    ) {
      handleChangeMembershipType(membershipTypeOptions[0].value);
    }
  }, [allSubscriptionsRequest.isSuccess, allSubscriptionsRequest.data]);

  const handleChangeMembershipType = (value: string) => {
    handleSelectChange("membershipType", value);
    allSubscriptionsRequest.data.map((subscription) => {
      if (subscription.id === value) {
        handleSelectChange(
          "minimumDonationAmount",
          subscription.amount.amount.toString()
        );
        return;
      }
    });
  };

  const handleValidation = () => {
    let newErrors: Record<string, string> = {};
    newErrors = validateMembershipDetails(formData, true);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      setErrors(newErrors);
    }
    return isValid;
  };
  validationRef.current = handleValidation;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    handleSelectChange(name, value);
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
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-heading font-medium text-primary-700 flex items-center">
          <FileCheck size={22} className="mr-2 text-primary-500" /> Membership
          Details
        </h2>
        <p className="text-mkneutral-500">
          Please provide your voting and party membership preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          name="province"
          value={formData.province}
          onValueChange={(value) => handleSelectChange("province", value)}
          label="Province"
          placeholder="Select your province"
          required
          error={errors.province}
          options={provinceSelectOptionsRequest.data ?? []}
        />

        <SearchableSelect
          name="municipality"
          value={formData.municipality}
          onValueChange={(value) => handleSelectChange("municipality", value)}
          label="Municipality"
          required
          error={errors.municipality}
          searchFn={setMunicipalityQueryText}
          loading={municipalitySelectOptionsRequest.isLoading}
          options={municipalitySelectOptionsRequest.data ?? []}
          minSearchLength={3}
          placeholder="Search for a municipality"
          disabled={!formData.province}
        />

        <SearchableSelect
          name="ward"
          value={formData.ward}
          onValueChange={(value) => handleSelectChange("ward", value)}
          label="Ward Number"
          error={errors.ward}
          searchFn={setWardQueryText}
          loading={wardsSelectOptionsRequest.isLoading}
          options={wardsSelectOptionsRequest.data ?? []}
          minSearchLength={2}
          placeholder="Search for a ward if known"
          disabled={!formData.province || !formData.municipality}
        />

        <SearchableSelect
          name="votingStation"
          value={formData.votingStation}
          onValueChange={(value) => handleSelectChange("votingStation", value)}
          label="Voting Station"
          error={errors.votingStation}
          loading={votingStationSelectOptionsRequest.isLoading}
          options={votingStationSelectOptionsRequest.data ?? []}
          searchFn={setVotingStationQueryText}
          placeholder="Search for your voting station if known"
          disabled={
            !formData.province ||
            !formData.municipality ||
            !formData.ward ||
            !formData.idNumber
          }
        />

        <Select
          name="membershipType"
          value={formData.membershipType}
          onValueChange={(value) => handleChangeMembershipType(value)}
          label="Membership Type"
          placeholder="Select your membership type"
          required
          error={errors.membershipType}
          options={membershipTypeOptions}
        />
      </div>
    </motion.div>
  );
};

export default MembershipDetailsStep;

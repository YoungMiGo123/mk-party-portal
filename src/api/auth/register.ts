import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";
import {
  EmploymentStatus,
  Gender,
  Language,
  Nationality,
  Race,
  RegisterUpdateTempMemberCommand,
} from "../generated";

export const usePostRegisterRequest = () => {
  const client = useAxiosClient();

  return useMutation({
    mutationKey: ["post_signup_request"],
    mutationFn: async (props: PostRegisterRequestProps) =>
      await client.membership.postApiMembershipRegisterUpdateTempMember({
        ...props,
        gender: props.gender as Gender,
        race: props.race as Race,
        language: props.language as Language,
        nationality: props.nationality as Nationality,
        employmentStatus: props.employmentStatus as EmploymentStatus,
      }),
  });
};

export interface PostRegisterRequestProps
  extends Omit<
    RegisterUpdateTempMemberCommand,
    "gender" | "race" | "language" | "nationality" | "employmentStatus"
  > {
  gender: string;
  race: string;
  language: string;
  nationality: string;
  employmentStatus: string;
}

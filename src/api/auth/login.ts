import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const usePostLoginRequest = () => {
  const client = useAxiosClient();

  const request = useMutation({
    mutationKey: ["post_login_request"],
    mutationFn: async (props: PostLoginRequestProps) =>
      await client.auth.postApiAuthLogin2Fa({
        email: props.email,
        otpToken: props.otpToken,
      }),
  });

  return request;
};

export interface PostLoginRequestProps {
  email: string;
  otpToken: string;
}

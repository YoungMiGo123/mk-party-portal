import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const usePostSendLoginOTPRequest = () => {
  const client = useAxiosClient();

  const request = useMutation({
    mutationKey: ["post_send_login_otp"],
    mutationFn: async (props: PostSendLoginOTPRequestProps) =>
      await client.auth.postApiAuthLoginTwoFactorRequest({
        email: props.email,
        idNumber: "",
      }),
  });

  return request;
};

export interface PostSendLoginOTPRequestProps {
  email: string;
  idNumber?: string;
}

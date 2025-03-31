import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const usePostLogoutRequest = () => {
  const client = useAxiosClient();

  const request = useMutation({
    mutationKey: postLogoutRequestMutationKey,
    mutationFn: async () => await client.auth.deleteApiAuthLogout(),
  });

  return request;
};

const postLogoutRequestMutationKey = ["post_logout_request"];

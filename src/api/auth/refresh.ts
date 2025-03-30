import { AuthDtoResponse } from "../generated";
import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@src/providers/ClientProvider";

export const usePostRefreshRequest = () => {
  const client = useAxiosClient();

  const request = useMutation<AuthDtoResponse, Error, void>({
    mutationKey: postRefreshRequestMutationKey,
    mutationFn: async () => await client.auth.postApiAuthRefresh(),
  });

  return request;
};

export const postRefreshRequestMutationKey = ["post_refresh_request"];

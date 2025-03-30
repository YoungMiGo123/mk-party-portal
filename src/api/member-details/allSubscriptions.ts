import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const useGetAllSubscriptionsRequest = () => {
  const client = useAxiosClient();

  const queryKey = useMemo(() => ["get_all_subscriptions"], []);

  const request = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      await client.membership.getApiMembershipSubscriptions(),
  });

  return {
    ...request,
    data: request.data?.data ?? [],
    queryKey: queryKey,
  };
};

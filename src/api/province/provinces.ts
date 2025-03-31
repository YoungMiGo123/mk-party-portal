import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const useGetProvincesRequest = (
  query: string = "***",
  includeAll: boolean = true
) => {
  const client = useAxiosClient();

  const queryKey = useMemo(
    () => ["get_filtered_provinces", query, includeAll],
    [query, includeAll]
  );

  const request = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      await client.geoInfo.getApiGeoInfoProvinces(query, includeAll),
  });

  return {
    ...request,
    data: request.data?.data ?? [],
    queryKey: queryKey,
  };
};

export const useGetProvinceSelectOptionsRequest = (query: string = "***") => {
  const request = useGetProvincesRequest(query);
  return {
    ...request,
    data: request.data.map((province) => ({
      label: province.name,
      value: province.id,
    })),
  };
};

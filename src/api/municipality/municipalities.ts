import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const useGetMunicipalitiesRequest = (query: string = "***") => {
  const client = useAxiosClient();

  const queryKey = useMemo(
    () => ["get_filtered_municipalities", query],
    [query]
  );

  const request = useQuery({
    queryKey: queryKey,
    queryFn: async () =>
      await client.geoInfo.getApiGeoInfoMunicipalitiesByName1(query),
  });

  return {
    ...request,
    data: request.data?.data ?? [],
    queryKey: queryKey,
  };
};

export const useGetMunicipalitySelectOptionsRequest = (
  query: string = "***"
) => {
  const request = useGetMunicipalitiesRequest(query);
  return {
    ...request,
    data: request.data.map((municipality) => ({
      label: municipality.name,
      value: municipality.id,
    })),
  };
};

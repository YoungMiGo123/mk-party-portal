import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const useGetVotingStationRequest = (
  wardId: string,
  query: string = "***"
) => {
  const client = useAxiosClient();

  const queryKey = useMemo(
    () => ["get_filtered_voting_stations", wardId, query],
    [wardId, query]
  );

  const request = useQuery({
    queryKey: queryKey,
    enabled: !!wardId,
    queryFn: async () =>
      await client.geoInfo.getApiGeoInfoVotingStationsByName(wardId, query),
  });

  return {
    ...request,
    data: request.data?.data ?? [],
    queryKey: queryKey,
  };
};

export const useGetVotingStationSelectOptionsRequest = (
  wardId: string,
  query: string = "***"
) => {
  const request = useGetVotingStationRequest(wardId, query);
  return {
    ...request,
    data: request.data.map((votingStation) => ({
      label: votingStation.name,
      value: votingStation.id,
    })),
  };
};

export const useGetVotingStationByIdRequest = (
  idNumber: string,
  enable: boolean = false
) => {
  const client = useAxiosClient();

  const queryKey = useMemo(
    () => ["get_member_voting_station_by_id", idNumber],
    [idNumber]
  );

  const request = useQuery({
    queryKey: queryKey,
    enabled: !!idNumber && enable,
    queryFn: async () =>
      await client.membership.getApiMembershipVotingInfo(idNumber),
  });

  return {
    ...request,
    queryKey: queryKey,
  };
};

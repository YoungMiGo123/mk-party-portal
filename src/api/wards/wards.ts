import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";

export const useGetWardsRequest = (
  municipalityId: string,
  query: string = ""
) => {
  const client = useAxiosClient();

  const queryKey = useMemo(
    () => ["get_filtered_wards", municipalityId, query],
    [municipalityId, query]
  );

  const request = useQuery({
    queryKey: queryKey,
    enabled: !!municipalityId,
    queryFn: async () =>
      await client.geoInfo.getApiGeoInfoWardsByExternalId(
        municipalityId,
        query
      ),
  });

  return {
    ...request,
    data: request.data?.data ?? [],
    queryKey: queryKey,
  };
};

export const useGetWardSelectOptionsRequest = (
  municipalityId: string,
  query: string = ""
) => {
  const request = useGetWardsRequest(municipalityId, query);
  return {
    ...request,
    data: request.data.map((ward) => ({
      label: formatWard(ward.wardId),
      value: ward.id,
    })),
  };
};

/**
 * Extracts and formats the ward number from a South African ward code.
 *
 * This function assumes that the ward code is a string (or number) where the last
 * three digits represent the ward number (with leading zeros if needed). This format
 * is commonly used in metropolitan municipalities across South Africa.
 *
 * @param wardCode - The full ward code (e.g., "79800074" for Ward 74 in Johannesburg).
 * @returns A string formatted as "Ward X" where X is the parsed ward number.
 */
function formatWard(wardCode: string | number): string {
  const codeStr = String(wardCode).trim();

  const wardNumberPart = codeStr.length >= 3 ? codeStr.slice(-3) : codeStr;

  const wardNum = parseInt(wardNumberPart, 10);

  if (isNaN(wardNum)) {
    return codeStr;
  }

  return `Ward ${wardNum}`;
}

import React from "react";
import axios, { AxiosError } from "axios";
import { request } from "@/api/generated/core/request";
import { ApiClient, CancelablePromise } from "@/api/generated";
import { ApiRequestOptions } from "@/api/generated/core/ApiRequestOptions";
import { AxiosHttpRequest } from "@/api/generated/core/AxiosHttpRequest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AxiosClientContext = React.createContext<ApiClient>(undefined!);

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export interface ApiClientProviderProps extends React.PropsWithChildren {}

export default function ApiClientProvider(props: ApiClientProviderProps) {
  const queryClient = React.useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: (failureCount, error) => {
            if (axios.isAxiosError(error)) {
              const status = (error as AxiosError).response?.status;
              if (status === 404 || status === 403) return false;
            }
            return failureCount < 1;
          },
          retryDelay: 1000 * 60 * 0.15, // 9 / 10 seconds
          refetchOnWindowFocus: false,
          staleTime: 1000 * 60 * 2, // 2 minutes
        },
        mutations: {
          retry: false,
        },
      },
    });
  }, []);

  const axiosClient = React.useMemo(() => {
    return new ApiClient(
      undefined,
      class AxiosHttpRequestInstance extends AxiosHttpRequest {
        public override request<T>(
          options: ApiRequestOptions
        ): CancelablePromise<T> {
          return request(this.config, options, axiosInstance);
        }
      }
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AxiosClientContext.Provider value={axiosClient}>
        {props.children}
      </AxiosClientContext.Provider>
    </QueryClientProvider>
  );
}

export function useAxiosClient() {
  const client = React.useContext(AxiosClientContext);

  if (client == null) {
    throw new Error(
      `Invocations to ${useAxiosClient.name} should be within a node that is a child of ${ApiClientProvider.name}`
    );
  }

  return client;
}

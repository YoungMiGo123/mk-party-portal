import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";
import {
  VerifyTransactionCommand,
  VerifyTransactionResponse,
} from "../generated";
import { useRef } from "react";

export const usePostPaymentVerificationRequest = () => {
  const client = useAxiosClient();

  return useMutation({
    mutationKey: ["post_payment_verification_request"],
    mutationFn: async (props: VerifyTransactionCommand) =>
      await client.payments.postApiPaymentsVerifyTransaction(props),
  });
};

export interface PaymentVerificationData extends VerifyTransactionResponse {}

export interface PaymentVerificationOptions {
  pollInterval?: number; // in milliseconds (default: 2000)
  pollDuration?: number; // in milliseconds (default: 60000)
}

export const usePaymentVerificationPolling = (
  reference: string,
  startPolling: boolean = false,
  options?: PaymentVerificationOptions
) => {
  const client = useAxiosClient();
  const pollInterval = options?.pollInterval ?? 2000;
  const pollDuration = options?.pollDuration ?? 60000;
  const startTimeRef = useRef(Date.now());

  return useQuery({
    enabled: !!reference && startPolling,
    queryKey: ["poll_payment_verification", reference],
    queryFn: async () =>
      await client.payments.postApiPaymentsVerifyTransaction({
        reference: reference,
      }),
    refetchInterval: (data) => {
      const isPaymentSuccessful =
        data.state.data?.successful && data.state.data.data?.sucess;
      if (isPaymentSuccessful) {
        return false;
      }

      const isPollingExpired =
        Date.now() - startTimeRef.current >= pollDuration;
      if (isPollingExpired) {
        return false;
      }

      return pollInterval;
    },
  });
};

import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/providers/ApiClientProvider";
import {
  InitializePaymentRequestCommand,
  TransactionInitializeData,
} from "../generated";

export const usePostPaymentInitializationRequest = () => {
  const client = useAxiosClient();

  return useMutation({
    mutationKey: ["post_payment_initialization_request"],
    mutationFn: async (props: InitializePaymentRequestCommand) =>
      await client.payments.postApiPaymentsInitializeTransaction(props),
  });
};

export interface PaymentInitializationData extends TransactionInitializeData {}

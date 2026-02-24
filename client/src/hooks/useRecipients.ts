import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchRecipients,
  updateTransactionWithRecipient,
} from "@/api/services/recipient";
import type {
  Recipient,
  UpdateTransactionWithRecipientBody,
  UpdateTransactionResponse,
} from "@/api/types/recipient";

export const RECIPIENTS_KEY = ["recipients"] as const;

/**
 * React Query hook that fetches the user's saved recipients.
 *
 * Mirrors SelectRecipient.js `componentDidMount → onFetchRecipients`.
 */
export function useRecipients() {
  return useQuery<Recipient[], Error>({
    queryKey: [...RECIPIENTS_KEY],
    queryFn: fetchRecipients,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: (failureCount, error) => {
      if ("status" in error && typeof (error as any).status === "number") {
        if ((error as any).status >= 400 && (error as any).status < 500) return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation hook for PATCH /v1/transaction.
 *
 * Mirrors SelectRecipient.js `updateTransactionWithRecipient`.
 * Associates a recipient with a transaction quote.
 */
export function useUpdateTransactionWithRecipient() {
  const queryClient = useQueryClient();

  return useMutation<UpdateTransactionResponse, Error, UpdateTransactionWithRecipientBody>({
    mutationFn: updateTransactionWithRecipient,
    onSuccess: () => {
      // Invalidate recipients cache so it re-fetches if needed
      queryClient.invalidateQueries({ queryKey: RECIPIENTS_KEY });
    },
  });
}

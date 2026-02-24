import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchSourceOfFunds,
  fetchTransferReasons,
  updateReasonSource,
} from "@/api/services/reason-source";
import type {
  ReasonSourceItem,
  UpdateReasonSourceBody,
  UpdateReasonSourceResponse,
} from "@/api/types/reason-source";

export const SOURCE_OF_FUNDS_KEY = ["source-of-funds"] as const;
export const TRANSFER_REASONS_KEY = ["transfer-reasons"] as const;

/**
 * React Query hook that fetches the source-of-funds list.
 *
 * Mirrors RN `componentDidMount → fetchSourceOfFunds`.
 */
export function useSourceOfFunds() {
  return useQuery<ReasonSourceItem[], Error>({
    queryKey: [...SOURCE_OF_FUNDS_KEY],
    queryFn: fetchSourceOfFunds,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook that fetches the transfer-reasons list.
 *
 * Mirrors RN `componentDidMount → fetchTransferReasons`.
 */
export function useTransferReasons() {
  return useQuery<ReasonSourceItem[], Error>({
    queryKey: [...TRANSFER_REASONS_KEY],
    queryFn: fetchTransferReasons,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation hook for PATCH /v1/transaction/reason-source.
 *
 * Mirrors RN `updateReasonFunds` action.
 */
export function useUpdateReasonSource() {
  return useMutation<UpdateReasonSourceResponse, Error, UpdateReasonSourceBody>({
    mutationFn: updateReasonSource,
  });
}

import { useMutation } from "@tanstack/react-query";
import {
  fetchTransactionQuote,
  createTransaction,
} from "@/api/services/transaction";
import type {
  TransactionQuoteBody,
  TransactionQuoteResponse,
  CreateTransactionBody,
  CreateTransactionResponse,
} from "@/api/types/transaction";

/**
 * Mutation hook for POST /v1/quote-user.
 *
 * Mirrors RateCheckScreen.js `fetchTransactionQuote` Redux thunk.
 * Returns a mutation that can be triggered imperatively from `handleContinue`.
 */
export function useTransactionQuote() {
  return useMutation<TransactionQuoteResponse, Error, TransactionQuoteBody>({
    mutationFn: fetchTransactionQuote,
  });
}

/**
 * Mutation hook for POST /v1/transaction.
 *
 * Mirrors RateCheckScreen.js `createTransaction` Redux thunk.
 * Called after a successful quote to finalise the transfer.
 */
export function useCreateTransaction() {
  return useMutation<CreateTransactionResponse, Error, CreateTransactionBody>({
    mutationFn: createTransaction,
  });
}

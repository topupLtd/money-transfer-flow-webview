import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  TransactionQuoteBody,
  TransactionQuoteResponse,
  CreateTransactionBody,
  CreateTransactionResponse,
} from "../types/transaction";

/**
 * Requests a transaction quote from POST /v1/quote-user.
 *
 * Mirrors the React Native `fetchTransactionQuote` Redux action.
 * Validates amounts, delivery method, and payment method on the server side
 * and returns a transaction_id on success.
 */
export async function fetchTransactionQuote(
  body: TransactionQuoteBody,
): Promise<TransactionQuoteResponse> {
  return api.post<TransactionQuoteResponse>(ENDPOINTS.TRANSACTION_QUOTE, body);
}

/**
 * Creates a transaction via POST /v1/transaction.
 *
 * Mirrors the React Native `createTransaction` Redux action.
 * Called after a successful quote to finalise the transfer.
 */
export async function createTransaction(
  body: CreateTransactionBody,
): Promise<CreateTransactionResponse> {
  return api.post<CreateTransactionResponse>(ENDPOINTS.CREATE_TRANSACTION, body);
}

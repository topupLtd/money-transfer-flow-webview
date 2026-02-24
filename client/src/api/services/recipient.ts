import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Recipient,
  RecipientsResponse,
  ParentRecipientsData,
  ParentRecipientsResponse,
  UpdateTransactionWithRecipientBody,
  UpdateTransactionResponse,
} from "../types/recipient";

/**
 * Fetches recipients from GET /v1/recipients.
 *
 * Mirrors the React Native `fetchRecipients` Redux action.
 * Returns the user's saved recipient list.
 */
export async function fetchRecipients(): Promise<Recipient[]> {
  const raw = await api.get<RecipientsResponse>(ENDPOINTS.RECIPIENTS);
  return raw.data;
}

/**
 * Updates a transaction with a selected recipient via PATCH /v1/transaction.
 *
 * Mirrors the React Native `updateTransactionWithRecipient` Redux action.
 * Associates a recipient with an existing transaction quote.
 */
export async function updateTransactionWithRecipient(
  body: UpdateTransactionWithRecipientBody,
): Promise<UpdateTransactionResponse> {
  return api.patch<UpdateTransactionResponse>(ENDPOINTS.UPDATE_TRANSACTION, body);
}

/**
 * Fetches parent recipients from GET /v1/recipient/parents.
 *
 * Mirrors RN `fetchParentRecipients` Redux action.
 * Returns recipients grouped by parent + pickup methods for filtering.
 */
export async function fetchParentRecipients(): Promise<ParentRecipientsData> {
  const raw = await api.get<ParentRecipientsResponse>(ENDPOINTS.PARENT_RECIPIENTS);
  return raw.data;
}

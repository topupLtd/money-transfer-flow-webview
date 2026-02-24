import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  ReasonSourceItem,
  SourceOfFundsResponse,
  TransferReasonsResponse,
  UpdateReasonSourceBody,
  UpdateReasonSourceResponse,
} from "../types/reason-source";

/**
 * Fetches the list of available source-of-funds options.
 *
 * Mirrors RN `fetchSourceOfFunds` → GET /v1/origin-of-funds.
 */
export async function fetchSourceOfFunds(): Promise<ReasonSourceItem[]> {
  const raw = await api.get<SourceOfFundsResponse>(ENDPOINTS.ORIGIN_OF_FUNDS);
  return raw.data;
}

/**
 * Fetches the list of available transfer reason options.
 *
 * Mirrors RN `fetchTransferReasons` → GET /v1/transfer-reasons.
 */
export async function fetchTransferReasons(): Promise<ReasonSourceItem[]> {
  const raw = await api.get<TransferReasonsResponse>(ENDPOINTS.TRANSFER_REASONS);
  return raw.data;
}

/**
 * Updates a transaction with the selected reason & source of funds.
 *
 * Mirrors RN `updateReasonFunds` → PATCH /v1/transaction/reason-source.
 */
export async function updateReasonSource(
  body: UpdateReasonSourceBody,
): Promise<UpdateReasonSourceResponse> {
  return api.patch<UpdateReasonSourceResponse>(ENDPOINTS.UPDATE_REASON_SOURCE, body);
}

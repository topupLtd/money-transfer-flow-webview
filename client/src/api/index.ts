/**
 * API barrel export
 * Re-exports core API utilities for convenient imports
 */

export { api, apiClient } from "./client";
export type { ApiError, ApiRequestConfig } from "./client";
export { ENDPOINTS } from "./endpoints";
export type { ApiVersion } from "./version";
export { getCurrencyCountries } from "./services/currency";
export { getAvailableDeliveries } from "./services/delivery";
export type { GetAvailableDeliveriesBody } from "./services/delivery";
export type {
  Currency,
  Country,
  PickupMethod,
  CurrencyCountry,
  CurrencyCountriesResponse,
} from "./types/currency";
export type {
  DeliveryMethod,
  TransferTime,
  DeliveryFee,
  AvailableDeliveriesResponse,
} from "./types/delivery";
export { getExchangeRate } from "./services/exchange-rate";
export type {
  ExchangeRateBody,
  ExchangeRateData,
  ExchangeRateResponse,
} from "./types/exchange-rate";
export { fetchTransactionQuote, createTransaction } from "./services/transaction";
export type {
  TransactionQuoteBody,
  TransactionQuoteResponse,
  CreateTransactionBody,
  CreateTransactionResponse,
} from "./types/transaction";
export { fetchRecipients, updateTransactionWithRecipient, fetchParentRecipients } from "./services/recipient";
export type {
  Recipient,
  RecipientsResponse,
  UpdateTransactionWithRecipientBody,
  UpdateTransactionResponse,
  ParentRecipientsData,
  ParentRecipientsResponse,
  PickupMethod,
} from "./types/recipient";
export {
  MINIMUM_SENDING_AMOUNT,
  EXCHANGE_RATE_SENDER_ERROR_CODE,
  EXCHANGE_RATE_RECEIVER_ERROR_CODE,
} from "./types/transaction";
export {
  fetchSourceOfFunds,
  fetchTransferReasons,
  updateReasonSource,
} from "./services/reason-source";
export type {
  ReasonSourceItem,
  UpdateReasonSourceBody,
  UpdateReasonSourceResponse,
} from "./types/reason-source";
export { OTHER_REASON_ID, OTHER_SOURCE_ID } from "./types/reason-source";

import { api } from "../client";
import { ENDPOINTS } from "../endpoints";
import {
  AvailableDeliveriesResponseSchema,
  type DeliveryMethod,
} from "../types/delivery";

export interface GetAvailableDeliveriesBody {
  user_currency_countries_id: number;
  recipient_currency_countries_id: number;
  pickup_method_id?: number;
}

export async function getAvailableDeliveries(
  body: GetAvailableDeliveriesBody,
): Promise<DeliveryMethod[]> {
  // API expects query params (GET request with qs), matching the React Native implementation
  const params = new URLSearchParams();
  params.set(
    "user_currency_countries_id",
    String(body.user_currency_countries_id),
  );
  params.set(
    "recipient_currency_countries_id",
    String(body.recipient_currency_countries_id),
  );
  if (body.pickup_method_id) {
    params.set("pickup_method_id", String(body.pickup_method_id));
  }

  const raw = await api.get<unknown>(
    `${ENDPOINTS.AVAILABLE_PICKUP_METHOD_TRANSFER_TIME}/?${params.toString()}`,
  );
  const parsed = AvailableDeliveriesResponseSchema.parse(raw);
  return parsed.data;
}

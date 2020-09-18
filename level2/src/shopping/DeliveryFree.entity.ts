/**
 * Represents the additonal fee (price) to pay if transaction is within a range "eligible_transaction_volume"
 */
export interface DeliveryFee {
  eligible_transaction_volume: { min_price: number; max_price: number };
  price: number;
}

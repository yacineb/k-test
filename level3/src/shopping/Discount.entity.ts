export const enum DiscountType {
  amount = 'amount',
  percentage = 'percentage',
}

export interface Discount {
  article_id: number;
  type: DiscountType;
  value: number;
}

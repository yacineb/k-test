export interface CartItem {
  /**
   * Id of the corresponding Article entity
   */
  article_id: number;

  /**
   * Can only be positive (or 0) integer
   */
  quantity: number;
}

/**
 * The shopping cart
 */
export interface Cart {
  id: number;
  items: Array<CartItem>;
}

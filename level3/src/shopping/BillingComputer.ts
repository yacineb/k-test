import { Article } from './Article.entity';
import { Cart } from './Cart.entity';
import { CartBilling } from './CartBilling.entity';
import assert from 'assert';
import { DeliveryFee } from './DeliveryFree.entity';
import { Discount, DiscountType } from './Discount.entity';

/**
 * Computes total price for each cart
 */
export class BillingComputer {
  public compute(
    articles: ReadonlyArray<Article>,
    carts: ReadonlyArray<Cart>,
    delivery_fee: ReadonlyArray<DeliveryFee>,
    discounts: ReadonlyArray<Discount>
  ): CartBilling[] {
    // maps article ids to prices, avoid later o(n) lookups when computing

    const discountsLookup = this.getDiscountsLookup(discounts);
    const articlesLookup = this.getArticlesLookup(articles);

    return carts.map((cart) => {
      let total = 0;

      for (const item of cart.items) {
        const articlePrice = articlesLookup(item.article_id);

        // defensive programming is always a good thing
        assert.ok(
          typeof articlePrice === 'number' && !Number.isNaN(articlePrice) && articlePrice >= 0,
          `article #${item.article_id} in cart #${cart.id} either not found in articles database or has wrong price data format`
        );

        total += articlePrice * item.quantity;
      }

      return {
        id: cart.id,
        total: this.applyDeliveryFee(total, delivery_fee),
      };
    });
  }

  /**
   * Get the final price with the delivery fees applied
   * @param totalNet
   * @param deliveryFees
   */
  private readonly applyDeliveryFee = (totalNet: number, deliveryFees: ReadonlyArray<DeliveryFee>): number => {
    const applicationFee = deliveryFees.find(
      (fee) =>
        totalNet >= fee.eligible_transaction_volume.min_price &&
        (totalNet < fee.eligible_transaction_volume.max_price || fee.eligible_transaction_volume.max_price === null) // null seems to be a convention for +Infinity
    );

    return totalNet + (applicationFee?.price || 0);
  };

  private getDiscountsLookup(discounts: readonly Discount[]) {
    const article2Discount = new Map<number, Discount>();
    for (const discount of discounts) {
      article2Discount.set(discount.article_id, discount);
    }

    return (articleId: number): Discount | undefined => {
      return article2Discount.get(articleId);
    };
  }

  private getArticlesLookup(articles: readonly Article[]) {
    const article2Price = new Map<number, number>();
    for (const article of articles) {
      article2Price.set(article.id, article.price);
    }

    return (articleId: number): number | undefined => {
      return article2Price.get(articleId);
    };
  }
}

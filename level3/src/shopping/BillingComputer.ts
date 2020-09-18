import { Article } from './Article.entity';
import { Cart } from './Cart.entity';
import { CartBilling } from './CartBilling.entity';
import assert from 'assert';
import { DeliveryFee } from './DeliveryFree.entity';
import { Discount, DiscountType } from './Discount.entity';

type DiscountLookup = (articleid: number) => Discount | undefined;
type ArticlePriceLookup = (articleId: number) => number;

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

    return carts.map((cart) => this.unitaryCompute(cart, articlesLookup, discountsLookup, delivery_fee));
  }

  /**
   * Get the final price with the delivery fees applied
   * (Performance note : o(n) lookup on delivery fees is ok as it doe have low cardinality comparing to product)
   * @param totalNet
   * @param deliveryFees
   */
  private readonly applyDeliveryFee = (totalNet: number, deliveryFees: ReadonlyArray<DeliveryFee>): number => {
    const applicationFee = deliveryFees.find(
      (fee) =>
        totalNet >= fee.eligible_transaction_volume.min_price &&
        (totalNet < fee.eligible_transaction_volume.max_price || fee.eligible_transaction_volume.max_price === null) // null seems to be a convention for +Infinity
    );

    return totalNet + (applicationFee?.price || 0.0);
  };

  private readonly applyDiscount = (total: number, discount?: Discount): number => {
    if (!discount) return total;

    switch (discount.type) {
      case DiscountType.amount:
        return Math.max(total - discount.value, 0.0);
      case DiscountType.percentage:
        return Math.floor(total - (total * discount.value) / 100.0);
      default: {
        console.warn('Unknown discount type', discount);
        return total;
      }
    }
  };

  /**
   * Computes billing for a cart item
   */
  public unitaryCompute(
    cart: Cart,
    articlesLookup: ArticlePriceLookup,
    discountsLookup: DiscountLookup,
    delivery_fee: readonly DeliveryFee[]
  ) {
    let total = 0;

    for (const item of cart.items) {
      const articlePrice = articlesLookup(item.article_id);
      const discount = discountsLookup(item.article_id);

      // discounts apply by product
      total += this.applyDiscount(articlePrice, discount) * item.quantity;
    }

    return {
      id: cart.id,
      // delivery fee applies on the whole transaction
      total: this.applyDeliveryFee(total, delivery_fee),
    };
  }

  private getDiscountsLookup(discounts: readonly Discount[]): DiscountLookup {
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

    return (articleId: number): number => {
      const articlePrice = article2Price.get(articleId);
      // defensive programming is always a good thing
      assert.ok(
        typeof articlePrice === 'number' && !Number.isNaN(articlePrice) && articlePrice >= 0,
        `article #${articleId} is either not found in articles database or has wrong price data format`
      );

      return articlePrice;
    };
  }
}

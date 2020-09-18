import { Article } from './Article.entity';
import { Cart } from './Cart.entity';
import { CartBilling } from './CartBilling.entity';
import assert from 'assert';

/**
 * Computes total price for each cart
 */
export class BillingComputer {
  public compute(articles: Article[], carts: Cart[]): CartBilling[] {
    // maps article ids to prices, avoid later o(n) lookups when computing
    const article2Price = new Map<number, number>();
    for (const article of articles) {
      article2Price.set(article.id, article.price);
    }

    return carts.map((cart) => {
      let total = 0;

      for (const item of cart.items) {
        const articlePrice = article2Price.get(item.article_id);

        // defensive programming is always a good thing
        assert.ok(
          typeof articlePrice === 'number' && !Number.isNaN(articlePrice) && articlePrice >= 0,
          `article #${item.article_id} in cart #${cart.id} either not found in articles database or has wrong price data format`
        );

        total += articlePrice * item.quantity;
      }

      return {
        id: cart.id,
        total,
      };
    });
  }
}

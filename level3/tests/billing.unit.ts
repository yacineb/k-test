import { BillingComputer } from '../src/shopping/BillingComputer';
import { DiscountType } from '../src/shopping/Discount.entity';

describe('BillingComputer', () => {
  const testCases = [
    {
      articles: [
        {
          id: 1,
          name: 'a',
          price: 10,
        },
        {
          id: 2,
          name: 'a',
          price: 20,
        },
      ],
      carts: [
        {
          id: 1,
          items: [
            {
              article_id: 1,
              quantity: 1,
            },
            {
              article_id: 2,
              quantity: 3,
            },
          ],
        },
      ],
      fees: [],

      discounts: [
        {
          article_id: 1,
          value: 5,
          type: DiscountType.amount,
        },
      ],

      expected: [
        {
          id: 1,
          total: 65,
        },
      ],
    },
    {
      articles: [
        {
          id: 1,
          name: 'a',
          price: 10,
        },
        {
          id: 2,
          name: 'a',
          price: 20,
        },
      ],
      carts: [
        {
          id: 1,
          items: [],
        },
      ],
      fees: [],
      expected: [
        {
          id: 1,
          total: 0,
        },
      ],

      discounts: [
        {
          article_id: 1,
          value: 10,
          type: DiscountType.amount,
        },
      ],
    },
  ];

  testCases.forEach(({ articles, carts, fees, expected, discounts }, index) => {
    it(`test compute case #${index}`, () => {
      const result = new BillingComputer().compute(articles, carts, fees, discounts);
      expect(result).toEqual(expected);
    });
  });
});

import { BillingComputer } from '../src/shopping/BillingComputer';

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

      expected: [
        {
          id: 1,
          total: 70,
        },
      ],
    },
  ];

  testCases.forEach((testCase, index) => {
    it(`test compute case #${index}`, () => {
      const result = new BillingComputer().compute(testCase.articles, testCase.carts);
      expect(result).toEqual(testCase.expected);
    });
  });
});

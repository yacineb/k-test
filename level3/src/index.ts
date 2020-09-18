import { BillingComputer } from './shopping/BillingComputer';
import { DataRepository } from './shopping/DataRepository';

export async function main() {
  // computes billing and save it into destination file

  const repo = new DataRepository();
  const { articles, carts, delivery_fees, discounts } = await repo.loadData();

  const computer = new BillingComputer();
  const result = computer.compute(articles, carts, delivery_fees, discounts);

  await repo.saveBillingData(result);
}

if (require.main === module) {
  main()
    .then(() => console.info('done'))
    .catch((error) => console.error('failed', error));
}

import { getInputFilePath, getOutputFilePath } from '../config';
import { promises as fs_prom } from 'fs';
import { Article } from './Article.entity';
import { Cart } from './Cart.entity';
import { CartBilling } from './CartBilling.entity';
import { DeliveryFee } from './DeliveryFree.entity';

/**
 * Retrieves carts and articles data from storage
 */
export class DataRepository {
  public async loadData(): Promise<{ articles: Article[]; carts: Cart[]; delivery_fees: DeliveryFee[] }> {
    const data = await fs_prom.readFile(getInputFilePath(), 'utf-8');
    return JSON.parse(data);
  }

  public async saveBillingData(data: CartBilling[]) {
    // indent for human readability
    await fs_prom.writeFile(getOutputFilePath(), JSON.stringify({ carts: data }, null, 2), 'utf-8');
  }
}

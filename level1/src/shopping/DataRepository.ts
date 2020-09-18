import { getInputFilePath } from '../config';
import { promises as fs_prom } from 'fs';
import { Article } from './Article.entity';
import { Cart } from './Cart.entity';

/**
 * Retrieves carts and articles data from storage
 */
export class DataRepository {
  public async loadData(): Promise<{ articles: Article[]; carts: Cart[] }> {
    const data = await fs_prom.readFile(getInputFilePath(), 'utf-8');
    return JSON.parse(data);
  }
}

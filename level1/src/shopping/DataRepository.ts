import { getInputFilePath } from '../config';
import { promises as fs_prom } from 'fs';
import { Article } from './Article.entity';
import { Cart } from './Cart.entity';

export interface Document {
  articles: Article[];
  carts: Cart[];
}

/**
 * Retrieves carts and articles data from storage
 */
export class DataRepository {
  public async loadData(): Promise<Document> {
    const data = await fs_prom.readFile(getInputFilePath(), 'utf-8');
    return JSON.parse(data);
  }
}

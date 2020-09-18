import { main } from '../src';
import { promises as fs_prom } from 'fs';
import { getOutputFilePath } from '../src/config';

describe('shopping integration test', () => {
  it('billing compute and save', async () => {
    await main();

    const data = JSON.parse(await fs_prom.readFile(getOutputFilePath(), 'utf-8'));
    expect(data).toEqual(require('../expected_output.json'));
  });
});

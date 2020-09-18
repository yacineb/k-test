import { DataRepository } from '../src/shopping/DataRepository';

describe('repository integration test', () => {
  it('Read Input data ok', async () => {
    const data = await new DataRepository().loadData();

    expect(data).toEqual(require('../input'));
  });
});

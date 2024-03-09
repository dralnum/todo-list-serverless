import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { ListListsUsecaseFactory } from '../../../../src/usecases/list-lists/list-lists.usecase';

describe('Testing list lists usecase', () => {
  const repositoryMock = {
    findLists: stub().resolves({}),
  };

  const usecase = ListListsUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    const response = await usecase.execute({ username: 'test' });

    expect(response.success).to.equal(true);
  });

  it('execute function should return error', async () => {
    const repositoryMock = {
      findLists: stub().rejects(),
    };

    const usecase = ListListsUsecaseFactory(repositoryMock);

    await expect(usecase.execute({ username: 'test' })).to.be.rejected;
  });
});

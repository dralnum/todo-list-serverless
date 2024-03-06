import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CreateListUsecaseFactory } from '../../../../src/usecases/create-list/create-list.usecase';

describe('Testing create list usecase', async () => {
  const repositoryMock = {
    createList: stub().resolves({}),
  };

  const createListUsecaseInput = {
    username: 'Test',
    title: 'List Title',
  };

  const usecase = CreateListUsecaseFactory(repositoryMock);
  const response = await usecase.execute(createListUsecaseInput);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    expect(response.success).to.equal(true);
  });

  it('execute function should create a list and return the id', async () => {
    expect(response.data.id).to.be.a.string;
  });

  it('execute function should return error', async () => {
    const repositoryMock = {
      createList: stub().rejects(),
    };

    const usecase = CreateListUsecaseFactory(repositoryMock);

    await expect(usecase.execute(createListUsecaseInput)).to.be.rejected;
  });
});

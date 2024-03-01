import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub, spy } from 'sinon';

import { ListTasksUsecaseFactory } from '../../../../src/usecases/list-tasks/list-tasks.usecase';

describe('Testing list tasks usecase', () => {
  const repositoryMock = {
    findTasks: stub().resolves({}),
    findAllTasks: stub().resolves({}),
  };

  const date = new Date();
  const usecase = ListTasksUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    const response = await usecase.execute({ date });

    expect(response.success).to.equal(true);
  });

  it('execute function with undefined date should call right function', async () => {
    const repositoryMock = {
      findTasks: spy(),
      findAllTasks: spy(),
    };

    const usecase = ListTasksUsecaseFactory(repositoryMock);

    await usecase.execute({ date: undefined });

    expect(repositoryMock.findTasks.called).to.be.false;
    expect(repositoryMock.findAllTasks.called).to.be.true;
  });
});

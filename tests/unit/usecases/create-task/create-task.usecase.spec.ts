import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CreateTaskUsecaseFactory } from '../../../../src/usecases/create-task/create-task.usecase';

describe('Testing create task usecase', () => {
  const repositoryMock = {
    createTask: stub().resolves({}),
  };

  const date = new Date();
  const usecase = CreateTaskUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    const response = await usecase.execute({ date, title: 'Task Title', description: 'Task Description', done: true });

    expect(response.success).to.equal(true);
  });

  it('execute function should create a task with done to be false', async () => {
    const response = await usecase.execute({ date, title: 'Task Title', description: 'Task Description' });

    expect(response.data.done).to.equal(false);
  });
});

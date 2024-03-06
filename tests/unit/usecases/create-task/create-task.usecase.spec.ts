import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import { v4 as uuid } from 'uuid';

import { CreateTaskUsecaseFactory } from '../../../../src/usecases/create-task/create-task.usecase';

describe('Testing create task usecase', () => {
  const repositoryMock = {
    createTask: stub().resolves({}),
    findList: stub().resolves({}),
  };

  const date = new Date();
  const createTaskUsecaseInput = {
    username: 'test',
    taskListId: uuid(),
    date,
    title: 'Task Title',
    description: 'Task Description',
    done: true,
  };

  const usecase = CreateTaskUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    const response = await usecase.execute(createTaskUsecaseInput);

    expect(response.success).to.equal(true);
    expect(response.data.done).to.equal(true);
  });

  it('execute function should create a task with done to be false', async () => {
    createTaskUsecaseInput.done = false;
    const response = await usecase.execute(createTaskUsecaseInput);

    expect(response.data.done).to.equal(false);
  });

  it('execute function should return error', async () => {
    const repositoryMock = {
      createTask: stub().resolves({}),
      findList: stub().resolves(undefined),
    };

    const usecase = CreateTaskUsecaseFactory(repositoryMock);

    await expect(usecase.execute(createTaskUsecaseInput)).to.be.rejected;
  });
});

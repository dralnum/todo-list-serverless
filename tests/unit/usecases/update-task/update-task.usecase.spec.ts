import * as chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import { stub, spy } from 'sinon';
import { v4 as uuid } from 'uuid';

import { UpdateTaskUsecaseFactory } from '../../../../src/usecases/update-task/update-task.usecase';
import { Task } from '../../../../src/usecases/create-task/create-task.usecase';

use(chaiAsPromised);

describe('Testing update task usecase', () => {
  const taskId = uuid();
  const taskListId = uuid();
  const task: Task = {
    id: taskId,
    date: new Date(),
    title: 'Test title',
    description: 'Test description',
    done: false,
    createdAtTimestamp: new Date(),
  };
  const repositoryMock = {
    updateTask: stub().resolves(),
    findTask: stub().resolves(task),
  };

  const usecase = UpdateTaskUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    const response = await usecase.execute({ taskId, taskListId });

    expect(response.success).to.equal(true);
  });

  it('function updateTask should be called', async () => {
    const repositoryMock = {
      updateTask: spy(),
      findTask: stub().resolves(task),
    };

    const usecase = UpdateTaskUsecaseFactory(repositoryMock);

    await usecase.execute({ taskId, taskListId });

    expect(repositoryMock.updateTask.called).to.be.true;
  });

  it('execute function should return error when a task cannot be found', async () => {
    const repositoryMock = {
      updateTask: spy(),
      findTask: stub().resolves(undefined),
    };

    const usecase = UpdateTaskUsecaseFactory(repositoryMock);

    await expect(usecase.execute({ taskId, taskListId })).to.be.rejected;
    expect(repositoryMock.updateTask.called).to.be.false;
  });

  it('execute function should return error', async () => {
    const repositoryMock = {
      updateTask: stub().rejects(),
      findTask: stub().resolves(task),
    };

    const usecase = UpdateTaskUsecaseFactory(repositoryMock);

    await expect(usecase.execute({ taskId, taskListId })).to.be.rejected;
  });
});

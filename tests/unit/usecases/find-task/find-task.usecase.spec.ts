import * as chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import { stub } from 'sinon';
import { v4 as uuid } from 'uuid';

import { FindTaskUsecaseFactory } from '../../../../src/usecases/find-task/find-task.usecase';
import { Task } from '../../../../src/usecases/create-task/create-task.usecase';

use(chaiAsPromised);

describe('Testing find task usecase', () => {
  const taskId = uuid();
  const task: Task = {
    id: taskId,
    date: new Date(),
    title: 'Test title',
    description: 'Test description',
    done: false,
    createdAtTimestamp: new Date(),
  };
  const repositoryMock = {
    findTask: stub().resolves(task),
  };

  const usecase = FindTaskUsecaseFactory(repositoryMock);

  it('execute function should exist', () => {
    expect(usecase.execute).to.exist.and.be.a('function');
  });

  it('execute function should return success', async () => {
    const response = await usecase.execute({ taskId });

    expect(response.success).to.equal(true);
  });

  it('execute function should return error', async () => {
    const repositoryMock = {
      findTask: stub().resolves(undefined),
    };

    const usecase = FindTaskUsecaseFactory(repositoryMock);

    await expect(usecase.execute({ taskId })).to.be.rejected;
  });
});

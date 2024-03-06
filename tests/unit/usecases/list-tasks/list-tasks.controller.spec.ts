import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { v4 as uuid } from 'uuid';

import { ListTasksControllerFactory } from '../../../../src/usecases/list-tasks/list-tasks.controller';

describe('Testing list tasks controller', () => {
  const usecaseMock = {
    execute: stub().resolves([{}]),
  };

  const loggerMock = {
    debug: stub().resolves(),
    info: stub().resolves(),
    warn: stub().resolves(),
    error: spy(),
    start: stub().resolves(),
    end: stub().resolves(),
    setRequestId: stub().resolves(),
    getRequestId: stub().resolves(),
  };

  const controller = ListTasksControllerFactory(usecaseMock, loggerMock);

  const taskListId = uuid();

  it('listTasks function should exist', () => {
    expect(controller.listTasks).to.exist.and.be.a('function');
  });

  it('listTasks function should return success with date', async () => {
    const response = await controller.listTasks({ taskListId, date: '2024-02-29' });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it('listTasks function should return success without date', async () => {
    const response = await controller.listTasks({ taskListId });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it('listTasks function should return mapped error status 400', async () => {
    const mappedError = {
      status: 400,
      body: {
        success: false,
        message: 'At path: date -- Expected a valid `Date` object, but received: Invalid Date',
        code: 'INVALID_PARAMETERS',
      },
    };

    const response = await controller.listTasks({ taskListId, date: 'lorem ipsum' });

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while listing tasks', mappedError)).to.be.true;
  });

  it('listTasks function should return unmapped error status 500', async () => {
    const usecaseMock = {
      execute: stub().rejects({ error: 'test errorMessage' }),
    };

    const controller = ListTasksControllerFactory(usecaseMock, loggerMock);

    const response = await controller.listTasks({ taskListId, date: '2024-02-29' });

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Unmapped error while listing tasks', { error: 'test errorMessage' })).to.be.true;
  });
});

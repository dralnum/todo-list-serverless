import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { v4 as uuid } from 'uuid';

import { DeleteTaskControllerFactory } from '../../../../src/usecases/delete-task/delete-task.controller';
import { Task } from '../../../../src/usecases/create-task/create-task.usecase';
import { CustomError } from '../../../../src/helpers/error';
import { DeleteTaskErrorCodes } from '../../../../src/usecases/delete-task/delete-task.errors';

describe('Testing delete task controller', () => {
  const taskId = uuid();
  const task: Task = {
    id: taskId,
    date: new Date(),
    title: 'Test title',
    description: 'Test description',
    done: false,
    createdAtTimestamp: new Date(),
  };
  const usecaseMock = {
    execute: stub().resolves({
      success: true,
      data: task,
    }),
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

  const controller = DeleteTaskControllerFactory(usecaseMock, loggerMock);

  it('deleteTask function should exist', () => {
    expect(controller.deleteTask).to.exist.and.be.a('function');
  });

  it('deleteTask function should return success', async () => {
    const response = await controller.deleteTask({ taskId });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it('deleteTask function should return mapped error status 400 on invalid parameters', async () => {
    const mappedError = {
      status: 400,
      body: {
        success: false,
        message: 'At path: taskId -- Expected a string, but received: undefined',
        code: 'INVALID_PARAMETERS',
      },
    };

    const response = await controller.deleteTask({});

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while deleting a task', mappedError)).to.be.true;
  });

  it('deleteTask function should return mapped error status 404', async () => {
    const mockedError = new CustomError(DeleteTaskErrorCodes.NotFound, `Task not found for the given ID: ${taskId}`);
    const usecaseMock = {
      execute: stub().rejects(mockedError),
    };

    const mappedError = {
      status: 404,
      body: {
        success: false,
        message: `Task not found for the given ID: ${taskId}`,
        code: 'NOT_FOUND',
      },
    };

    const controller = DeleteTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.deleteTask({ taskId });

    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while deleting a task', mappedError)).to.be.true;
  });

  it('deleteTask function should return unmapped error', async () => {
    const usecaseMock = {
      execute: stub().rejects({ error: 'test errorMessage' }),
    };

    const controller = DeleteTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.deleteTask({ taskId });

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Unmapped error while deleting a task', { error: 'test errorMessage' })).to.be.true;
  });
});

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub, spy } from 'sinon';
import { v4 as uuid } from 'uuid';

import { UpdateTaskControllerFactory } from '../../../../src/usecases/update-task/update-task.controller';
import { CustomError } from '../../../../src/helpers/error';
import { UpdateTaskErrorCodes } from '../../../../src/usecases/update-task/update-task.errors';

describe('Testing update task controller', () => {
  const taskId = uuid();
  const taskListId = uuid();

  const updateTaskControllerInput = {
    taskListId,
    taskId,
    date: new Date(),
    title: 'Test title',
    description: 'Test description',
    done: false,
  };

  const usecaseMock = {
    execute: stub().resolves({
      success: true,
      data: updateTaskControllerInput,
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

  const controller = UpdateTaskControllerFactory(usecaseMock, loggerMock);

  it('updateTask function should exist', () => {
    expect(controller.updateTask).to.exist.and.be.a('function');
  });

  it('updateTask function should return success', async () => {
    const response = await controller.updateTask(updateTaskControllerInput);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it('updateTask function should return mapped error status 400 on invalid parameters', async () => {
    const mappedError = {
      status: 400,
      body: {
        success: false,
        message: 'At path: taskId -- Expected a string, but received: undefined',
        code: 'INVALID_PARAMETERS',
      },
    };

    const response = await controller.updateTask({ ...updateTaskControllerInput, taskId: undefined });

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while updating a task', mappedError)).to.be.true;
  });

  it('updateTask function should return mapped error status 400 attributes to update expected', async () => {
    const mappedError = {
      status: 400,
      body: {
        success: false,
        message: 'At least one of the attributes to update was expected, but none were received',
        code: 'INVALID_PARAMETERS',
      },
    };

    const response = await controller.updateTask({ taskListId, taskId });

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while updating a task', mappedError)).to.be.true;
  });

  it('usecase execute function should not been called on return mapped error status 400 attributes to update expected', async () => {
    const usecaseMock = {
      execute: spy(),
    };

    const controller = UpdateTaskControllerFactory(usecaseMock, loggerMock);

    await controller.updateTask({ taskListId, taskId });

    expect(usecaseMock.execute.called).to.be.false;
  });

  it('updateTask function should return mapped error status 404', async () => {
    const mockedError = new CustomError(UpdateTaskErrorCodes.NotFound, `Task not found for the given ID: ${taskId}`);
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

    const controller = UpdateTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.updateTask(updateTaskControllerInput);

    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while updating a task', mappedError)).to.be.true;
  });

  it('updateTask function should return unmapped error', async () => {
    const usecaseMock = {
      execute: stub().rejects({ error: 'test errorMessage' }),
    };

    const controller = UpdateTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.updateTask(updateTaskControllerInput);

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Unmapped error while updating a task', { error: 'test errorMessage' })).to.be.true;
  });
});

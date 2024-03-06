import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';
import { v4 as uuid } from 'uuid';

import { CreateTaskControllerFactory } from '../../../../src/usecases/create-task/create-task.controller';
import { CustomError } from '../../../../src/helpers/error';
import { CreateTaskErrorCodes } from '../../../../src/usecases/create-task/create-task.errors';

describe('Testing create task controller', () => {
  const usecaseMock = {
    execute: stub().resolves({}),
  };

  const loggerMock = {
    debug: stub().resolves(),
    info: stub().resolves(),
    warn: stub().resolves(),
    error: stub().resolves(),
    start: stub().resolves(),
    end: stub().resolves(),
    setRequestId: stub().resolves(),
    getRequestId: stub().resolves(),
  };

  const createTaskControllerInput = {
    username: 'test',
    taskListId: uuid(),
    date: '2024-02-29',
    title: 'Task Title',
    description: 'Task Description',
    done: true,
  };

  const controller = CreateTaskControllerFactory(usecaseMock, loggerMock);

  it('createTask function should exist', () => {
    expect(controller.createTask).to.exist.and.be.a('function');
  });

  it('createTask function should return success', async () => {
    const response = await controller.createTask(createTaskControllerInput);

    expect(response.status).to.equal(201);
    expect(response.body.success).to.equal(true);
  });

  it('createTask function should return mapped error status 400', async () => {
    const response = await controller.createTask({});

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
  });

  it('createTask function should return mapped error status 404 when list not found', async () => {
    const { username, taskListId } = createTaskControllerInput;
    const mockedError = new CustomError(
      CreateTaskErrorCodes.NotFound,
      `List not found for the given information: Username: ${username} - ID: ${taskListId}`,
    );
    const usecaseMock = {
      execute: stub().rejects(mockedError),
    };

    const mappedError = {
      status: 404,
      body: {
        success: false,
        message: `List not found for the given information: Username: ${username} - ID: ${taskListId}`,
        code: 'NOT_FOUND',
      },
    };

    const controller = CreateTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.createTask(createTaskControllerInput);

    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while creating a task', mappedError)).to.be.true;
  });

  it('createTask function should return unmapped error status 500', async () => {
    const usecaseMock = {
      execute: stub().rejects(),
    };

    const controller = CreateTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.createTask(createTaskControllerInput);

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
  });
});

import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CreateTaskControllerFactory } from '../../../../src/usecases/create-task/create-task.controller';

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

  const controller = CreateTaskControllerFactory(usecaseMock, loggerMock);

  it('createTask function should exist', () => {
    expect(controller.createTask).to.exist.and.be.a('function');
  });

  it('createTask function should return success', async () => {
    const response = await controller.createTask({ date: '2024-02-29', title: 'Task Title', description: 'Task Description', done: true });

    expect(response.status).to.equal(201);
    expect(response.body.success).to.equal(true);
  });

  it('createTask function should return mapped error status 400', async () => {
    const response = await controller.createTask({});

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
  });

  it('createTask function should return unmapped error status 500', async () => {
    const usecaseMock = {
      execute: stub().rejects(),
    };

    const controller = CreateTaskControllerFactory(usecaseMock, loggerMock);

    const response = await controller.createTask({ date: '2024-02-29', title: 'Task Title', description: 'Task Description' });

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
  });
});

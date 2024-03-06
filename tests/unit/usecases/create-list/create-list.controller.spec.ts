import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { CreateListControllerFactory } from '../../../../src/usecases/create-list/create-list.controller';
describe('Testing create list controller', () => {
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

  const createListControllerInput = {
    username: 'Test',
    title: 'List Title',
  };

  const controller = CreateListControllerFactory(usecaseMock, loggerMock);

  it('createList function should exist', () => {
    expect(controller.createList).to.exist.and.be.a('function');
  });

  it('createList function should return success', async () => {
    const response = await controller.createList(createListControllerInput);

    expect(response.status).to.equal(201);
    expect(response.body.success).to.equal(true);
  });

  it('createList function should return mapped error status 400', async () => {
    const response = await controller.createList({});

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
  });

  it('createList function should return unmapped error status 500', async () => {
    const usecaseMock = {
      execute: stub().rejects(),
    };

    const controller = CreateListControllerFactory(usecaseMock, loggerMock);

    const response = await controller.createList(createListControllerInput);

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
  });
});

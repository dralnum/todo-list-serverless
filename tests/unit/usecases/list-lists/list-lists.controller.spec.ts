import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub, spy } from 'sinon';

import { ListListsControllerFactory } from '../../../../src/usecases/list-lists/list-lists.controller';

describe('Testing list lists controller', () => {
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

  const controller = ListListsControllerFactory(usecaseMock, loggerMock);

  it('listLists function should exist', () => {
    expect(controller.listLists).to.exist.and.be.a('function');
  });

  it('listLists function should return success', async () => {
    const response = await controller.listLists({ username: 'test' });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it('listTasks function should return mapped error status 400', async () => {
    const mappedError = {
      status: 400,
      body: {
        success: false,
        message: 'At path: username -- Expected a string, but received: undefined',
        code: 'INVALID_PARAMETERS',
      },
    };

    const response = await controller.listLists({});

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Mapped error while listing lists', mappedError)).to.be.true;
  });

  it('listTasks function should return unmapped error status 500', async () => {
    const usecaseMock = {
      execute: stub().rejects({ error: 'test errorMessage' }),
    };

    const controller = ListListsControllerFactory(usecaseMock, loggerMock);

    const response = await controller.listLists({ username: 'test' });

    expect(response.status).to.equal(500);
    expect(response.body.success).to.equal(false);
    expect(loggerMock.error.calledWithExactly('Unmapped error while listing lists', { error: 'test errorMessage' })).to.be.true;
  });
});

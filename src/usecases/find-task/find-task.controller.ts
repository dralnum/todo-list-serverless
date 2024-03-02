import { assert, object, string } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { FindTaskUsecase } from './find-task.usecase';
import { FindTaskErrorCodes } from './find-task.errors';

export type FindTaskController = ReturnType<typeof FindTaskControllerFactory>;

export function FindTaskControllerFactory(usecase: FindTaskUsecase, logger: Logger) {
  const FindTaskInput = object({
    taskId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, FindTaskInput);

    return data;
  };

  const findTask = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(FindTaskErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 200,
        body: {
          success: true,
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        const error = err as CustomError<FindTaskErrorCodes>;

        const mappedError = errorHandler[error.code ?? FindTaskErrorCodes.Default](error);

        logger.error('Mapped error while finding a task', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while finding a task', err);

      return errorHandler[FindTaskErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [FindTaskErrorCodes.InvalidParameters]: (error: CustomError<FindTaskErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [FindTaskErrorCodes.NotFound]: (error: CustomError<FindTaskErrorCodes>) => ({
      status: 404,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [FindTaskErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { findTask };
}

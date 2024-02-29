import { assert, create } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { CreateTaskUsecase } from './create-task.usecase';
import { CreateTaskErrorCodes } from './create-task.errors';
import { TaskSchema } from '../common/task-request-schema';

export type CreateTaskController = ReturnType<typeof CreateTaskControllerFactory>;

export function CreateTaskControllerFactory(usecase: CreateTaskUsecase, logger: Logger) {
  const validate = (data: unknown) => {
    const coercedData = create(data, TaskSchema);
    assert(coercedData, TaskSchema);

    return coercedData;
  };

  const createTask = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(CreateTaskErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 201,
        body: {
          success: true,
          message: 'Task created successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        const error = err as CustomError<CreateTaskErrorCodes>;

        const mappedError = errorHandler[error.code ?? CreateTaskErrorCodes.Default](error);

        logger.error('Mapped error while creating a task', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while creating a task', err);

      return errorHandler[CreateTaskErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [CreateTaskErrorCodes.InvalidParameters]: (error: CustomError<CreateTaskErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [CreateTaskErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { createTask };
}

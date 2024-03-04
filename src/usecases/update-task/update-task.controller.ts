import { assert, create } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { UpdateTaskUsecase } from './update-task.usecase';
import { UpdateTaskErrorCodes } from './update-task.errors';
import { UpdateTaskSchema } from '../common/task-request-schema';

export type UpdateTaskController = ReturnType<typeof UpdateTaskControllerFactory>;

export function UpdateTaskControllerFactory(usecase: UpdateTaskUsecase, logger: Logger) {
  const validate = (data: unknown) => {
    const coercedData = create(data, UpdateTaskSchema);
    assert(coercedData, UpdateTaskSchema);

    return coercedData;
  };

  const updateTask = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(UpdateTaskErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 200,
        body: {
          success: true,
          message: 'Task updated successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        const error = err as CustomError<UpdateTaskErrorCodes>;

        const mappedError = errorHandler[error.code ?? UpdateTaskErrorCodes.Default](error);

        logger.error('Mapped error while updating a task', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while updating a task', err);

      return errorHandler[UpdateTaskErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [UpdateTaskErrorCodes.InvalidParameters]: (error: CustomError<UpdateTaskErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [UpdateTaskErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { updateTask };
}

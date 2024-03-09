import { assert, object, string } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { DeleteTaskUsecase } from './delete-task.usecase';
import { DeleteTaskErrorCodes } from './delete-task.errors';

export type DeleteTaskController = ReturnType<typeof DeleteTaskControllerFactory>;

export function DeleteTaskControllerFactory(usecase: DeleteTaskUsecase, logger: Logger) {
  const DeleteTaskSchema = object({
    taskId: string(),
    taskListId: string(),
  });

  const validate = (data: unknown) => {
    assert(data, DeleteTaskSchema);

    return data;
  };

  const deleteTask = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(DeleteTaskErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 200,
        body: {
          success: true,
          message: 'The task with the given ID was successfully deleted',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        const error = err as CustomError<DeleteTaskErrorCodes>;

        const mappedError = errorHandler[error.code ?? DeleteTaskErrorCodes.Default](error);

        logger.error('Mapped error while deleting a task', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while deleting a task', err);

      return errorHandler[DeleteTaskErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [DeleteTaskErrorCodes.InvalidParameters]: (error: CustomError<DeleteTaskErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [DeleteTaskErrorCodes.NotFound]: (error: CustomError<DeleteTaskErrorCodes>) => ({
      status: 404,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [DeleteTaskErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { deleteTask };
}

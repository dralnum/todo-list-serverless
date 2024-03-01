import { assert, create, object, optional } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { ListTasksUsecase } from './list-tasks.usecase';
import { ListTasksErrorCodes } from './list-tasks.errors';
import { CoercedDate } from '../common/task-request-schema';

export type ListTasksController = ReturnType<typeof ListTasksControllerFactory>;

export function ListTasksControllerFactory(usecase: ListTasksUsecase, logger: Logger) {
  const listTasksDateInput = object({
    date: optional(CoercedDate),
  });

  const validate = (data: unknown) => {
    const coercedData = create(data, listTasksDateInput);
    assert(coercedData, listTasksDateInput);

    return coercedData;
  };

  const listTasks = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(ListTasksErrorCodes.InvalidParameters, error?.message || error);
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
        const error = err as CustomError<ListTasksErrorCodes>;

        const mappedError = errorHandler[error.code ?? ListTasksErrorCodes.Default](error);

        logger.error('Mapped error while listing tasks', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while listing tasks', err);

      return errorHandler[ListTasksErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [ListTasksErrorCodes.InvalidParameters]: (error: CustomError<ListTasksErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [ListTasksErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { listTasks };
}

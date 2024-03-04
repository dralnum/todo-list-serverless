import { assert, nonempty, object, string } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { ListListsUsecase } from './list-lists.usecase';
import { ListListsErrorCodes } from './list-lists.errors';

export type ListListsController = ReturnType<typeof ListListsControllerFactory>;

export function ListListsControllerFactory(usecase: ListListsUsecase, logger: Logger) {
  const listListsSchema = object({
    username: nonempty(string()),
  });

  const validate = (data: unknown) => {
    assert(data, listListsSchema);

    return data;
  };

  const listLists = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(ListListsErrorCodes.InvalidParameters, error?.message || error);
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
        const error = err as CustomError<ListListsErrorCodes>;

        const mappedError = errorHandler[error.code ?? ListListsErrorCodes.Default](error);

        logger.error('Mapped error while listing lists', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while listing lists', err);

      return errorHandler[ListListsErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [ListListsErrorCodes.InvalidParameters]: (error: CustomError<ListListsErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [ListListsErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { listLists };
}

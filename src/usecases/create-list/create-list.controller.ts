import { assert, nonempty, object, string } from 'superstruct';

import type { Logger } from '../../clients/logger';
import { CustomError } from '../../helpers/error';

import type { CreateListUsecase } from './create-list.usecase';
import { CreateListErrorCodes } from './create-list.errors';

export type CreateListController = ReturnType<typeof CreateListControllerFactory>;

const ListSchema = object({
  username: nonempty(string()),
  title: nonempty(string()),
});

export function CreateListControllerFactory(usecase: CreateListUsecase, logger: Logger) {
  const validate = (data: unknown) => {
    assert(data, ListSchema);

    return data;
  };

  const createList = async (data: unknown) => {
    try {
      let validated;

      try {
        validated = validate(data);
      } catch (error: any) {
        throw new CustomError(CreateListErrorCodes.InvalidParameters, error?.message || error);
      }

      const response = await usecase.execute(validated);

      return {
        status: 201,
        body: {
          success: true,
          message: 'List created successfully',
          data: response.data,
        },
      };
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        const error = err as CustomError<CreateListErrorCodes>;

        const mappedError = errorHandler[error.code ?? CreateListErrorCodes.Default](error);

        logger.error('Mapped error while creating a list', mappedError);

        return mappedError;
      }

      logger.error('Unmapped error while creating a list', err);

      return errorHandler[CreateListErrorCodes.Default]();
    }
  };

  const errorHandler = {
    [CreateListErrorCodes.InvalidParameters]: (error: CustomError<CreateListErrorCodes>) => ({
      status: 400,
      body: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }),
    [CreateListErrorCodes.Default]: () => ({
      status: 500,
      body: {
        success: false,
        message: 'Internal Server Error',
      },
    }),
  };

  return { createList };
}

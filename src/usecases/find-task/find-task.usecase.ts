import { CustomError } from '../../helpers/error';
import { FindTaskErrorCodes } from './find-task.errors';
import type { FindTaskRepository } from './find-task.repository';

export type FindTaskUsecase = ReturnType<typeof FindTaskUsecaseFactory>;

export const FindTaskUsecaseFactory = (repository: FindTaskRepository) => {
  const execute = async ({ taskId, taskListId }: { taskId: string; taskListId: string }) => {
    const task = await repository.findTask(taskId, taskListId);

    if (!task) {
      throw new CustomError(FindTaskErrorCodes.NotFound, `Task not found for the given ID: ${taskId}`);
    }

    return {
      success: true,
      data: task,
    };
  };

  return { execute };
};

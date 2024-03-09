import { CustomError } from '../../helpers/error';
import { DeleteTaskErrorCodes } from './delete-task.errors';
import type { DeleteTaskRepository } from './delete-task.repository';

export type DeleteTaskUsecase = ReturnType<typeof DeleteTaskUsecaseFactory>;

export const DeleteTaskUsecaseFactory = (repository: DeleteTaskRepository) => {
  const execute = async ({ taskId, taskListId }: { taskId: string; taskListId: string }) => {
    const response = await repository.findTask(taskId, taskListId);

    if (!response) {
      throw new CustomError(DeleteTaskErrorCodes.NotFound, `Task not found for the given ID: ${taskId}`);
    }

    await repository.deleteTask(taskId, taskListId);

    return {
      success: true,
      data: { taskId },
    };
  };

  return { execute };
};

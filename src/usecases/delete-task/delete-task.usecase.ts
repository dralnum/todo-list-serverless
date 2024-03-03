import { CustomError } from '../../helpers/error';
import { DeleteTaskErrorCodes } from './delete-task.errors';
import type { DeleteTaskRepository } from './delete-task.repository';

export type DeleteTaskUsecase = ReturnType<typeof DeleteTaskUsecaseFactory>;

export const DeleteTaskUsecaseFactory = (repository: DeleteTaskRepository) => {
  const execute = async ({ taskId }: { taskId: string }) => {
    const response = await repository.deleteTask(taskId);

    if (!response) {
      throw new CustomError(DeleteTaskErrorCodes.NotFound, `Task not found for the given ID: ${taskId}`);
    }

    return {
      success: true,
      data: { taskId },
    };
  };

  return { execute };
};

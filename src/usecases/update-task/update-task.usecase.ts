import { CustomError } from '../../helpers/error';
import { UpdateTaskErrorCodes } from './update-task.errors';
import type { UpdateTaskRepository } from './update-task.repository';

export type UpdateTaskUsecase = ReturnType<typeof UpdateTaskUsecaseFactory>;

export interface Task {
  id: string;
  date: Date;
  title: string;
  description: string;
  done: boolean;
  updatedAtTimestamp: Date;
}

export interface UpdateTaskUsecaseInput {
  taskListId: string;
  taskId: string;
  date?: Date;
  title?: string;
  description?: string;
  done?: boolean;
}

export const UpdateTaskUsecaseFactory = (repository: UpdateTaskRepository) => {
  const execute = async (task: UpdateTaskUsecaseInput) => {
    const { taskListId, taskId } = task;

    const response = await repository.findTask(taskId, taskListId);

    if (!response) {
      throw new CustomError(UpdateTaskErrorCodes.NotFound, `Task not found for the given ID: ${task.taskId}`);
    }

    await repository.updateTask(task);

    return {
      success: true,
      data: task,
    };
  };

  return { execute };
};

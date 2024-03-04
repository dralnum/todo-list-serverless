import { v4 as uuid } from 'uuid';

import type { CreateTaskRepository } from './create-task.repository';
import { CustomError } from '../../helpers/error';
import { CreateTaskErrorCodes } from './create-task.errors';

export type CreateTaskUsecase = ReturnType<typeof CreateTaskUsecaseFactory>;

export interface Task {
  id: string;
  date: Date;
  title: string;
  description: string;
  done: boolean;
  createdAtTimestamp: Date;
}

interface CreateTaskUsecaseInput {
  username: string;
  taskListId: string;
  date: Date;
  title: string;
  description: string;
  done?: boolean;
}

export const CreateTaskUsecaseFactory = (repository: CreateTaskRepository) => {
  const execute = async ({ username, taskListId, date, title, description, done }: CreateTaskUsecaseInput) => {
    const list = await repository.findList(username, taskListId);

    if (!list) {
      throw new CustomError(CreateTaskErrorCodes.NotFound, `List not found for the given information: Username: ${username} - ID: ${taskListId}`);
    }

    const task: Task = {
      id: uuid(),
      date,
      title,
      description,
      createdAtTimestamp: new Date(),
      done: done ?? false,
    };

    await repository.createTask(taskListId, task);

    return {
      success: true,
      data: task,
    };
  };

  return { execute };
};

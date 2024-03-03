import { v4 as uuid } from 'uuid';

import type { CreateTaskRepository } from './create-task.repository';

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
    console.log(username);

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

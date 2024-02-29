import { v4 as uuid } from 'uuid';

import type { CreateTaskRepository } from './create-task.repository';

export type CreateTaskUsecase = ReturnType<typeof CreateTaskUsecaseFactory>;

export interface Task {
  id: string;
  date: Date;
  title: string;
  description: string;
  done: boolean;
  createdAtTimestamp: number;
}

interface CreateTaskUsecaseInput {
  date: Date;
  title: string;
  description: string;
  done?: boolean;
}

export const CreateTaskUsecaseFactory = (repository: CreateTaskRepository) => {
  const execute = async ({ date, title, description, done }: CreateTaskUsecaseInput) => {
    const task: Task = {
      id: uuid(),
      date,
      title,
      description,
      createdAtTimestamp: new Date().getTime(),
      done: done ?? false,
    };

    await repository.createTask(task);

    return {
      success: true,
      data: task,
    };
  };

  return { execute };
};

import type { ListTasksRepository } from './list-tasks.repository';

export type ListTasksUsecase = ReturnType<typeof ListTasksUsecaseFactory>;

export const ListTasksUsecaseFactory = (repository: ListTasksRepository) => {
  const execute = async ({ date }: { date?: Date }) => {
    const tasks = date !== undefined ? await repository.findTasks(date) : await repository.findAllTasks();

    return {
      success: true,
      data: tasks,
    };
  };

  return { execute };
};

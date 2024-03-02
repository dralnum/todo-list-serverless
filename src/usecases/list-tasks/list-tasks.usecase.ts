import type { ListTasksRepository } from './list-tasks.repository';

export type ListTasksUsecase = ReturnType<typeof ListTasksUsecaseFactory>;

export const ListTasksUsecaseFactory = (repository: ListTasksRepository) => {
  const execute = async ({ date }: { date?: Date }) => {
    const tasks = !date ? await repository.findAllTasks() : await repository.findTasks(date);

    return {
      success: true,
      data: tasks,
    };
  };

  return { execute };
};

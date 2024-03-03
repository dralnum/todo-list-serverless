import type { ListTasksRepository } from './list-tasks.repository';

export type ListTasksUsecase = ReturnType<typeof ListTasksUsecaseFactory>;

export const ListTasksUsecaseFactory = (repository: ListTasksRepository) => {
  const execute = async ({ date, taskListId }: { date?: Date; taskListId: string }) => {
    const tasks = !date ? await repository.findAllTasks(taskListId) : await repository.findTasks(date, taskListId);

    return {
      success: true,
      data: tasks,
    };
  };

  return { execute };
};

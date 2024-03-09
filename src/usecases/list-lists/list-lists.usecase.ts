import type { ListListsRepository } from './list-lists.repository';

export type ListListsUsecase = ReturnType<typeof ListListsUsecaseFactory>;

export const ListListsUsecaseFactory = (repository: ListListsRepository) => {
  const execute = async ({ username }: { username: string }) => {
    const lists = await repository.findLists(username);

    return {
      success: true,
      data: lists,
    };
  };

  return { execute };
};

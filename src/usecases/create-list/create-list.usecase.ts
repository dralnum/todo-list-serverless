import { v4 as uuid } from 'uuid';

import type { CreateListRepository } from './create-list.repository';

export type CreateListUsecase = ReturnType<typeof CreateListUsecaseFactory>;

export interface List {
  id: string;
  title: string;
  createdAtTimestamp: Date;
}

interface CreateListUsecaseInput {
  username: string;
  title: string;
}

export const CreateListUsecaseFactory = (repository: CreateListRepository) => {
  const execute = async ({ username, title }: CreateListUsecaseInput) => {
    const list: List = {
      id: uuid(),
      title,
      createdAtTimestamp: new Date(),
    };

    await repository.createList(username, list);

    return {
      success: true,
      data: list,
    };
  };

  return { execute };
};

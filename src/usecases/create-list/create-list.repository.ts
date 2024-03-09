import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

import type { List } from './create-list.usecase';

export type CreateListRepository = ReturnType<typeof CreateListRepositoryFactory>;

export interface DatabaseList {
  partition_key: string;
  sort_key: string;
  id: string;
  title: string;
  created_at_timestamp: number;
}

export function CreateListRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const ListToDatabase = (username: string, list: List): DatabaseList => ({
    partition_key: `${DatabaseEntityNames.Username}#${username}`,
    sort_key: `${DatabaseEntityNames.TaskListId}#${list.id}`,
    id: list.id,
    title: list.title,
    created_at_timestamp: list.createdAtTimestamp.getTime(),
  });

  const createList = async (username: string, data: List) => {
    const response = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: ListToDatabase(username, data),
    });

    return response;
  };

  return { createList };
}

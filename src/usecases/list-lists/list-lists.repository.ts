import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

export type ListListsRepository = ReturnType<typeof ListListsRepositoryFactory>;

interface List {
  id: string;
  title: string;
}

interface DatabaseList {
  partition_key: string;
  sort_key: string;
  id: string;
  title: string;
  created_at_timestamp: number;
}

export function ListListsRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const databaseListToDomain = (databaseList: DatabaseList): List => ({
    id: databaseList.id,
    title: databaseList.title,
  });

  const findLists = async (username: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: `partition_key=:partition_key and begins_with(sort_key,:sort_key)`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.Username}#${username}`,
        ':sort_key': `${DatabaseEntityNames.TaskListId}#`,
      },
    });

    const lists = response.Items as DatabaseList[];

    return lists.map(databaseListToDomain);
  };

  return { findLists };
}

import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

export type ListTasksRepository = ReturnType<typeof ListTasksRepositoryFactory>;

interface Task {
  id: string;
  date: Date;
  title: string;
  done: boolean;
}

interface DatabaseTask {
  partition_key: string;
  sort_key: string;
  id: string;
  date_timestamp: number;
  title: string;
  description: string;
  done: boolean;
  created_at_timestamp: number;
}

export function ListTasksRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const databaseTaskToDomain = (databaseTask: DatabaseTask): Task => ({
    id: databaseTask.id,
    date: new Date(databaseTask.date_timestamp),
    title: databaseTask.title,
    done: databaseTask.done,
  });

  const findAllTasks = async () => {
    const response = await dynamoDBClient.scan({
      TableName: config.dynamoDBTableName,
      FilterExpression: 'contains (partition_key, :partition_key)',
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.task}#`,
      },
    });

    const tasks = response.Items as DatabaseTask[];

    return tasks.map(databaseTaskToDomain);
  };

  const findTasks = async (date: Date) => {
    const sortKey = `${DatabaseEntityNames.date}#${date.toLocaleDateString('en-US')}`;

    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      IndexName: config.dynamoDBDailyTasksIndexName,
      KeyConditionExpression: `sort_key=:sort_key and begins_with(partition_key,:partition_key)`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.task}#`,
        ':sort_key': sortKey,
      },
    });

    const tasks = response.Items as DatabaseTask[];

    return tasks.map(databaseTaskToDomain);
  };

  return { findAllTasks, findTasks };
}

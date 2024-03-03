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

  const findAllTasks = async taskListId => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      KeyConditionExpression: `partition_key=:partition_key and begins_with(sort_key,:sort_key)`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.TaskListId}#${taskListId}`,
        ':sort_key': `${DatabaseEntityNames.TaskId}#`,
      },
    });

    const tasks = response.Items as DatabaseTask[];

    return tasks.map(databaseTaskToDomain);
  };

  const findTasks = async (date: Date, taskListId: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      IndexName: config.dynamoDBDailyTasksIndexName,
      KeyConditionExpression: `partition_key=:partition_key and date_string=:date_string`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.TaskListId}#${taskListId}`,
        ':date_string': date.toLocaleDateString('en-US'),
      },
    });

    const tasks = response.Items as DatabaseTask[];

    return tasks.map(databaseTaskToDomain);
  };

  return { findAllTasks, findTasks };
}

import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';
import { Task } from '../create-task/create-task.usecase';

export type FindTaskRepository = ReturnType<typeof FindTaskRepositoryFactory>;

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

export function FindTaskRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const databaseTaskToDomain = (databaseTask: DatabaseTask): Task => ({
    id: databaseTask.id,
    date: new Date(databaseTask.date_timestamp),
    title: databaseTask.title,
    description: databaseTask.description,
    done: databaseTask.done,
    createdAtTimestamp: new Date(databaseTask.created_at_timestamp),
  });

  const findTask = async (taskId: string, taskListId: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      Limit: 1,
      KeyConditionExpression: `partition_key=:partition_key and sort_key=:sort_key`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.TaskListId}#${taskListId}`,
        ':sort_key': `${DatabaseEntityNames.TaskId}#${taskId}`,
      },
    });

    const [task] = response.Items as DatabaseTask[];

    return !task ? undefined : databaseTaskToDomain(task);
  };

  return { findTask };
}

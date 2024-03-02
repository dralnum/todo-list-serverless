import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

import type { Task } from './create-task.usecase';

export type CreateTaskRepository = ReturnType<typeof CreateTaskRepositoryFactory>;

export interface DatabaseTask {
  partition_key: string;
  sort_key: string;
  id: string;
  date_timestamp: number;
  title: string;
  description: string;
  done: boolean;
  created_at_timestamp: number;
}

export function CreateTaskRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const TaskToDatabase = (task: Task): DatabaseTask => ({
    partition_key: `${DatabaseEntityNames.task}#${task.id}`,
    sort_key: `${DatabaseEntityNames.date}#${task.date.toLocaleDateString('en-US')}`,
    id: task.id,
    date_timestamp: task.date.getTime(),
    title: task.title,
    description: task.description,
    done: task.done,
    created_at_timestamp: task.createdAtTimestamp.getTime(),
  });

  const createTask = async (data: Task) => {
    const response = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: TaskToDatabase(data),
    });

    return response;
  };

  return { createTask };
}

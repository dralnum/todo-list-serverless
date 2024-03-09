import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

import type { Task } from './create-task.usecase';
import { DatabaseList } from '../create-list/create-list.repository';

export type CreateTaskRepository = ReturnType<typeof CreateTaskRepositoryFactory>;

export interface DatabaseTask {
  partition_key: string;
  sort_key: string;
  id: string;
  date_string: string;
  date_timestamp: number;
  title: string;
  description: string;
  done: boolean;
  created_at_timestamp: number;
}

interface List {
  id: string;
  title: string;
}

export function CreateTaskRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const TaskToDatabase = (taskListId: string, task: Task): DatabaseTask => ({
    partition_key: `${DatabaseEntityNames.TaskListId}#${taskListId}`,
    sort_key: `${DatabaseEntityNames.TaskId}#${task.id}`,
    id: task.id,
    date_string: task.date.toLocaleDateString('en-US'),
    date_timestamp: task.date.getTime(),
    title: task.title,
    description: task.description,
    done: task.done,
    created_at_timestamp: task.createdAtTimestamp.getTime(),
  });

  const createTask = async (taskListId: string, data: Task) => {
    const response = await dynamoDBClient.put({
      TableName: config.dynamoDBTableName,
      Item: TaskToDatabase(taskListId, data),
    });

    return response;
  };

  const databaseListToDomain = (databaseList: DatabaseList): List => ({
    id: databaseList.id,
    title: databaseList.title,
  });

  const findList = async (username: string, taskListId: string) => {
    const response = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      Limit: 1,
      KeyConditionExpression: `partition_key=:partition_key and sort_key=:sort_key`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.Username}#${username}`,
        ':sort_key': `${DatabaseEntityNames.TaskListId}#${taskListId}`,
      },
    });

    const [list] = response.Items as DatabaseList[];

    return !list ? undefined : databaseListToDomain(list);
  };

  return { createTask, findList };
}

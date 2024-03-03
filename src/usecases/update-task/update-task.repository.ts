import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

import { UpdateTaskUsecaseInput } from './update-task.usecase';
import { objectToUpdateExpression, objectToUpdateExpressionAttributeValues } from '../../helpers/dynamodb';
import { FindTaskRepositoryFactory } from '../find-task/find-task.repository';
export type UpdateTaskRepository = ReturnType<typeof UpdateTaskRepositoryFactory>;

type Attributes = { [key: string]: string | number | boolean };

export interface DatabaseTask extends Attributes {
  date_timestamp: number;
  title: string;
  description: string;
  done: boolean;
}

export function UpdateTaskRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const taskToDatabase = (task: UpdateTaskUsecaseInput): DatabaseTask => ({
    date_timestamp: task.date ? task.date.getTime() : undefined,
    title: task.title,
    description: task.description,
    done: task.done,
  });

  const updateTask = async (data: UpdateTaskUsecaseInput) => {
    const response = await dynamoDBClient.update({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `${DatabaseEntityNames.TaskListId}#${data.taskListId}`,
        sort_key: `${DatabaseEntityNames.TaskId}#${data.taskId}`,
      },
      UpdateExpression: objectToUpdateExpression(taskToDatabase(data)),
      ExpressionAttributeValues: objectToUpdateExpressionAttributeValues(taskToDatabase(data)),
      ConditionExpression: 'attribute_exists(partition_key) and attribute_exists(sort_key)',
    });

    return response;
  };

  return { updateTask, findTask: FindTaskRepositoryFactory(dynamoDBClient).findTask };
}

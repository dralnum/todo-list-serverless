import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';

import { UpdateTaskUsecaseInput } from './update-task.usecase';
import { objectToUpdateExpression, objectToUpdateExpressionAttributeValues } from '../../helpers/dynamodb';

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
    const tasks = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      Limit: 1,
      KeyConditionExpression: `partition_key=:partition_key and begins_with(sort_key,:sort_key)`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.task}#${data.taskId}`,
        ':sort_key': `${DatabaseEntityNames.date}#`,
      },
    });

    const [task] = tasks.Items as DatabaseTask[];

    if (!task) {
      return undefined;
    }

    const sortKey = task.sort_key;

    const response = await dynamoDBClient.update({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `${DatabaseEntityNames.task}#${data.taskId}`,
        sort_key: sortKey,
      },
      UpdateExpression: objectToUpdateExpression(taskToDatabase(data)),
      ExpressionAttributeValues: objectToUpdateExpressionAttributeValues(taskToDatabase(data)),
      ConditionExpression: 'attribute_exists(partition_key) and attribute_exists(sort_key)',
    });

    return response;
  };

  return { updateTask };
}

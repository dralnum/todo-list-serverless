import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';
import { DatabaseTask } from '../create-task/create-task.repository';

export type DeleteTaskRepository = ReturnType<typeof DeleteTaskRepositoryFactory>;

export function DeleteTaskRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const deleteTask = async (taskId: string) => {
    const tasks = await dynamoDBClient.query({
      TableName: config.dynamoDBTableName,
      Limit: 1,
      KeyConditionExpression: `partition_key=:partition_key and begins_with(sort_key,:sort_key)`,
      ExpressionAttributeValues: {
        ':partition_key': `${DatabaseEntityNames.task}#${taskId}`,
        ':sort_key': `${DatabaseEntityNames.date}#`,
      },
    });

    const [task] = tasks.Items as DatabaseTask[];

    if (!task) {
      return undefined;
    }

    const sortKey = task.sort_key;

    const response = await dynamoDBClient.deleteItem({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `${DatabaseEntityNames.task}#${taskId}`,
        sort_key: sortKey,
      },
    });

    return response;
  };

  return { deleteTask };
}

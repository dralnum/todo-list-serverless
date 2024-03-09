import type { DynamoDBClient } from '../../clients/dynamodb';
import { DatabaseEntityNames } from '../../helpers/constants';
import { config } from '../../config';
import { FindTaskRepositoryFactory } from '../find-task/find-task.repository';

export type DeleteTaskRepository = ReturnType<typeof DeleteTaskRepositoryFactory>;

export function DeleteTaskRepositoryFactory(dynamoDBClient: DynamoDBClient) {
  const deleteTask = async (taskId: string, taskListId: string) => {
    const response = await dynamoDBClient.deleteItem({
      TableName: config.dynamoDBTableName,
      Key: {
        partition_key: `${DatabaseEntityNames.TaskListId}#${taskListId}`,
        sort_key: `${DatabaseEntityNames.TaskId}#${taskId}`,
      },
    });

    return response;
  };

  return { deleteTask, findTask: FindTaskRepositoryFactory(dynamoDBClient).findTask };
}

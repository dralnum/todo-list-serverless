import type { DynamoDBClient as AWSSDKDynamoDBClient } from '@aws-sdk/client-dynamodb';
import type { PutCommandInput, QueryCommandInput, UpdateCommandInput, DeleteCommandInput, ScanCommandInput } from '@aws-sdk/lib-dynamodb';
import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import type { Logger } from '../logger';

export type DynamoDBClient = ReturnType<typeof DynamoDBClientFactory>;

export function DynamoDBClientFactory(awsSdkDynamoDbClient: AWSSDKDynamoDBClient, logger: Logger) {
  const documentClient = DynamoDBDocumentClient.from(awsSdkDynamoDbClient, { marshallOptions: { removeUndefinedValues: true } });

  async function put(params: PutCommandInput) {
    logger.info(`[DynamoDBClient][Start] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);
    logger.start(`[DynamoDBClient] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);
    const command = new PutCommand(params);
    const response = await documentClient.send(command);
    logger.end(`[DynamoDBClient] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);
    logger.info(`[DynamoDBClient][End] put(${params.TableName}, ${params?.Item?.partition_key}, ${params?.Item?.sort_key})`);

    return response;
  }

  async function query(params: QueryCommandInput) {
    const partitionKey = params?.ExpressionAttributeValues?.[':partition_key'];
    const sortKey = params?.ExpressionAttributeValues?.[':sort_key'];

    logger.info(`[DynamoDBClient][Start] query(${params.TableName}, ${partitionKey}, ${sortKey})`);
    logger.start(`[DynamoDBClient] query(${params.TableName}, ${partitionKey}, ${sortKey})`);
    const command = new QueryCommand(params);
    const response = await documentClient.send(command);
    logger.end(`[DynamoDBClient] query(${params.TableName}, ${partitionKey}, ${sortKey})`);
    logger.info(`[DynamoDBClient][End] query(${params.TableName}, ${partitionKey}, ${sortKey})`);

    return response;
  }

  async function update(params: UpdateCommandInput) {
    const partitionKey = params.Key?.partition_key;
    const sortKey = params?.Key?.sort_key;

    logger.info(`[DynamoDBClient][Start] update(${params.TableName}, ${partitionKey}, ${sortKey})`);
    logger.start(`[DynamoDBClient] update(${params.TableName}, ${partitionKey}, ${sortKey})`);
    const command = new UpdateCommand(params);
    const response = await documentClient.send(command);
    logger.end(`[DynamoDBClient] update(${params.TableName}, ${partitionKey}, ${sortKey})`);
    logger.info(`[DynamoDBClient][End] update(${params.TableName}, ${partitionKey}, ${sortKey})`);

    return response;
  }

  async function deleteItem(params: DeleteCommandInput) {
    const partitionKey = params.Key?.partition_key;
    const sortKey = params?.Key?.sort_key;

    logger.info(`[DynamoDBClient][Start] deleteItem(${params.TableName}, ${partitionKey}, ${sortKey})`);
    logger.start(`[DynamoDBClient] deleteItem(${params.TableName}, ${partitionKey}, ${sortKey})`);
    const command = new DeleteCommand(params);
    const response = await documentClient.send(command);
    logger.end(`[DynamoDBClient] deleteItem(${params.TableName}, ${partitionKey}, ${sortKey})`);
    logger.info(`[DynamoDBClient][End] deleteItem(${params.TableName}, ${partitionKey}, ${sortKey})`);

    return response;
  }

  async function scan(params: ScanCommandInput) {
    logger.info(`[DynamoDBClient][Start] scan(${JSON.stringify(params)})`);
    logger.start(`[DynamoDBClient] scan(${JSON.stringify(params)})`);
    const command = new ScanCommand(params);
    const response = await documentClient.send(command);
    logger.end(`[DynamoDBClient] scan(${JSON.stringify(params)})`);
    logger.info(`[DynamoDBClient][End] scan(${JSON.stringify(params)})`);

    return response;
  }

  return {
    put,
    query,
    update,
    deleteItem,
    scan,
  };
}

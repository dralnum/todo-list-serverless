import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { DeleteTaskRepositoryFactory } from './delete-task.repository';
import { DeleteTaskUsecaseFactory } from './delete-task.usecase';
import { DeleteTaskControllerFactory } from './delete-task.controller';
import { DeleteTaskHandlerFactory } from './delete-task.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = DeleteTaskRepositoryFactory(dynamoDbClient);
const usecase = DeleteTaskUsecaseFactory(repository);
const controller = DeleteTaskControllerFactory(usecase, logger);

export const { handler } = DeleteTaskHandlerFactory(controller, logger);

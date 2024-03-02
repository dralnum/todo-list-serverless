import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { FindTaskRepositoryFactory } from './find-task.repository';
import { FindTaskUsecaseFactory } from './find-task.usecase';
import { FindTaskControllerFactory } from './find-task.controller';
import { FindTaskHandlerFactory } from './find-task.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = FindTaskRepositoryFactory(dynamoDbClient);
const usecase = FindTaskUsecaseFactory(repository);
const controller = FindTaskControllerFactory(usecase, logger);

export const { handler } = FindTaskHandlerFactory(controller, logger);

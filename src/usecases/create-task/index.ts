import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { CreateTaskRepositoryFactory } from './create-task.repository';
import { CreateTaskUsecaseFactory } from './create-task.usecase';
import { CreateTaskControllerFactory } from './create-task.controller';
import { CreateTaskHandlerFactory } from './create-task.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = CreateTaskRepositoryFactory(dynamoDbClient);
const usecase = CreateTaskUsecaseFactory(repository);
const controller = CreateTaskControllerFactory(usecase, logger);

export const { handler } = CreateTaskHandlerFactory(controller, logger);

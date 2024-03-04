import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { UpdateTaskRepositoryFactory } from './update-task.repository';
import { UpdateTaskUsecaseFactory } from './update-task.usecase';
import { UpdateTaskControllerFactory } from './update-task.controller';
import { UpdateTaskHandlerFactory } from './update-task.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = UpdateTaskRepositoryFactory(dynamoDbClient);
const usecase = UpdateTaskUsecaseFactory(repository);
const controller = UpdateTaskControllerFactory(usecase, logger);

export const { handler } = UpdateTaskHandlerFactory(controller, logger);

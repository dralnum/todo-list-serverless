import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { ListTasksRepositoryFactory } from './list-tasks.repository';
import { ListTasksUsecaseFactory } from './list-tasks.usecase';
import { ListTasksControllerFactory } from './list-tasks.controller';
import { ListTasksHandlerFactory } from './list-tasks.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = ListTasksRepositoryFactory(dynamoDbClient);
const usecase = ListTasksUsecaseFactory(repository);
const controller = ListTasksControllerFactory(usecase, logger);

export const { handler } = ListTasksHandlerFactory(controller, logger);

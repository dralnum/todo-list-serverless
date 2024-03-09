import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { CreateListRepositoryFactory } from './create-list.repository';
import { CreateListUsecaseFactory } from './create-list.usecase';
import { CreateListControllerFactory } from './create-list.controller';
import { CreateListHandlerFactory } from './create-list.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = CreateListRepositoryFactory(dynamoDbClient);
const usecase = CreateListUsecaseFactory(repository);
const controller = CreateListControllerFactory(usecase, logger);

export const { handler } = CreateListHandlerFactory(controller, logger);

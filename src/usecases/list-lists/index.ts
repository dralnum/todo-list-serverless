import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { LoggerFactory } from '../../clients/logger';
import { DynamoDBClientFactory } from '../../clients/dynamodb';
import { config } from '../../config';

import { ListListsRepositoryFactory } from './list-lists.repository';
import { ListListsUsecaseFactory } from './list-lists.usecase';
import { ListListsControllerFactory } from './list-lists.controller';
import { ListListsHandlerFactory } from './list-lists.handler';

const logger = LoggerFactory(config.serviceName, config.activeEnv);
const dynamoDbClient = DynamoDBClientFactory(new DynamoDBClient({}), logger);

const repository = ListListsRepositoryFactory(dynamoDbClient);
const usecase = ListListsUsecaseFactory(repository);
const controller = ListListsControllerFactory(usecase, logger);

export const { handler } = ListListsHandlerFactory(controller, logger);

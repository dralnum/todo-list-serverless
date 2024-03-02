import type { Logger } from '../../clients/logger';
import { APIGatewayEvent } from 'aws-lambda';

import { ListTasksController } from './list-tasks.controller';

export function ListTasksHandlerFactory(controller: ListTasksController, logger: Logger) {
  const handler = async (event: APIGatewayEvent) => {
    const requestId = event?.headers?.['requestId'];
    if (requestId) {
      logger.setRequestId(requestId);
    }

    const data = {
      ...JSON.parse(event?.body || '{}'),
      ...(event?.queryStringParameters || {}),
    };

    const response = await controller.listTasks(data);

    return {
      statusCode: response.status,
      body: JSON.stringify(response.body ?? {}),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  };

  return { handler };
}

import type { Logger } from '../../clients/logger';
import { APIGatewayEvent } from 'aws-lambda';

import { DeleteTaskController } from './delete-task.controller';

export function DeleteTaskHandlerFactory(controller: DeleteTaskController, logger: Logger) {
  const handler = async (event: APIGatewayEvent) => {
    const requestId = event?.headers?.['requestId'];
    if (requestId) {
      logger.setRequestId(requestId);
    }

    const data = {
      ...JSON.parse(event?.body || '{}'),
      ...(event?.pathParameters || {}),
    };

    const response = await controller.deleteTask(data);

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

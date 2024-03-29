const config = {
  activeEnv: process.env.NODE_ENV || 'dev',
  serviceName: 'todo-list',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamoDBTableName: String(process.env.DYNAMODB_TABLE_NAME),
  dynamoDBDailyTasksIndexName: String(process.env.DYNAMODB_DAILY_TASKS_INDEX_NAME),
};

export { config };

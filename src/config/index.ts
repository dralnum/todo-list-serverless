const config = {
  activeEnv: process.env.NODE_ENV || 'dev',
  serviceName: 'todo-list',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  dynamoDBDefaultTableName: String(process.env.DYNAMODB_DEFAULT_TABLE_NAME),
};

export { config };

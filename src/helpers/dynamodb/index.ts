export const objectToUpdateExpression = (attributes: { [key: string]: string | undefined | number | boolean }) =>
  Object.entries(attributes)
    .reduce((acc, [key, value]) => {
      return value ? `${acc} ${key}=:${key},` : acc;
    }, 'set')
    .slice(0, -1);

export const objectToUpdateExpressionAttributeValues = (attributes: { [key: string]: string | undefined | number | boolean }) =>
  Object.entries(attributes).reduce((acc, [key, value]) => {
    return value ? { ...acc, [`:${key}`]: value } : acc;
  }, {});

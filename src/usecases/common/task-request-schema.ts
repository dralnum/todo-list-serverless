import { boolean, coerce, date, nonempty, object, optional, string } from 'superstruct';

const CoercedDate = coerce(date(), string(), dateString => {
  return new Date(dateString);
});

export const TaskSchema = object({
  date: CoercedDate,
  title: nonempty(string()),
  description: nonempty(string()),
  done: optional(boolean()),
});

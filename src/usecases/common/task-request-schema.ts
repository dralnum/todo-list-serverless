import { boolean, coerce, date, nonempty, object, optional, string } from 'superstruct';

export const CoercedDate = coerce(date(), string(), dateString => {
  return new Date(dateString);
});

export const TaskSchema = object({
  username: nonempty(string()),
  taskListId: string(),
  date: CoercedDate,
  title: nonempty(string()),
  description: nonempty(string()),
  done: optional(boolean()),
});

export const UpdateTaskSchema = object({
  taskListId: string(),
  taskId: string(),
  title: optional(nonempty(string())),
  description: optional(nonempty(string())),
  done: optional(boolean()),
});

import { validate } from "uuid";

export const validateCursorData = (cursor: {value: string; type: string}) => {
  return ['prev', 'next'].includes(cursor.type)
  && validate(cursor.value);
}
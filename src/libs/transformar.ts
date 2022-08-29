import { Transform } from 'class-transformer';
import { isString } from 'class-validator';

export const Trim = (): PropertyDecorator => Transform(({ value }) => (isString(value) ? value.trim() : value));

export const ToLowerCase = (): PropertyDecorator =>
  Transform(({ value }) => (isString(value) ? value.toLowerCase() : value));

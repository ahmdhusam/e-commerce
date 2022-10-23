import { Transform } from 'class-transformer';
import { isNumber, isString } from 'class-validator';
import * as sanitize from 'sanitize-html';

export const Trim = (): PropertyDecorator => Transform(({ value }) => (isString(value) ? value.trim() : value));

export const ToLowerCase = (): PropertyDecorator =>
  Transform(({ value }) => (isString(value) ? value.toLowerCase() : value));

export const ParsePrice = (): PropertyDecorator =>
  Transform(({ value }) => (isNumber(value) ? +value.toFixed(2) : value));

export const SanitizeHTML = (): PropertyDecorator =>
  Transform(({ value }) => (isString(value) ? sanitize(value) : value));

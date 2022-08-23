import { Transform } from 'class-transformer';

export const Trim = (): PropertyDecorator => Transform(params => params.value.trim());
export const ToLowerCase = (): PropertyDecorator => Transform(params => params.value.toLowerCase());

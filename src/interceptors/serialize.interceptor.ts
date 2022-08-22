import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: string[]): {};
}

export const UseSerialize = (Dto: ClassConstructor) => UseInterceptors(new SerializeInterceptor(Dto));

@Injectable()
class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly Dto: ClassConstructor) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(value => plainToClass(this.Dto, value, { excludeExtraneousValues: true })));
  }
}

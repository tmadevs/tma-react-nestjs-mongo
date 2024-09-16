import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectJwtSubject = createParamDecorator(
  (context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    return ctx.getRequest().user;
  },
);

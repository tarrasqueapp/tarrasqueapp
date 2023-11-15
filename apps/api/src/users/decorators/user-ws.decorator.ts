import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserWs = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToWs().getClient().handshake;
  return request.user;
});

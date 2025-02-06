import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): User | string | number | Date => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    const user = request.user;

    if (data) {
      return user[data as keyof User];
    }
    return user;
  },
);
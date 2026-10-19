import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  /** Opaque refresh-token session/device identifier. */
  sid: string;
  /** Unix timestamp of the last password or MFA authentication. */
  reauthAt: number;
  mfa?: true;
  mfaPending?: true;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);

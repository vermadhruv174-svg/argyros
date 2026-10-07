import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: { role: string } }>();
    const role = req.user?.role;
    if (role === 'ADMIN' || role === 'STAFF') return true;
    throw new ForbiddenException('Staff access required.');
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { JwtPayload } from '../auth/current-user.decorator';
import { getOwnerEmail, isMfaEnforcementEnabled, normalizeEmail } from '../config/runtime';

export const RECENT_REAUTH_WINDOW_SECONDS = 10 * 60;

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: { role: string } }>();
    const role = req.user?.role;
    if (role === 'ADMIN' || role === 'STAFF') return true;
    throw new ForbiddenException('Staff access required.');
  }
}

/**
 * Protects the sensitive Owner Space routes with a server-side identity
 * allowlist. The browser cannot grant itself owner access: the email and role
 * come from the verified, signed JWT and are checked against server policy.
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: Pick<JwtPayload, 'email' | 'role' | 'mfa'>;
    }>();
    const ownerEmail = getOwnerEmail();

    if (!ownerEmail || normalizeEmail(req.user?.email) !== ownerEmail || req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Owner access required.');
    }

    if (isMfaEnforcementEnabled() && req.user?.mfa !== true) {
      throw new ForbiddenException('MFA verification required.');
    }

    return true;
  }
}

/**
 * Used only by the enrollment endpoints. It proves the signed JWT belongs to
 * the configured owner without granting access to Owner Space mutations.
 */
@Injectable()
export class OwnerIdentityGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: Pick<JwtPayload, 'email' | 'role'> }>();
    const ownerEmail = getOwnerEmail();

    if (!ownerEmail || normalizeEmail(req.user?.email) !== ownerEmail || req.user?.role !== 'ADMIN') {
      throw new ForbiddenException('Owner access required.');
    }

    return true;
  }
}

/**
 * Owner Space writes must follow a recent password or MFA authentication. A
 * refresh-token rotation preserves the original reauth timestamp, so merely
 * keeping a browser session alive cannot extend this window.
 */
@Injectable()
export class RecentOwnerAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ user?: Pick<JwtPayload, 'reauthAt'> }>();
    const reauthAt = req.user?.reauthAt;
    const age = Math.floor(Date.now() / 1000) - (reauthAt ?? 0);

    if (!Number.isInteger(reauthAt) || age < 0 || age > RECENT_REAUTH_WINDOW_SECONDS) {
      throw new ForbiddenException('Recent re-authentication required.');
    }

    return true;
  }
}

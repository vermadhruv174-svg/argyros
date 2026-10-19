import 'reflect-metadata';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OwnerGuard } from '../admin/roles.guard';
import type { AuthService } from './auth.service';

describe('AuthController owner session endpoints', () => {
  it('requires JWT authentication and the server-side owner guard', () => {
    for (const method of ['listSessions', 'revokeSession', 'revokeAllSessions']) {
      expect(Reflect.getMetadata('__guards__', AuthController.prototype[method as keyof AuthController])).toEqual([
        JwtAuthGuard,
        OwnerGuard,
      ]);
    }
  });

  it('passes the signed session id to the session list without adding secrets', async () => {
    const listSessions = jest.fn().mockResolvedValue({ sessions: [{ id: 'session-1', current: true }] });
    const controller = new AuthController({ listSessions } as unknown as AuthService);
    const response = await controller.listSessions({
      sub: 'owner-id',
      email: 'owner@example.com',
      role: 'ADMIN',
      sid: 'session-1',
      reauthAt: Math.floor(Date.now() / 1000),
    });

    expect(listSessions).toHaveBeenCalledWith('owner-id', 'session-1');
    expect(response).toEqual({ sessions: [{ id: 'session-1', current: true }] });
    expect(JSON.stringify(response)).not.toMatch(/token|secret|password/i);
  });
});

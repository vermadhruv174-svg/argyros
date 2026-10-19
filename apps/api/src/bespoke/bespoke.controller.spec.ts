import { BespokeController } from './bespoke.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecentOwnerAuthGuard, StaffGuard } from '../admin/roles.guard';

describe('BespokeController admin mutations', () => {
  it('requires authentication, staff authorization, and recent re-authentication', () => {
    expect(Reflect.getMetadata('__guards__', BespokeController.prototype.updateStatus)).toEqual([
      JwtAuthGuard,
      StaffGuard,
      RecentOwnerAuthGuard,
    ]);
  });

  it('records the actor, object, result, and request metadata', async () => {
    const before = {
      id: 'inquiry-1',
      referenceNumber: 'BSP-001',
      status: 'RECEIVED',
    };
    const after = {
      ...before,
      status: 'IN_DISCUSSION',
    };
    const bespokeService = {
      getAuditSnapshot: jest.fn().mockResolvedValue(before),
      updateStatus: jest.fn().mockResolvedValue(after),
    };
    const auditService = { record: jest.fn().mockResolvedValue({ id: 'audit-1' }) };
    const controller = new BespokeController(bespokeService as never, auditService as never);
    const request = {
      method: 'PATCH',
      ip: '203.0.113.10',
      header: jest.fn((name: string) => {
        if (name === 'x-request-id') return 'request-1';
        if (name === 'user-agent') return 'owner-browser';
        return undefined;
      }),
    };

    await controller.updateStatus(
      'inquiry-1',
      { status: 'IN_DISCUSSION', adminNotes: 'Owner reviewed' } as never,
      request as never,
      { sub: 'owner-1' } as never,
    );

    expect(auditService.record).toHaveBeenCalledWith({
      actor: 'owner-1',
      action: 'bespoke.status',
      resource: 'bespoke:inquiry-1',
      requestId: 'request-1',
      before,
      after,
      reason: 'Owner reviewed',
      metadata: {
        httpMethod: 'PATCH',
        ipAddress: '203.0.113.10',
        userAgent: 'owner-browser',
      },
    });
  });
});

import { AuditService } from './audit.service';

describe('AuditService', () => {
  it('creates an append-only event with the actor, request ID, and safe metadata', async () => {
    const create = jest.fn().mockResolvedValue({ id: 'audit-1' });
    const service = new AuditService({ auditEvent: { create } } as never);

    await service.record({
      actor: 'owner-id',
      action: 'product.publish',
      resource: 'product:product-1',
      requestId: 'request-1',
      metadata: { status: 'ACTIVE' },
    });

    expect(create).toHaveBeenCalledWith({
      data: {
        actor: 'owner-id',
        action: 'product.publish',
        resource: 'product:product-1',
        requestId: 'request-1',
        metadata: { status: 'ACTIVE' },
      },
    });
  });
});

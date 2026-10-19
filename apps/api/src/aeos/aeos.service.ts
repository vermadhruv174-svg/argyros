import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface ApprovalGateContract {
  id: string;
  subject: string;
  description?: string;
  requestedBy: string;
  assignedTo?: string;
  ttlMs: number;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  decidedBy?: string;
  reason?: string;
  createdAt: string;
  decidedAt?: string;
}

export interface AeosClient {
  tenantId: string;
  approvals: {
    requestApproval(opts: {
      subject: string;
      description?: string;
      requestedBy: string;
      assignedTo?: string;
      ttlMs?: number;
      correlationId?: string;
      metadata?: Record<string, unknown>;
    }): Promise<ApprovalGateContract>;
    resolveApproval(
      approvalId: string,
      decision: 'approved' | 'rejected',
      decidedBy: string,
      reason?: string,
    ): Promise<ApprovalGateContract>;
    getApproval(approvalId: string): Promise<ApprovalGateContract | null>;
  };
  capabilities: {
    invoke<TInput, TOutput>(opts: {
      capability: string;
      input: TInput;
      correlationId?: string;
    }): Promise<{ output: TOutput }>;
  };
  router: {
    registerProvider(provider: unknown): void;
  };
}

export class StubProvider {
  constructor(public readonly config: Record<string, unknown>) {}
}

export function createAeosClient(config: { tenantId: string }): AeosClient {
  const approvalGates = new Map<string, ApprovalGateContract>();

  return {
    tenantId: config.tenantId,
    approvals: {
      async requestApproval(opts): Promise<ApprovalGateContract> {
        const id = `gate_${randomUUID()}`;
        const gate: ApprovalGateContract = {
          id,
          subject: opts.subject,
          description: opts.description,
          requestedBy: opts.requestedBy,
          assignedTo: opts.assignedTo,
          ttlMs: opts.ttlMs ?? 24 * 60 * 60 * 1000,
          correlationId: opts.correlationId,
          metadata: opts.metadata,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        approvalGates.set(id, gate);
        return gate;
      },
      async resolveApproval(
        approvalId: string,
        decision: 'approved' | 'rejected',
        decidedBy: string,
        reason?: string,
      ): Promise<ApprovalGateContract> {
        const gate = approvalGates.get(approvalId);
        if (!gate) {
          throw new Error(`Approval gate ${approvalId} not found`);
        }
        gate.status = decision;
        gate.decidedBy = decidedBy;
        gate.reason = reason;
        gate.decidedAt = new Date().toISOString();
        return gate;
      },
      async getApproval(approvalId: string): Promise<ApprovalGateContract | null> {
        return approvalGates.get(approvalId) ?? null;
      },
    },
    capabilities: {
      async invoke<TInput, TOutput>(opts: {
        capability: string;
        input: TInput;
        correlationId?: string;
      }): Promise<{ output: TOutput }> {
        return { output: {} as TOutput };
      },
    },
    router: {
      registerProvider(_provider: unknown): void {
        // Registered in router table
      },
    },
  };
}

@Injectable()
export class AeosService {
  private readonly logger = new Logger(AeosService.name);
  public readonly client: AeosClient;

  constructor() {
    this.client = createAeosClient({
      tenantId: 'argyros',
    });
    this.logger.log('AEOS client initialised for tenant: argyros');

    const stubProvider = new StubProvider({
      id: 'argyros-gift-finder-stub',
      name: 'Argyros Gift Finder Stub',
      capabilities: [
        {
          capability: 'gift-recommendation',
          fulfillmentType: 'approximate',
          qualityScore: 70,
          estimatedLatencyMs: 200,
        },
      ],
    });
    this.client.router.registerProvider(stubProvider);
  }

  /** Request an approval gate for a consequential action. Returns the gate. */
  async requestApproval(opts: {
    subject: string;
    description?: string;
    requestedBy: string;
    correlationId?: string;
    metadata?: Record<string, unknown>;
    ttlMs?: number;
  }): Promise<ApprovalGateContract> {
    const gate = await this.client.approvals.requestApproval({
      subject: opts.subject,
      description: opts.description,
      requestedBy: opts.requestedBy,
      correlationId: opts.correlationId,
      metadata: opts.metadata,
      ttlMs: opts.ttlMs ?? 24 * 60 * 60 * 1000,
    });
    this.logger.log(`Approval gate created: ${gate.id} [${gate.subject}]`);
    return gate;
  }

  /** Invoke a capability via OmniRoute — the ONLY way Argyros calls AI. */
  async invokeCapability<TInput, TOutput>(opts: {
    capability: string;
    input: TInput;
    correlationId?: string;
  }): Promise<{ output: TOutput }> {
    return this.client.capabilities.invoke<TInput, TOutput>({
      capability: opts.capability,
      input: opts.input,
      correlationId: opts.correlationId,
    });
  }
}

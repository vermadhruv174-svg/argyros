import { Injectable, Logger } from '@nestjs/common';
import { createAeosClient, type AeosClient } from '@aeos/sdk';
import { StubProvider } from '@aeos/omni-route';

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
          capability: 'gift-recommendation' as never,
          fulfillmentType: 'approximate',
          qualityScore: 70,
          estimatedLatencyMs: 200,
        }
      ]
    });
    this.client.router.registerProvider(stubProvider);
  }

  /** Request an approval gate for a consequential action. Returns the gate ID. */
  async requestApproval(opts: {
    subject: string;
    description?: string;
    requestedBy: string;
    correlationId?: string;
    metadata?: Record<string, unknown>;
    ttlMs?: number;
  }) {
    const gate = await this.client.approvals.requestApproval({
      subject: opts.subject,
      description: opts.description,
      requestedBy: opts.requestedBy,
      correlationId: opts.correlationId,
      metadata: opts.metadata,
      ttlMs: opts.ttlMs ?? 24 * 60 * 60 * 1000, // 24h default
    });
    this.logger.log(`Approval gate created: ${gate.id} [${gate.subject}]`);
    return gate;
  }

  /** Invoke a capability via OmniRoute — the ONLY way Argyros calls AI. */
  async invokeCapability<TInput, TOutput>(opts: {
    capability: string;
    input: TInput;
    correlationId?: string;
  }) {
    return this.client.capabilities.invoke<TInput, TOutput>({
      capability: opts.capability as never,
      input: opts.input,
      correlationId: opts.correlationId,
    });
  }
}

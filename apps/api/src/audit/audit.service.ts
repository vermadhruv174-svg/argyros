import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../database/prisma.service';

type SafeAuditValue =
  | string
  | number
  | boolean
  | null
  | SafeAuditValue[]
  | { [key: string]: SafeAuditValue };

export interface AuditRecord {
  actor: string;
  action: string;
  resource: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
  requestId?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditListQuery {
  page?: number;
  limit?: number;
  actor?: string;
  action?: string;
  resource?: string;
  from?: string;
  to?: string;
}

export interface AuditRequestMetadata {
  method?: string;
  ip?: string;
  header(name: string): string | undefined;
}

const SENSITIVE_KEY = /password|passwd|secret|token|authorization|cookie|api[-_]?key|credential|otp|mfa|private[-_]?key/i;
const SENSITIVE_VALUE = /\b(?:bearer|basic)\s+[a-z0-9._~+/=-]+/gi;
const SENSITIVE_ASSIGNMENT = /\b(?:password|passwd|secret|token|authorization|cookie|api[-_]?key|credential|otp|mfa|private[-_]?key)\s*[:=]\s*[^\s,;]+/gi;
const MAX_STRING_LENGTH = 2000;
const MAX_REASON_LENGTH = 500;
const MAX_PAGE_SIZE = 100;

function sanitizeString(value: string, maxLength = MAX_STRING_LENGTH): string {
  return value
    .replace(SENSITIVE_VALUE, '[REDACTED]')
    .replace(SENSITIVE_ASSIGNMENT, '[REDACTED]')
    .slice(0, maxLength);
}

function sanitizeAuditValue(value: unknown, depth = 0): SafeAuditValue {
  if (depth > 5) return '[TRUNCATED]';
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') return sanitizeString(value);
  if (Array.isArray(value)) return value.slice(0, 100).map((item) => sanitizeAuditValue(item, depth + 1));
  if (typeof value === 'object') {
    const result: { [key: string]: SafeAuditValue } = {};
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>).slice(0, 100)) {
      result[key] = SENSITIVE_KEY.test(key) ? '[REDACTED]' : sanitizeAuditValue(nestedValue, depth + 1);
    }
    return result;
  }
  return String(value);
}

function optionalFilter(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 200) : undefined;
}

function parseDate(value: string | undefined, label: string): Date | undefined {
  if (!value?.trim()) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestException(`${label} must be a valid ISO date`);
  }
  return parsed;
}

/**
 * Writes append-only audit events. Callers pass identifiers and bounded,
 * non-sensitive metadata; the service redacts secret-shaped keys and values
 * before they reach the database or the Owner Space read endpoint.
 */
@Injectable()
export class AuditService {
  constructor(private readonly db: PrismaService) {}

  record(input: AuditRecord) {
    const data: Prisma.AuditEventCreateInput = {
      actor: sanitizeString(input.actor, 200),
      action: sanitizeString(input.action, 200),
      resource: sanitizeString(input.resource, 300),
      requestId: input.requestId?.trim().slice(0, 200) || randomUUID(),
      metadata: sanitizeAuditValue(input.metadata ?? {}) as Prisma.InputJsonValue,
    };

    if (input.before !== undefined && input.before !== null) {
      data.before = sanitizeAuditValue(input.before) as Prisma.InputJsonValue;
    }
    if (input.after !== undefined && input.after !== null) {
      data.after = sanitizeAuditValue(input.after) as Prisma.InputJsonValue;
    }
    if (input.reason?.trim()) {
      data.reason = sanitizeString(input.reason.trim(), MAX_REASON_LENGTH);
    }

    return this.db.auditEvent.create({ data });
  }

  async list(query: AuditListQuery = {}) {
    const page = Math.max(1, Math.floor(query.page || 1));
    const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(query.limit || 20)));
    const from = parseDate(query.from, 'from');
    const to = parseDate(query.to, 'to');
    const createdAt = from || to ? {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    } : undefined;
    const where: Prisma.AuditEventWhereInput = {
      actor: optionalFilter(query.actor),
      action: optionalFilter(query.action),
      resource: optionalFilter(query.resource),
      ...(createdAt ? { createdAt } : {}),
    };

    const [data, total] = await Promise.all([
      this.db.auditEvent.findMany({
        where,
        select: {
          id: true,
          actor: true,
          action: true,
          resource: true,
          before: true,
          after: true,
          reason: true,
          requestId: true,
          metadata: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.auditEvent.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      hasNextPage: page * limit < total,
    };
  }
}

export function requestIdFrom(request: { header(name: string): string | undefined }): string {
  const requestId = request.header('x-request-id')?.trim();
  return requestId && requestId.length <= 200 ? requestId : randomUUID();
}

export function requestMetadata(
  request: AuditRequestMetadata,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  const metadata: Record<string, unknown> = { ...extra };
  const method = request.method?.trim();
  const ipAddress = request.ip?.trim();
  const userAgent = request.header('user-agent')?.trim();

  if (method) metadata.httpMethod = method.slice(0, 16);
  if (ipAddress) metadata.ipAddress = ipAddress.slice(0, 64);
  if (userAgent) metadata.userAgent = userAgent.slice(0, 512);

  return metadata;
}

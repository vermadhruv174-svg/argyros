-- Keep the audit event contract explicit for before/after state and operator reason.
ALTER TABLE "AuditEvent"
  ADD COLUMN "before" JSONB,
  ADD COLUMN "after" JSONB,
  ADD COLUMN "reason" TEXT;

-- Audit events are append-only. The application has no update/delete endpoint,
-- and this trigger also protects the table from accidental mutation through a
-- normal Prisma client or an Owner Space code path.
CREATE OR REPLACE FUNCTION prevent_audit_event_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'AuditEvent rows are append-only';
END;
$$;

CREATE TRIGGER audit_event_append_only
BEFORE UPDATE OR DELETE ON "AuditEvent"
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_event_mutation();

CREATE INDEX "AuditEvent_createdAt_id_idx" ON "AuditEvent"("createdAt", "id");

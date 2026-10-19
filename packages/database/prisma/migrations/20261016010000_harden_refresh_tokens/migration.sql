-- Refresh credentials are bearer secrets. Keep only a SHA-256 digest in the database.
-- pgcrypto is used only during this one-time data migration; the application hashes
-- newly issued tokens with Node's built-in crypto module.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "RefreshToken"
  ADD COLUMN "tokenHash" TEXT,
  ADD COLUMN "sessionId" TEXT,
  ADD COLUMN "reauthenticatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "userAgent" VARCHAR(512),
  ADD COLUMN "ipAddress" VARCHAR(64);

UPDATE "RefreshToken"
SET
  "tokenHash" = encode(digest("token", 'sha256'), 'hex'),
  "sessionId" = "id",
  -- Existing bearer sessions have no trustworthy recent-auth timestamp.
  "reauthenticatedAt" = TIMESTAMP '1970-01-01 00:00:00'
WHERE "tokenHash" IS NULL OR "sessionId" IS NULL;

ALTER TABLE "RefreshToken"
  ALTER COLUMN "tokenHash" SET NOT NULL,
  ALTER COLUMN "sessionId" SET NOT NULL;

DROP INDEX "RefreshToken_token_key";
DROP INDEX "RefreshToken_token_idx";
ALTER TABLE "RefreshToken" DROP COLUMN "token";

CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");
CREATE INDEX "RefreshToken_userId_sessionId_revokedAt_idx"
  ON "RefreshToken"("userId", "sessionId", "revokedAt");
CREATE INDEX "RefreshToken_sessionId_idx" ON "RefreshToken"("sessionId");

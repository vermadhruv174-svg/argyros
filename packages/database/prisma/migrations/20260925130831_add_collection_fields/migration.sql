-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('SEASONAL', 'EVERGREEN', 'CURATED');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "CollectionType" NOT NULL DEFAULT 'EVERGREEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "firstName" DROP DEFAULT,
ALTER COLUMN "lastName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "lineTotalCents" DROP DEFAULT;

-- CreateTable
CREATE TABLE "CollectionView" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollectionView_collectionId_idx" ON "CollectionView"("collectionId");

-- CreateIndex
CREATE INDEX "CollectionView_viewedAt_idx" ON "CollectionView"("viewedAt");

-- AddForeignKey
ALTER TABLE "CollectionView" ADD CONSTRAINT "CollectionView_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

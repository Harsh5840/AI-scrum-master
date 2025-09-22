-- CreateTable
CREATE TABLE "public"."Blocker" (
    "id" SERIAL NOT NULL,
    "standupId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Blocker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Blocker" ADD CONSTRAINT "Blocker_standupId_fkey" FOREIGN KEY ("standupId") REFERENCES "public"."Standup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "public"."Blocker" DROP CONSTRAINT "Blocker_standupId_fkey";

-- AlterTable
ALTER TABLE "public"."Blocker" ALTER COLUMN "standupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Blocker" ADD CONSTRAINT "Blocker_standupId_fkey" FOREIGN KEY ("standupId") REFERENCES "public"."Standup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

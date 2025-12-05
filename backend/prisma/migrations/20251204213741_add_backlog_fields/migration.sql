/*
  Warnings:

  - Added the required column `updatedAt` to the `BacklogItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."BacklogItem" ADD COLUMN     "assignee" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priority" TEXT DEFAULT 'medium',
ADD COLUMN     "status" TEXT DEFAULT 'todo',
ADD COLUMN     "storyPoints" INTEGER DEFAULT 0,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

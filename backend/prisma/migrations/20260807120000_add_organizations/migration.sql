-- CreateTable
CREATE TABLE IF NOT EXISTS "organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "members" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "invites" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "orgId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "invitedBy" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "integrations" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "accessToken" TEXT,
    "config" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "currentOrgId" INTEGER;

-- AlterTable standups / blockers / sprints (table names may vary by prior migrations)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'standups') THEN
    ALTER TABLE "standups" ADD COLUMN IF NOT EXISTS "orgId" INTEGER;
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Standup') THEN
    ALTER TABLE "Standup" ADD COLUMN IF NOT EXISTS "orgId" INTEGER;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blockers') THEN
    ALTER TABLE "blockers" ADD COLUMN IF NOT EXISTS "orgId" INTEGER;
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Blocker') THEN
    ALTER TABLE "Blocker" ADD COLUMN IF NOT EXISTS "orgId" INTEGER;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sprints') THEN
    ALTER TABLE "sprints" ADD COLUMN IF NOT EXISTS "orgId" INTEGER;
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Sprint') THEN
    ALTER TABLE "Sprint" ADD COLUMN IF NOT EXISTS "orgId" INTEGER;
  END IF;
END $$;

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "organizations_slug_key" ON "organizations"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "members_userId_orgId_key" ON "members"("userId", "orgId");
CREATE UNIQUE INDEX IF NOT EXISTS "invites_token_key" ON "invites"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "integrations_orgId_type_key" ON "integrations"("orgId", "type");

-- Foreign keys (ignore if already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'members_userId_fkey') THEN
    ALTER TABLE "members" ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'members_orgId_fkey') THEN
    ALTER TABLE "members" ADD CONSTRAINT "members_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'invites_orgId_fkey') THEN
    ALTER TABLE "invites" ADD CONSTRAINT "invites_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'invites_invitedBy_fkey') THEN
    ALTER TABLE "invites" ADD CONSTRAINT "invites_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'integrations_orgId_fkey') THEN
    ALTER TABLE "integrations" ADD CONSTRAINT "integrations_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

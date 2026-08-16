import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AuthUser = {
  id: number;
  currentOrgId?: number | null;
  email?: string;
};

/**
 * Resolve the active org for a request user.
 * Ensures the user is a member of that org when currentOrgId is set.
 */
export async function resolveOrgId(user?: AuthUser | null): Promise<number | null> {
  if (!user?.id) return null;

  if (user.currentOrgId) {
    const membership = await prisma.member.findUnique({
      where: {
        userId_orgId: { userId: user.id, orgId: user.currentOrgId },
      },
    });
    if (membership) return user.currentOrgId;
  }

  const firstMembership = await prisma.member.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });

  if (firstMembership) {
    if (user.currentOrgId !== firstMembership.orgId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { currentOrgId: firstMembership.orgId },
      });
    }
    return firstMembership.orgId;
  }

  return null;
}

export async function assertOrgMembership(userId: number, orgId: number): Promise<boolean> {
  const membership = await prisma.member.findUnique({
    where: { userId_orgId: { userId, orgId } },
  });
  return Boolean(membership);
}

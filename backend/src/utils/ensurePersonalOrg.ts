import type { PrismaClient, User } from '@prisma/client'

export async function ensurePersonalOrg(prisma: PrismaClient, user: User): Promise<User> {
  if (user.currentOrgId) {
    const membership = await prisma.member.findUnique({
      where: { userId_orgId: { userId: user.id, orgId: user.currentOrgId } },
    })
    if (membership) return user
  }

  const existing = await prisma.member.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  })
  if (existing) {
    return prisma.user.update({
      where: { id: user.id },
      data: { currentOrgId: existing.orgId },
    })
  }

  const slugBase =
    user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'team'
  const org = await prisma.organization.create({
    data: {
      name: `${user.name}'s Team`,
      slug: `${slugBase}-${user.id}`,
      members: {
        create: { userId: user.id, role: 'owner' },
      },
    },
  })

  return prisma.user.update({
    where: { id: user.id },
    data: { currentOrgId: org.id },
  })
}

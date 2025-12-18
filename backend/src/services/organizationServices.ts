import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateOrgData {
  name: string;
  slug: string;
  ownerId: number;
}

interface InviteData {
  email: string;
  orgId: number;
  role: string;
  invitedBy: number;
}

// Create organization with owner as first member
export const createOrganization = async (data: CreateOrgData) => {
  const org = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      members: {
        create: {
          userId: data.ownerId,
          role: "owner",
        },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });

  // Update user's current org
  await prisma.user.update({
    where: { id: data.ownerId },
    data: { currentOrgId: org.id },
  });

  return org;
};

// Get user's organizations
export const getUserOrganizations = async (userId: number) => {
  return prisma.organization.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
      _count: {
        select: { sprints: true, members: true },
      },
    },
  });
};

// Get organization by slug
export const getOrganizationBySlug = async (slug: string) => {
  return prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
      _count: {
        select: { sprints: true, standups: true, blockers: true },
      },
    },
  });
};

// Get organization by ID
export const getOrganizationById = async (id: number) => {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      },
    },
  });
};

// Update organization
export const updateOrganization = async (
  id: number,
  data: { name?: string; logo?: string }
) => {
  return prisma.organization.update({
    where: { id },
    data,
  });
};

// Check if user is member of org
export const isUserMember = async (userId: number, orgId: number) => {
  const member = await prisma.member.findUnique({
    where: { userId_orgId: { userId, orgId } },
  });
  return !!member;
};

// Get user's role in org
export const getUserRole = async (userId: number, orgId: number) => {
  const member = await prisma.member.findUnique({
    where: { userId_orgId: { userId, orgId } },
  });
  return member?.role || null;
};

// Check if slug is available
export const isSlugAvailable = async (slug: string) => {
  const org = await prisma.organization.findUnique({ where: { slug } });
  return !org;
};

// Create invite
export const createInvite = async (data: InviteData) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  return prisma.invite.create({
    data: {
      email: data.email,
      orgId: data.orgId,
      role: data.role,
      invitedBy: data.invitedBy,
      expiresAt,
    },
    include: {
      org: { select: { name: true, slug: true } },
      inviter: { select: { name: true, email: true } },
    },
  });
};

// Get invite by token
export const getInviteByToken = async (token: string) => {
  return prisma.invite.findUnique({
    where: { token },
    include: {
      org: { select: { id: true, name: true, slug: true } },
      inviter: { select: { name: true, email: true } },
    },
  });
};

// Accept invite
export const acceptInvite = async (token: string, userId: number) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
  });

  if (!invite) throw new Error("Invite not found");
  if (invite.status !== "pending") throw new Error("Invite already used");
  if (new Date() > invite.expiresAt) throw new Error("Invite expired");

  // Create membership and update invite
  await prisma.$transaction([
    prisma.member.create({
      data: {
        userId,
        orgId: invite.orgId,
        role: invite.role,
      },
    }),
    prisma.invite.update({
      where: { token },
      data: { status: "accepted" },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { currentOrgId: invite.orgId },
    }),
  ]);

  return prisma.organization.findUnique({
    where: { id: invite.orgId },
  });
};

// Get org members
export const getOrgMembers = async (orgId: number) => {
  return prisma.member.findMany({
    where: { orgId },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

// Update member role
export const updateMemberRole = async (
  orgId: number,
  userId: number,
  role: string
) => {
  return prisma.member.update({
    where: { userId_orgId: { userId, orgId } },
    data: { role },
  });
};

// Remove member
export const removeMember = async (orgId: number, userId: number) => {
  return prisma.member.delete({
    where: { userId_orgId: { userId, orgId } },
  });
};

// Get pending invites for org
export const getOrgInvites = async (orgId: number) => {
  return prisma.invite.findMany({
    where: { orgId, status: "pending" },
    include: {
      inviter: { select: { name: true, email: true } },
    },
  });
};

// Delete invite
export const deleteInvite = async (id: number) => {
  return prisma.invite.delete({ where: { id } });
};

import { type Request, type Response } from "express";
import * as orgService from "../services/organizationServices.js";

// Generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// POST /api/organizations - Create new organization
export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user?.id;

    if (!name) {
      return res.status(400).json({ error: "Organization name is required" });
    }

    // Generate unique slug
    let slug = generateSlug(name);
    let attempt = 0;
    while (!(await orgService.isSlugAvailable(slug))) {
      attempt++;
      slug = `${generateSlug(name)}-${attempt}`;
    }

    const org = await orgService.createOrganization({
      name,
      slug,
      ownerId: userId,
    });

    res.status(201).json(org);
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ error: "Failed to create organization" });
  }
};

// GET /api/organizations - Get user's organizations
export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const orgs = await orgService.getUserOrganizations(userId);
    res.json(orgs);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
};

// GET /api/organizations/:slug - Get organization by slug
export const getOrganizationBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = (req as any).user?.id;

    const org = await orgService.getOrganizationBySlug(slug);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Check if user is a member
    const isMember = await orgService.isUserMember(userId, org.id);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(org);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
};

// PATCH /api/organizations/:id - Update organization
export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).user?.id;
    const { name, logo } = req.body;

    // Check if user is admin/owner
    const role = await orgService.getUserRole(userId, id);
    if (!role || (role !== "owner" && role !== "admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const org = await orgService.updateOrganization(id, { name, logo });
    res.json(org);
  } catch (error) {
    console.error("Error updating organization:", error);
    res.status(500).json({ error: "Failed to update organization" });
  }
};

// GET /api/organizations/:id/members - Get organization members
export const getMembers = async (req: Request, res: Response) => {
  try {
    const orgId = Number(req.params.id);
    const userId = (req as any).user?.id;

    // Check membership
    const isMember = await orgService.isUserMember(userId, orgId);
    if (!isMember) {
      return res.status(403).json({ error: "Access denied" });
    }

    const members = await orgService.getOrgMembers(orgId);
    res.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
};

// POST /api/organizations/:id/invite - Send invite
export const sendInvite = async (req: Request, res: Response) => {
  try {
    const orgId = Number(req.params.id);
    const userId = (req as any).user?.id;
    const { email, role = "member" } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user is admin/owner
    const userRole = await orgService.getUserRole(userId, orgId);
    if (!userRole || (userRole !== "owner" && userRole !== "admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const invite = await orgService.createInvite({
      email,
      orgId,
      role,
      invitedBy: userId,
    });

    // TODO: Send email with invite link
    // For now, return the token in response (dev only)
    res.status(201).json({
      message: "Invite sent",
      invite,
      // Remove in production:
      inviteLink: `/invite/${invite.token}`,
    });
  } catch (error) {
    console.error("Error sending invite:", error);
    res.status(500).json({ error: "Failed to send invite" });
  }
};

// GET /api/invites/:token - Get invite details
export const getInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const invite = await orgService.getInviteByToken(token);

    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({ error: "Invite already used" });
    }

    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ error: "Invite expired" });
    }

    res.json(invite);
  } catch (error) {
    console.error("Error fetching invite:", error);
    res.status(500).json({ error: "Failed to fetch invite" });
  }
};

// POST /api/invites/:token/accept - Accept invite
export const acceptInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const userId = (req as any).user?.id;

    const org = await orgService.acceptInvite(token, userId);
    res.json({ message: "Invite accepted", organization: org });
  } catch (error: any) {
    console.error("Error accepting invite:", error);
    res.status(400).json({ error: error.message || "Failed to accept invite" });
  }
};

// PATCH /api/organizations/:id/members/:userId - Update member role
export const updateMemberRole = async (req: Request, res: Response) => {
  try {
    const orgId = Number(req.params.id);
    const targetUserId = Number(req.params.userId);
    const requesterId = (req as any).user?.id;
    const { role } = req.body;

    // Check if requester is owner
    const requesterRole = await orgService.getUserRole(requesterId, orgId);
    if (requesterRole !== "owner") {
      return res.status(403).json({ error: "Only owner can change roles" });
    }

    const member = await orgService.updateMemberRole(orgId, targetUserId, role);
    res.json(member);
  } catch (error) {
    console.error("Error updating member role:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

// DELETE /api/organizations/:id/members/:userId - Remove member
export const removeMember = async (req: Request, res: Response) => {
  try {
    const orgId = Number(req.params.id);
    const targetUserId = Number(req.params.userId);
    const requesterId = (req as any).user?.id;

    // Check if requester is admin/owner or removing themselves
    const requesterRole = await orgService.getUserRole(requesterId, orgId);
    const isSelf = requesterId === targetUserId;

    if (!isSelf && requesterRole !== "owner" && requesterRole !== "admin") {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    // Owners cannot be removed
    const targetRole = await orgService.getUserRole(targetUserId, orgId);
    if (targetRole === "owner") {
      return res.status(400).json({ error: "Cannot remove organization owner" });
    }

    await orgService.removeMember(orgId, targetUserId);
    res.status(204).send();
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// GET /api/organizations/:id/invites - Get pending invites
export const getInvites = async (req: Request, res: Response) => {
  try {
    const orgId = Number(req.params.id);
    const userId = (req as any).user?.id;

    // Check if user is admin/owner
    const role = await orgService.getUserRole(userId, orgId);
    if (!role || (role !== "owner" && role !== "admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const invites = await orgService.getOrgInvites(orgId);
    res.json(invites);
  } catch (error) {
    console.error("Error fetching invites:", error);
    res.status(500).json({ error: "Failed to fetch invites" });
  }
};

// DELETE /api/organizations/:id/invites/:inviteId - Cancel invite
export const cancelInvite = async (req: Request, res: Response) => {
  try {
    const orgId = Number(req.params.id);
    const inviteId = Number(req.params.inviteId);
    const userId = (req as any).user?.id;

    // Check if user is admin/owner
    const role = await orgService.getUserRole(userId, orgId);
    if (!role || (role !== "owner" && role !== "admin")) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    await orgService.deleteInvite(inviteId);
    res.status(204).send();
  } catch (error) {
    console.error("Error canceling invite:", error);
    res.status(500).json({ error: "Failed to cancel invite" });
  }
};

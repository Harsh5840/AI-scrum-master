import { Router } from "express";
import {
  createOrganization,
  getOrganizations,
  getOrganizationBySlug,
  updateOrganization,
  getMembers,
  sendInvite,
  getInvite,
  acceptInvite,
  updateMemberRole,
  removeMember,
  getInvites,
  cancelInvite,
} from "../controllers/organizationController.js";

const organizationRouter = Router();

// Organization CRUD
organizationRouter.get("/", getOrganizations);
organizationRouter.post("/", createOrganization);
organizationRouter.get("/:slug", getOrganizationBySlug);
organizationRouter.patch("/:id", updateOrganization);

// Members management
organizationRouter.get("/:id/members", getMembers);
organizationRouter.patch("/:id/members/:userId", updateMemberRole);
organizationRouter.delete("/:id/members/:userId", removeMember);

// Invites
organizationRouter.post("/:id/invite", sendInvite);
organizationRouter.get("/:id/invites", getInvites);
organizationRouter.delete("/:id/invites/:inviteId", cancelInvite);

export default organizationRouter;

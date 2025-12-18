import { Router } from "express";
import { getInvite, acceptInvite } from "../controllers/organizationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const inviteRouter = Router();

// Public route - view invite (no auth required to see invite details)
inviteRouter.get("/:token", getInvite);

// Protected route - accept invite (requires authentication)
inviteRouter.post("/:token/accept", authMiddleware, acceptInvite);

export default inviteRouter;

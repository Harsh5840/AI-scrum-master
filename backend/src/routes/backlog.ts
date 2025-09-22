import { Router } from "express";

const backlogRouter = Router();

// Placeholder route for backlog
backlogRouter.get("/", (req, res) => {
  res.json({ message: "Backlog route is working!" });
});

export default backlogRouter;

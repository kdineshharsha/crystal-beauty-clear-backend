// routes/admin.js
import express from "express";
import {
  getAdminSummary,
  //   getAnalytics,
} from "../controllers/adminController.js";
// import { verifyToken } from "../middleware/auth.js";

const adminRouter = express.Router();

// adminRouter.get("/analytics", getAnalytics);
adminRouter.get("/summary", getAdminSummary);

export default adminRouter;

import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import {
  listPendingCourses,
  updateCourseStatus,
  listPendingCreators,
  CreatorApproval,
} from "../controllers/adminController.js";

const router = express.Router();


router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/review/courses", listPendingCourses);

router.patch("/course/:id/publish", updateCourseStatus);

router.get("/review/creators", listPendingCreators);

router.patch("/creator/:userId", CreatorApproval);

export default router;

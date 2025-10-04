import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getCourses,
  getCourseById,
  enrollCourse,
  markLessonComplete,
  getProgress,
} from "../controllers/learnerController.js";

const router = express.Router();
 
router.use(authMiddleware);

router.get("/courses", getCourses);

router.get("/courses/:id", getCourseById);

router.post("/enroll/:courseId", enrollCourse);

router.patch("/course/:courseId/lesson/:lessonId/complete", markLessonComplete);

router.get("/progress", getProgress);

export default router;

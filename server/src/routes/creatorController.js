import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { applyCreator, createCourse, addLesson, getDashboard } from "../controllers/creatorController.js";

const router = express.Router();

router.post("/apply", authMiddleware, roleMiddleware("LEARNER"), applyCreator);

router.post("/course", authMiddleware, roleMiddleware("CREATOR"), createCourse);


router.post("/course/:id/lesson", authMiddleware, roleMiddleware("CREATOR"), addLesson);

router.get("/dashboard", authMiddleware, roleMiddleware("CREATOR"), getDashboard);

export default router;
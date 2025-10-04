// routes/certificateRoutes.js
import express from "express";
import { getCertificate } from "../controllers/certificateController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:courseId", authMiddleware, getCertificate);

export default router;

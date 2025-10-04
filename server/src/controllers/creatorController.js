import prisma from "../prisma/client.js";
import { success, error } from "../utils/responseHandler.js";

// Apply for creator role
export const applyCreator = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return error(res, "User not found", 404);

    if (user.role === "CREATOR") return error(res, "Already a creator", 400);


    await prisma.user.update({
      where: { id: userId },
      data: { role: "CREATOR" }, // Admin will later approv
    });

    success(res, "creator application submitted. Wait for admin approval.");
  } catch (err) {
    console.error(err);
    error(res, "Failed to apply for creator", 500);
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, thumbnail } = req.body;

    if (!title || !description) return error(res, "Title and description required", 400);

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        status: "PENDING",
        creatorId: userId,
      },
    });

    success(res, "Course created successfully", { course });
  } catch (err) {
    console.error(err);
    error(res, "Failed to create course", 500);
  }
};

// Add lesson to course
export const addLesson = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: courseId } = req.params;
    const { title, contentUrl, order, transcript } = req.body;

    if (!title || !contentUrl || !order) return error(res, "Title, contentUrl, and order required", 400);


    const course = await prisma.course.findUnique({ where: { id: parseInt(courseId) } });
    if (!course) return error(res, "Course not found", 404);
    if (course.creatorId !== userId) return error(res, "Not authorized", 403);

    const lesson = await prisma.lesson.create({
      data: {
        title,
        contentUrl,
        order,
        transcript: transcript || "Transcript will be auto generated", 
        courseId: course.id,
      },
    });

    success(res, "Lesson added successfully", { lesson });
  } catch (err) {
    console.error(err);
    error(res, "Failed to add lesson", 500);
  }
};

// Get creator dashboard
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const courses = await prisma.course.findMany({
      where: { creatorId: userId },
      include: { lessons: true },
    });

    success(res, "Dashboard fetched successfully", { courses });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch dashboard", 500);
  }
};

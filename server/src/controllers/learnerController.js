import prisma from "../prisma/client.js";
import { success, error } from "../utils/responseHandler.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { status: "PUBLISHED" },
      include: { creator: true },
    });
    success(res, "Published courses fetched", { courses });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch courses", 500);
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { lessons: { orderBy: { order: "asc" } }, creator: true },
    });
    if (!course) return error(res, "Course not found", 404);
    success(res, "Course fetched", { course });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch course", 500);
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.enrollment.findFirst({
      where: { userId, courseId: parseInt(courseId) },
    });
    if (existing) return error(res, "Already enrolled", 400);

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId: parseInt(courseId) },
    });

    success(res, "Enrolled successfully", { enrollment });
  } catch (err) {
    console.error(err);
    error(res, "Failed to enroll", 500);
  }
};

export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await prisma.lesson.findFirst({
      where: { id: parseInt(lessonId), courseId: parseInt(courseId) },
    });
    if (!lesson) return error(res, "Lesson not found in this course", 404);

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId, courseId: parseInt(courseId) },
      include: { enrollmentLessons: true },
    });
    if (!enrollment) return error(res, "Not enrolled in course", 400);

    await prisma.enrollmentLesson.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      },
      update: { completed: true },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        completed: true,
      },
    });

    const totalLessons = await prisma.lesson.count({
      where: { courseId: parseInt(courseId) },
    });
    const completedLessons = await prisma.enrollmentLesson.count({
      where: { enrollmentId: enrollment.id, completed: true },
    });

    const progress = (completedLessons / totalLessons) * 100;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress, completed: progress === 100 },
    });

    success(res, "Lesson marked complete", { progress });
  } catch (err) {
    console.error(err);
    error(res, "Failed to mark lesson complete", 500);
  }
};

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: { include: { lessons: { orderBy: { order: "asc" } } } },
        enrollmentLessons: true,
      },
    });

    // Map lesson completion for each course
    const coursesProgress = enrollments.map((enroll) => {
      const lessons = enroll.course.lessons.map((lesson) => {
        const completedLesson = enroll.enrollmentLessons.find(
          (el) => el.lessonId === lesson.id
        );
        return {
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          completed: completedLesson ? completedLesson.completed : false,
        };
      });

      return {
        courseId: enroll.courseId,
        courseTitle: enroll.course.title,
        progress: enroll.progress,
        completed: enroll.completed,
        lessons,
      };
    });

    success(res, "Progress fetched", { courses: coursesProgress });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch progress", 500);
  }
};

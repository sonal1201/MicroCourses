import prisma from "../prisma/client.js";
import { success, error } from "../utils/responseHandler.js";


 // list all pending courses

export const listPendingCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { status: "PENDING" },
      include: { creator: true, lessons: true },
    });
    success(res, "Pending courses fetched successfully", { courses });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch courses", 500);
  }
};

//publish course
export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { status: "PUBLISHED" },
    });

    success(res, "Course published successfully", { course });
  } catch (err) {
    console.error(err);
    error(res, "Failed to publish course", 500);
  }
};


 // list pending creator

export const listPendingCreators = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { creatorApprovalStatus: "PENDING" },
      select: { id: true, name: true, email: true, role: true, creatorApprovalStatus: true },
    });
    success(res, "Pending creator applications fetched successfully", { users });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch creator applications", 500);
  }
};


 // Approve a creator application

export const CreatorApproval = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; //"approved" or "rejectes" 

    if (!["APPROVE", "REJECT"].includes(action)) {
      return error(res, "Invalid action", 400);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        creatorApprovalStatus: action === "APPROVE" ? "APPROVED" : "REJECTED",
        role: action === "APPROVE" ? "CREATOR" : undefined,
      },
    });

    success(res, `Creator ${action.toLowerCase()}d successfully`, { user });
  } catch (err) {
    console.error(err);
    error(res, "Failed to update creator approval", 500);
  }
};


import prisma from "../prisma/client.js";
import crypto from "crypto";
import { success, error } from "../utils/responseHandler.js";

export const getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId: parseInt(courseId), userId },
      include: { certificate: true, course: true, user: true },
    });

    if (!enrollment)
      return error(res, "Enrollment not found", 404);
    if (enrollment.progress < 100)
      return error(res, "Course not completed yet", 400);

    // certificate generation
    if (!enrollment.certificate) {
      const serialHash = crypto.randomBytes(16).toString("hex");
      const certificate = await prisma.certificate.create({
        data: { enrollmentId: enrollment.id, serialHash },
      });
      enrollment.certificate = certificate;
    }

    success(res, "Certificate fetched successfully", {
      certificate: {
        courseTitle: enrollment.course.title,
        learnerName: enrollment.user.name,
        serialHash: enrollment.certificate.serialHash,
        issuedAt: enrollment.certificate.issuedAt,
      },
    });
  } catch (err) {
    console.error(err);
    error(res, "Failed to fetch certificate", 500);
  }
};

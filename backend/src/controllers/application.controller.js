
const prisma = require("../prisma/client");
const {
  createApplicationSchema,
  updateApplicationSchema,
} = require("../validators/application.validator");

// Generate a unique application number
const generateApplicationNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `ADM-${year}-${random}`;
};

// CREATE APPLICATION
const createApplication = async (req, res) => {
  try {
    const validation = createApplicationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
    }

    const { courseId, academicYear, entranceExam, entranceRank, entranceScore } =
      validation.data;

    const userId = req.user.userId;

    // Verify course exists and is active
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isActive: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or inactive",
      });
    }

    // Prevent duplicate applications for the same course and academic year
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId,
        courseId,
        academicYear,
        status: {
          notIn: ["REJECTED"],
        },
      },
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an application for this course and academic year",
        applicationNumber: existingApplication.applicationNumber,
      });
    }

    // Create application and status history together
    const application = await prisma.$transaction(async (tx) => {
      const newApplication = await tx.application.create({
        data: {
          applicationNumber: generateApplicationNumber(),
          userId,
          courseId,
          academicYear,
          entranceExam: entranceExam || null,
          entranceRank: entranceRank ?? null,
          entranceScore: entranceScore ?? null,
          status: "DRAFT",
        },
        include: {
          course: true,
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: newApplication.id,
          previousStatus: null,
          newStatus: "DRAFT",
          changedBy: userId,
          remarks: "Application created",
        },
      });

      return newApplication;
    });

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create application",
    });
  }
};

// GET ALL APPLICATIONS FOR LOGGED-IN STUDENT
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        course: true,
        documents: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// GET SINGLE APPLICATION
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        course: true,
        documents: true,
        statusHistory: {
          orderBy: {
            changedAt: "asc",
          },
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get application details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch application details",
    });
  }
};

// UPDATE DRAFT APPLICATION
const updateApplication = async (req, res) => {
  try {
    const validation = updateApplicationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => issue.message),
      });
    }

    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = validation.data;

    const existingApplication = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (existingApplication.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft applications can be updated",
      });
    }

    // If the course is being changed, verify it
    if (updateData.courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: updateData.courseId,
          isActive: true,
        },
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Selected course not found or inactive",
        });
      }
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        course: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update application",
    });
  }
};

// DELETE DRAFT APPLICATION
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft applications can be deleted",
      });
    }

    await prisma.application.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Draft application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
    });
  }
};

// SUBMIT APPLICATION
const submitApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find application owned by the logged-in student
    const application = await prisma.application.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Only DRAFT applications can be submitted
    if (application.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft applications can be submitted",
      });
    }

    // ==========================================
    // REQUIRED DOCUMENT VALIDATION
    // ==========================================

    const requiredDocuments = [
      "PHOTO",
      "SIGNATURE",
      "CLASS_10_MARKSHEET",
      "CLASS_12_MARKSHEET",
      "ID_PROOF",
    ];

    // Fetch uploaded documents for this application
    const uploadedDocuments = await prisma.document.findMany({
      where: {
        applicationId: id,
      },
      select: {
        type: true,
      },
    });

    // Extract uploaded document types
    const uploadedTypes = uploadedDocuments.map((doc) => doc.type);

    // Find missing required documents
    const missingDocuments = requiredDocuments.filter(
      (requiredType) => !uploadedTypes.includes(requiredType)
    );

    // Block submission if required documents are missing
    if (missingDocuments.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload all required documents before submitting",
        missingDocuments,
      });
    }

    // Validate entrance scorecard if entrance exam details are provided
    if (
      application.entranceExam ||
      application.entranceRank ||
      application.entranceScore
    ) {
      if (!uploadedTypes.includes("ENTRANCE_SCORECARD")) {
        return res.status(400).json({
          success: false,
          message:
            "Entrance scorecard is required when entrance exam details are provided",
          missingDocuments: ["ENTRANCE_SCORECARD"],
        });
      }
    }

    // ==========================================
    // SUBMIT APPLICATION TRANSACTION
    // ==========================================

    // Update status, create history, and notification in one transaction
    const submittedApplication = await prisma.$transaction(async (tx) => {
      // Update application status
      const updatedApplication = await tx.application.update({
        where: { id },
        data: {
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
        include: {
          course: true,
          documents: true,
        },
      });

      // Create status history
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id,
          previousStatus: "DRAFT",
          newStatus: "SUBMITTED",
          changedBy: userId,
          remarks: "Application submitted by student",
        },
      });

      // Create submission notification
      await tx.notification.create({
        data: {
          userId,
          title: "Application Submitted Successfully",
          message: `Your application ${application.applicationNumber} has been submitted successfully. We will notify you when its status changes.`,
        },
      });

      return updatedApplication;
    });

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      application: submittedApplication,
    });
  } catch (error) {
    console.error("Submit application error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  submitApplication,
};

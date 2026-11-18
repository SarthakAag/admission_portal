const prisma = require("../prisma/client");

// Get all active courses with optional search and filters
const getAllCourses = async (req, res) => {
  try {
    const { search, degree, department } = req.query;

    const where = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          courseCode: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          department: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (degree) {
      where.degree = {
        contains: degree,
        mode: "insensitive",
      };
    }

    if (department) {
      where.department = {
        contains: department,
        mode: "insensitive",
      };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    });

    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
};
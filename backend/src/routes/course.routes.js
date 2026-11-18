const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getCourseById,
} = require("../controllers/course.controller");

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/:id
router.get("/:id", getCourseById);

module.exports = router;
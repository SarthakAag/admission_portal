
const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/application.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Protect all application routes
router.use(authenticateToken);

// Create application
router.post("/", applicationController.createApplication);

// Get all applications for logged-in student
router.get("/", applicationController.getMyApplications);

// Submit application
router.post("/:id/submit", applicationController.submitApplication);

// Get application by ID
router.get("/:id", applicationController.getApplicationById);

// Update draft application
router.put("/:id", applicationController.updateApplication);

// Delete draft application
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;

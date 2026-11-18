
const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");
const upload = require("../middleware/upload.middleware");
const { authenticateToken } = require("../middleware/auth.middleware");

// Protect all document routes
router.use(authenticateToken);

// Upload document for an application
router.post(
  "/:applicationId/upload",
  upload.single("file"),
  documentController.uploadDocument
);

// Get documents belonging to an application
router.get(
  "/:applicationId",
  documentController.getApplicationDocuments
);

// View a specific document
router.get(
  "/:applicationId/:documentId/view",
  documentController.viewDocument
);

// Download a specific document
router.get(
  "/:applicationId/:documentId/download",
  documentController.downloadDocument
);

// Delete a document from a draft application
router.delete(
  "/:applicationId/:documentId",
  documentController.deleteDocument
);

module.exports = router;

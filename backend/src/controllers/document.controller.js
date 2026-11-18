const prisma = require("../prisma/client");
const fs = require("fs");
const path = require("path");

const allowedDocumentTypes = [
  "PHOTO",
  "SIGNATURE",
  "CLASS_10_MARKSHEET",
  "CLASS_12_MARKSHEET",
  "TRANSFER_CERTIFICATE",
  "ENTRANCE_SCORECARD",
  "ID_PROOF",
  "OTHER",
];

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "documents"
);

// Upload document
const uploadDocument = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload.",
      });
    }

    if (!allowedDocumentTypes.includes(type)) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        message: "Invalid document type.",
      });
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: req.user.id,
      },
    });

    if (!application) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.status !== "DRAFT") {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        message: "Documents can only be uploaded while the application is a draft.",
      });
    }

    const document = await prisma.document.create({
      data: {
        applicationId,
        type,
        fileName: req.file.originalname,
        fileUrl: `/uploads/documents/${req.file.filename}`,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document,
    });
  } catch (error) {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    console.error("Upload document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload document.",
    });
  }
};

// Get documents for an application
const getApplicationDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const documents = await prisma.document.findMany({
      where: { applicationId },
      orderBy: { uploadedAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("Get application documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve documents.",
    });
  }
};

// Shared function to securely retrieve a document file
const sendDocumentFile = async (req, res, download = false) => {
  try {
    const { applicationId, documentId } = req.params;

    // Verify application ownership
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Verify document belongs to this application
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        applicationId,
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    // Resolve file path safely
    const filename = path.basename(document.fileUrl);
    const filePath = path.resolve(uploadDirectory, filename);

    // Ensure resolved path stays inside upload directory
    if (!filePath.startsWith(uploadDirectory + path.sep)) {
      return res.status(403).json({
        success: false,
        message: "Invalid file path.",
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server.",
      });
    }

    // Prevent browser caching of sensitive documents
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (download) {
      return res.download(filePath, document.fileName);
    }

    // View document in browser
    return res.sendFile(filePath);
  } catch (error) {
    console.error("Get document file error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve document file.",
    });
  }
};

// View document
const viewDocument = async (req, res) => {
  return sendDocumentFile(req, res, false);
};

// Download document
const downloadDocument = async (req, res) => {
  return sendDocumentFile(req, res, true);
};

// Delete document
const deleteDocument = async (req, res) => {
  try {
    const { applicationId, documentId } = req.params;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: req.user.id,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Documents can only be deleted while the application is a draft.",
      });
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        applicationId,
      },
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    // Resolve physical file safely inside the upload directory
    const filename = path.basename(document.fileUrl);
    const filePath = path.join(uploadDirectory, filename);

    if (path.dirname(filePath) === uploadDirectory) {
      fs.unlink(filePath, (fileError) => {
        if (fileError && fileError.code !== "ENOENT") {
          console.error("Physical file deletion failed:", fileError);
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete document.",
    });
  }
};

module.exports = {
  uploadDocument,
  getApplicationDocuments,
  viewDocument,
  downloadDocument,
  deleteDocument,
};
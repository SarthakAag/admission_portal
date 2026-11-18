const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notification.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Protect all notification routes
router.use(authenticateToken);

// Get all notifications
router.get("/", notificationController.getMyNotifications);

// Get unread notification count
router.get("/unread-count", notificationController.getUnreadCount);

// Mark all notifications as read
router.patch("/read-all", notificationController.markAllAsRead);

// Mark a single notification as read
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
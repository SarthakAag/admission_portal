const notificationService = require("../services/notification.service");

// GET ALL NOTIFICATIONS
const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications =
      await notificationService.getUserNotifications(userId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// GET UNREAD COUNT
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count =
      await notificationService.getUnreadNotificationCount(userId);

    return res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notification count",
    });
  }
};

// MARK ONE NOTIFICATION AS READ
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await notificationService.markNotificationAsRead(
      id,
      userId
    );

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result =
      await notificationService.markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
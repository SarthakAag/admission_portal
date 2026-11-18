const prisma = require("../prisma/client");

// Create a notification
const createNotification = async ({ userId, title, message }) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
};

// Get notifications for a user
const getUserNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get unread notification count
const getUnreadNotificationCount = async (userId) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
};

// Mark one notification as read
const markNotificationAsRead = async (notificationId, userId) => {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get("/notifications?limit=30");
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Silent fail — don't disrupt the UI
      console.error("Notification fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Start polling every 30 seconds when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications(); // initial fetch

      pollingRef.current = setInterval(() => {
        fetchNotifications();
      }, 5000); // 5s polling
    } else {
      // Clear notifications on logout
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [user, fetchNotifications]);

  const markAsRead = async (notifId) => {
    try {
      await api.put(`/notifications/${notifId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Mark as read error:", err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err.message);
    }
  };

  const deleteNotification = async (notifId) => {
    try {
      await api.delete(`/notifications/${notifId}`);
      const deleted = notifications.find((n) => n._id === notifId);
      setNotifications((prev) => prev.filter((n) => n._id !== notifId));
      if (deleted && !deleted.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Delete notification error:", err.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

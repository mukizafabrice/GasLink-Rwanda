import React from "react";
import { Bell } from "lucide-react";
import { authService } from "@/services/auth.service";
import type { Notification } from "@/types";

const formatRelativeTime = (value: string) => {
  const createdAt = new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - createdAt) / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const NotificationBell: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    const response = await authService.getNotifications();

    if (response.success && response.data) {
      setNotifications(response.data);
    } else {
      setNotifications([]);
    }

    setLoading(false);
  }, []);

  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      return;
    }

    void loadNotifications();
  }, [loadNotifications]);

  const toggleOpen = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void toggleOpen()}
        className="relative p-2 transition-colors rounded-lg hover:bg-gray-100"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute flex items-center justify-center min-w-5 h-5 px-1 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 w-80 mt-2 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <span className="text-xs text-gray-500">
                {unreadCount} unread
              </span>
            </div>

            <div className="overflow-y-auto max-h-96">
              {loading ? (
                <div className="p-4 text-sm text-gray-500">Loading notifications...</div>
              ) : notifications.length ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 border-b border-gray-100 last:border-0 ${
                      notification.isRead ? "bg-white" : "bg-orange-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2.5 h-2.5 mt-1 bg-orange-500 rounded-full shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-gray-500">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;

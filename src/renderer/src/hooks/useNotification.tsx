import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  FaCheck,
  FaInfo,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

// Define notification types
export type NotificationType = "success" | "info" | "warning" | "error";

// Notification object structure
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
  hide?: boolean;
}

// Context interface
interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    message: string,
    duration?: number,
  ) => void;
  removeNotification: (id: string) => void;
}

// Create the context
const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

// Create the provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a new notification
  const addNotification = useCallback(
    (type: NotificationType, message: string, duration = 3000) => {
      const id = Date.now().toString();

      setNotifications((prev) => [
        ...prev,
        {
          id,
          type,
          message,
          duration,
        },
      ]);

      // Auto-remove notification after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [],
  );

  // Remove a notification by id
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      // Find the notification to add a hide class
      const updatedNotifications = prev.map((notification) =>
        notification.id === id ? { ...notification, hide: true } : notification,
      );

      return updatedNotifications;
    });

    // After animation completes, remove from state
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
    }, 300); // Match animation duration
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification system
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
};

// Notification container component
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // Get icon based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <FaCheck />;
      case "info":
        return <FaInfo />;
      case "warning":
        return <FaExclamationTriangle />;
      case "error":
        return <FaTimes />;
      default:
        return <FaInfo />;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type} ${notification.hide ? "hide" : ""}`}
        >
          <div className="notification-icon">{getIcon(notification.type)}</div>
          <div className="notification-message">{notification.message}</div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

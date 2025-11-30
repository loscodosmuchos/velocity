import { createContext, useContext, useState, ReactNode } from "react";

export interface Alert {
  id: string;
  type: "alert" | "notification";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface AlertContextType {
  alerts: Alert[];
  notifications: Alert[];
  unreadAlertCount: number;
  unreadNotificationCount: number;
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Alert[]>([]);

  const alerts = items.filter((item) => item.type === "alert");
  const notifications = items.filter((item) => item.type === "notification");
  const unreadAlertCount = alerts.filter((a) => !a.read).length;
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const addAlert = (alert: Omit<Alert, "id" | "timestamp" | "read">) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };
    setItems((prev) => [newAlert, ...prev]);
  };

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        notifications,
        unreadAlertCount,
        unreadNotificationCount,
        addAlert,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertProvider");
  }
  return context;
}

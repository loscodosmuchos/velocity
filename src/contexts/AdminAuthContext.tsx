import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminSettings {
  adminPasswordEnabled: boolean;
  adminPassword: string;
  gatewayPasswordEnabled: boolean;
  gatewayPassword: string;
}

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  isGatewayAuthenticated: boolean;
  adminSettings: AdminSettings;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  loginGateway: (password: string) => boolean;
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AdminSettings = {
  adminPasswordEnabled: true,
  adminPassword: '123456',
  gatewayPasswordEnabled: true,
  gatewayPassword: 'innovation2025'
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isGatewayAuthenticated, setIsGatewayAuthenticated] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const storedSettings = localStorage.getItem('velocity_admin_settings');
    if (storedSettings) {
      setAdminSettings(JSON.parse(storedSettings));
    }

    const adminAuth = sessionStorage.getItem('velocity_admin_auth');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }

    const gatewayAuth = sessionStorage.getItem('velocity_gateway_auth');
    if (gatewayAuth === 'true') {
      setIsGatewayAuthenticated(true);
    }
  }, []);

  const loginAdmin = (password: string): boolean => {
    if (!adminSettings.adminPasswordEnabled) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('velocity_admin_auth', 'true');
      return true;
    }

    if (password === adminSettings.adminPassword) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('velocity_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('velocity_admin_auth');
  };

  const loginGateway = (password: string): boolean => {
    if (!adminSettings.gatewayPasswordEnabled) {
      setIsGatewayAuthenticated(true);
      sessionStorage.setItem('velocity_gateway_auth', 'true');
      return true;
    }

    if (password === adminSettings.gatewayPassword) {
      setIsGatewayAuthenticated(true);
      sessionStorage.setItem('velocity_gateway_auth', 'true');
      return true;
    }
    return false;
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => {
    const newSettings = { ...adminSettings, ...settings };
    setAdminSettings(newSettings);
    localStorage.setItem('velocity_admin_settings', JSON.stringify(newSettings));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        isGatewayAuthenticated,
        adminSettings,
        loginAdmin,
        logoutAdmin,
        loginGateway,
        updateAdminSettings
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

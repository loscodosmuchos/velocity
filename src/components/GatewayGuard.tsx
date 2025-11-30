import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { GatewayPasswordDialog } from './GatewayPasswordDialog';

interface GatewayGuardProps {
  children: React.ReactNode;
}

export function GatewayGuard({ children }: GatewayGuardProps) {
  const { isGatewayAuthenticated, adminSettings, loginGateway } = useAdminAuth();

  if (!adminSettings.gatewayPasswordEnabled || isGatewayAuthenticated) {
    return <>{children}</>;
  }

  return <GatewayPasswordDialog onAuthenticate={loginGateway} />;
}

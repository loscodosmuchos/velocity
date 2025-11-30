import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock } from 'lucide-react';

interface AdminPasswordGateProps {
  children: React.ReactNode;
}

export function AdminPasswordGate({ children }: AdminPasswordGateProps) {
  const { isAdminAuthenticated, loginAdmin, adminSettings } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!adminSettings.adminPasswordEnabled || isAdminAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password);
    if (!success) {
      setError('Incorrect admin password');
      setPassword('');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-md bg-slate-900 border-slate-700" 
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-white">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            Admin Access Required
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            This area contains system administration tools. Enter your admin password to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {error}
            </p>
          )}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Authenticate
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Zap, ArrowRight } from 'lucide-react';

interface GatewayPasswordDialogProps {
  onAuthenticate: (password: string) => boolean;
}

export function GatewayPasswordDialog({ onAuthenticate }: GatewayPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 400));

    const success = onAuthenticate(password);
    if (success) {
      setPassword('');
      setError('');
    } else {
      setError('Invalid access code');
      setPassword('');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-purple-500/20" 
        showCloseButton={false}
      >
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent">
            Velocity Network
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter your access code to continue to the platform
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input
              type="password"
              placeholder="Enter access code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 h-14 bg-slate-800/80 border-slate-700 text-white text-lg rounded-xl placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
              autoFocus
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            disabled={isLoading || !password}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg shadow-purple-500/25 transition-all duration-300"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Enter Platform
                <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <Shield className="h-3 w-3" />
          <span>Protected by enterprise-grade security</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

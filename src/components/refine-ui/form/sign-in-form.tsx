"use client";

import { useState, useEffect } from "react";
import { CircleHelp, Shield, Users, Eye, Zap } from "lucide-react";
import { useLogin, useLink } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const demoAccounts = [
  { email: "manager@velocity.io", password: "velocity2025!", role: "Manager", icon: Users, description: "Team management" },
  { email: "viewer@velocity.io", password: "velocity2025!", role: "Viewer", icon: Eye, description: "Read-only access" },
];

const GlowingParticle = ({ delay, duration, size, left, top }: { delay: number; duration: number; size: number; left: string; top: string }) => (
  <div
    className="absolute rounded-full animate-pulse"
    style={{
      width: size,
      height: size,
      left,
      top,
      background: `radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 70%)`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      filter: 'blur(1px)',
    }}
  />
);

const FloatingOrb = ({ className, delay }: { className: string; delay: number }) => (
  <div
    className={cn("absolute rounded-full opacity-20 animate-float", className)}
    style={{
      animationDelay: `${delay}s`,
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 100%)',
      filter: 'blur(40px)',
    }}
  />
);

export const SignInForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);

  const Link = useLink();
  const { mutate: login } = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    login({
      email,
      password,
    }, {
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });
  };

  const selectDemoAccount = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowDemoHint(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(59, 130, 246, 0.3); box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { border-color: rgba(59, 130, 246, 0.6); box-shadow: 0 0 40px rgba(59, 130, 246, 0.2); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-gradient-shift { 
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite; 
        }
        .animate-border-glow { animation: border-glow 4s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .glass-panel {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .input-luxury {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          transition: all 0.3s ease;
        }
        .input-luxury:focus {
          border-color: rgba(59, 130, 246, 0.8);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15);
        }
        .btn-velocity {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%);
          position: relative;
          overflow: hidden;
        }
        .btn-velocity::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .btn-velocity:hover::before {
          left: 100%;
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 animate-gradient-shift" style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Floating Orbs */}
        <FloatingOrb className="w-96 h-96 -top-48 -left-48" delay={0} />
        <FloatingOrb className="w-64 h-64 top-1/4 right-10" delay={2} />
        <FloatingOrb className="w-80 h-80 bottom-20 left-1/4" delay={4} />
        
        {/* Glowing Particles */}
        {mounted && (
          <>
            <GlowingParticle delay={0} duration={4} size={6} left="10%" top="20%" />
            <GlowingParticle delay={1} duration={5} size={4} left="85%" top="15%" />
            <GlowingParticle delay={2} duration={4} size={8} left="70%" top="60%" />
            <GlowingParticle delay={0.5} duration={6} size={5} left="20%" top="70%" />
            <GlowingParticle delay={1.5} duration={4} size={6} left="90%" top="80%" />
            <GlowingParticle delay={3} duration={5} size={4} left="5%" top="50%" />
            <GlowingParticle delay={2.5} duration={4} size={7} left="50%" top="10%" />
            <GlowingParticle delay={1} duration={6} size={5} left="30%" top="85%" />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* Logo & Branding */}
        <div className={cn(
          "flex flex-col items-center mb-8",
          mounted && "animate-slide-up"
        )} style={{ animationDelay: '0.1s', opacity: mounted ? 1 : 0 }}>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-glow-pulse" />
            <img 
              src="/branding/velocity-badge.png" 
              alt="Velocity" 
              className="relative h-20 w-20 rounded-full object-cover shadow-2xl shadow-blue-500/30 ring-2 ring-blue-500/30" 
            />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Velocity Intelligence Network
          </h1>
          <p className="text-slate-400 text-sm mt-1 tracking-wide">Enterprise Workforce Management</p>
        </div>

        {/* Login Card */}
        <div 
          className={cn(
            "glass-panel rounded-2xl p-8 w-full max-w-md animate-border-glow",
            mounted && "animate-slide-up"
          )}
          style={{ animationDelay: '0.2s', opacity: mounted ? 1 : 0 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Demo Account Selector */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">Quick Access (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => selectDemoAccount(account)}
                  className={cn(
                    "group flex flex-col items-center p-3 rounded-xl border transition-all duration-300",
                    email === account.email 
                      ? "border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/10" 
                      : "border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50"
                  )}
                >
                  <account.icon className={cn(
                    "h-5 w-5 mb-1.5 transition-colors",
                    email === account.email ? "text-blue-400" : "text-slate-500 group-hover:text-slate-400"
                  )} />
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    email === account.email ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                  )}>{account.role}</span>
                </button>
              ))}
            </div>
            {showDemoHint && (
              <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Demo credentials loaded - click Sign In
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <span className="text-xs text-slate-500 uppercase tracking-wider">or enter credentials</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-luxury h-12 rounded-xl text-white placeholder:text-slate-500 border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-luxury h-12 rounded-xl text-white placeholder:text-slate-500 border-slate-700"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === "indeterminate" ? false : checked)}
                  className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="remember" className="text-slate-400 text-sm cursor-pointer">Remember me</Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <span>Forgot password?</span>
              </Link>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isLoading}
              className="btn-velocity w-full h-12 rounded-xl text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-center text-sm text-slate-500">
              Need access?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Request an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className={cn(
          "mt-6 flex items-center gap-2 text-slate-500",
          mounted && "animate-slide-up"
        )} style={{ animationDelay: '0.3s', opacity: mounted ? 1 : 0 }}>
          <Shield className="h-4 w-4" />
          <span className="text-xs">Enterprise-grade security with JWT authentication</span>
        </div>

        {/* Version */}
        <p className="mt-4 text-xs text-slate-600">
          Velocity v2.0 · Built with precision
        </p>
      </div>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

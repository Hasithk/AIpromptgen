'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/credit-display';
import { LogOut, User } from 'lucide-react';

export function SessionWrapper() {
  const { data: session, status } = useSession();
  
  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };
  
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <CreditDisplay />
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{session.user.name || session.user.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={handleSignIn}>
        Sign In
      </Button>
      <Button onClick={handleSignIn}>
        Get Started
      </Button>
    </div>
  );
}
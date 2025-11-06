'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreditDisplay } from '@/components/credit-display';
import { LogOut, User } from 'lucide-react';

export function SessionWrapper() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === 'loading';
  
  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  // Authenticated state
  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <CreditDisplay />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            {session.user.name || session.user.email}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Unauthenticated state
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={handleSignIn}>
        Sign In
      </Button>
      <Button onClick={handleSignUp}>
        Get Started
      </Button>
    </div>
  );
}
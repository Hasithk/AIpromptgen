'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientWrapper({ children, fallback }: ClientWrapperProps) {
  const { status } = useSession();

  // Show fallback during loading to prevent hydration issues
  if (status === 'loading' && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Higher-order component to wrap pages that use authentication
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => {
    return (
      <ClientWrapper fallback={fallback}>
        <Component {...props} />
      </ClientWrapper>
    );
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
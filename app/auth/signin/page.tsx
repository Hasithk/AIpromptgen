'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Chrome, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('SignInPage rendered, isLoading:', isLoading);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('Google sign-in initiated');
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: true,
      });
      console.log('Google sign-in result:', result);
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Email sign-in attempt:', { email, password: '***' });
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Calling signIn with credentials...');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('Sign-in result:', result);

      if (result?.error) {
        // Show specific error messages
        if (result.error.includes('No account found') || result.error.includes('sign up')) {
          toast({
            title: 'Account Not Found',
            description: 'No account found with this email. Please sign up first.',
            variant: 'destructive',
          });
          // Optionally redirect to signup after 2 seconds
          setTimeout(() => {
            router.push('/auth/signup');
          }, 2000);
        } else if (result.error.includes('Google sign-in')) {
          toast({
            title: 'Use Google Sign-In',
            description: 'This account was created with Google. Please use Google sign-in.',
            variant: 'destructive',
          });
        } else if (result.error.includes('Incorrect password')) {
          toast({
            title: 'Incorrect Password',
            description: 'The password you entered is incorrect.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to sign in',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Success',
          description: 'Signed in successfully!',
        });
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during sign in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold gradient-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full py-6 text-base"
              onClick={() => {
                console.log('Google button clicked!');
                handleGoogleSignIn();
              }}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Sign In */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full btn-primary py-6"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="hover:text-primary underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="hover:text-primary underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

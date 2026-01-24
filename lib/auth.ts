import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

// Validate required environment variables
const requiredEnvVars = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL
};

// Log missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // When user signs in, add their database ID to the token
      if (user) {
        token.id = user.id;
      }
      // If we have an account (new sign-in), fetch user from database
      if (account && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true }
          });
          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && user.email) {
          // Only try to create/update user if database is available
          if (process.env.DATABASE_URL) {
            try {
              // Check if user exists first
              const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
                select: { 
                  id: true, 
                  plan: true, 
                  lastCreditResetDate: true,
                  credits: true 
                }
              });

              if (existingUser) {
                // User exists - check if credits need monthly reset
                const now = new Date();
                const lastReset = existingUser.lastCreditResetDate ? new Date(existingUser.lastCreditResetDate) : null;
                
                // Check if we're in a new month
                const needsReset = !lastReset || 
                  (lastReset.getMonth() !== now.getMonth() || 
                   lastReset.getFullYear() !== now.getFullYear());

                if (needsReset) {
                  // Reset credits based on plan
                  const monthlyCredits: { [key: string]: number } = {
                    free: 50,
                    pro: 500,
                    elite: 9999
                  };
                  
                  const creditsToSet = monthlyCredits[existingUser.plan] || 50;

                  const dbUser = await prisma.user.update({
                    where: { email: user.email },
                    data: {
                      name: user.name || '',
                      credits: creditsToSet,
                      monthlyCreditsUsed: 0,
                      lastCreditResetDate: now
                    }
                  });
                  
                  user.id = dbUser.id;
                  console.log(`✓ Credits reset for ${user.email}: ${creditsToSet} credits (${existingUser.plan} plan)`);
                } else {
                  // Just update name
                  const dbUser = await prisma.user.update({
                    where: { email: user.email },
                    data: {
                      name: user.name || ''
                    }
                  });
                  user.id = dbUser.id;
                }
              } else {
                // New user - create with initial credits
                const dbUser = await prisma.user.create({
                  data: {
                    email: user.email,
                    name: user.name || '',
                    credits: 50,
                    monthlyCreditsUsed: 0,
                    lastCreditResetDate: now,
                    plan: 'free'
                  }
                });
                user.id = dbUser.id;
                console.log(`✓ New user created: ${user.email} with 50 credits`);
              }
            } catch (dbError) {
              console.error('Database error during sign in:', dbError);
              // Continue with sign in even if database fails
            }
          }
        }
        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        // Allow sign in to proceed even if there are errors
        return true;
      }
    }
  }
};

import NextAuth, { NextAuthOptions } from 'next-auth';
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

const authOptions: NextAuthOptions = {
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
              const dbUser = await prisma.user.upsert({
                where: { email: user.email },
                create: {
                  email: user.email,
                  name: user.name || '',
                  credits: 70, // Free tier credits
                  plan: 'free'
                },
                update: {
                  name: user.name || ''
                }
              });
              // Set the user ID so it's available in jwt callback
              user.id = dbUser.id;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

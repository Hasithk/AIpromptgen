import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // Check if credits need to be reset (daily reset)
        const now = new Date();
        const lastReset = user.lastCreditReset ? new Date(user.lastCreditReset) : null;
        const shouldReset = !lastReset || 
          now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

        if (shouldReset) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              credits: 70,
              lastCreditReset: now,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user with 70 initial credits
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                credits: 70,
                lastCreditReset: new Date(),
              },
            });
          } else {
            // Check if credits need to be reset
            const now = new Date();
            const lastReset = existingUser.lastCreditReset ? new Date(existingUser.lastCreditReset) : null;
            const shouldReset = !lastReset || 
              now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

            if (shouldReset) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  credits: 70,
                  lastCreditReset: now,
                },
              });
            }
          }
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

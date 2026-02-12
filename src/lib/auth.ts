import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions, User as AuthUser } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        } as AuthUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'google') {
        return true;
      }

      const email = typeof profile?.email === 'string' ? profile.email : undefined;
      if (!email || !account.providerAccountId) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { accounts: true },
      });

      if (!existingUser) {
        return true;
      }

      const linkedGoogleAccount = existingUser.accounts.find(
        (acc) => acc.provider === 'google'
      );

      // Allow first-time Google linking for an existing same-email user.
      if (!linkedGoogleAccount) {
        return true;
      }

      // If already linked, only allow the same Google account id.
      return linkedGoogleAccount.providerAccountId === account.providerAccountId;
    },
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as { id?: string; role?: 'USER' | 'ADMIN' };
        token.id = typedUser.id;
        token.role = typedUser.role || 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'USER';
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

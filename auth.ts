import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { AppRole } from '@/types/next-auth';

// Dummy bcrypt hash untuk mencegah timing attack / email enumeration
const DUMMY_HASH = '$2b$10$e7xY271wK8n0zB4p7A3V6eU5jH6iP0wE2kM3sQ9vT8uR1yZ4xC5mO';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          // Tetap jalankan compare tiruan agar respon waktu konstan (mencegah timing attack)
          await bcrypt.compare(credentials.password as string, DUMMY_HASH);
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) return { id: user.id, email: user.email, name: user.nama, role: user.role };
        
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;
        const email = user.email.trim().toLowerCase();

        try {
          let dbUser = await prisma.user.findUnique({
            where: { email }
          });

          if (!dbUser) {
            // Auto register sebagai role PELAPOR jika akun belum terdaftar
            const randomSeed = typeof crypto !== 'undefined' && crypto.randomUUID 
              ? crypto.randomUUID() 
              : (crypto.randomBytes ? crypto.randomBytes(16).toString('hex') : Math.random().toString(36).substring(2));
            const randomPassword = await bcrypt.hash(randomSeed, 10);
            dbUser = await prisma.user.create({
              data: {
                nama: user.name || 'Pengguna Google',
                email,
                password: randomPassword,
                role: 'PELAPOR'
              }
            });
          }

          user.id = dbUser.id;
          user.role = dbUser.role;
          user.name = dbUser.nama;
          return true;
        } catch (error) {
          console.error('Error during Google signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      // Memastikan role dan ID tersinkron dari database
      if ((!token.role || !token.id) && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: (token.email as string).trim().toLowerCase() }
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user in jwt callback:', error);
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as AppRole;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});

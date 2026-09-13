import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Dummy bcrypt hash untuk mencegah timing attack / email enumeration
const DUMMY_HASH = '$2b$10$e7xY271wK8n0zB4p7A3V6eU5jH6iP0wE2kM3sQ9vT8uR1yZ4xC5mO';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
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
});

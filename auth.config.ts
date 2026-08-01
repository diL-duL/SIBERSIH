import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [], // Add providers in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      if (path === '/') return true; 
      if (path === '/login') {
        if (isLoggedIn) {
           const role = auth.user.role;
           if (role === 'PELAPOR') return Response.redirect(new URL('/reporter', nextUrl));
           if (role === 'PETUGAS') return Response.redirect(new URL('/staff', nextUrl));
           if (role === 'PIMPINAN') return Response.redirect(new URL('/executive', nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && (path.startsWith('/reporter') || path.startsWith('/staff') || path.startsWith('/executive'))) {
        return false;
      }

      if (isLoggedIn) {
        const role = auth.user.role;
        if (path.startsWith('/reporter') && role !== 'PELAPOR') return Response.redirect(new URL('/login', nextUrl));
        if (path.startsWith('/staff') && role !== 'PETUGAS') return Response.redirect(new URL('/login', nextUrl));
        if (path.startsWith('/executive') && role !== 'PIMPINAN') return Response.redirect(new URL('/login', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
} satisfies NextAuthConfig;

import { prisma } from "@/lib/prisma";

/**
 * Mendapatkan ID user database yang valid dari objek session.
 * Jika ID di session tidak ditemukan di DB (misal setelah re-seed database),
 * fungsi ini akan mencocokkan user berdasarkan email yang tersimpan di session token.
 */
export async function getValidUserId(sessionUser?: {
  id?: string;
  email?: string | null;
}): Promise<string | null> {
  if (!sessionUser) return null;

  if (sessionUser.id) {
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true },
    });
    if (user) return user.id;
  }

  if (sessionUser.email) {
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email.trim().toLowerCase() },
      select: { id: true },
    });
    if (user) return user.id;
  }

  return null;
}

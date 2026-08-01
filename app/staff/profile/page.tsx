import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/ProfileClient';

export default async function StaffProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, nama: true, email: true, role: true }
  });

  if (!user) redirect('/login');

  return <ProfileClient user={user} />;
}

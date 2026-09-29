import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getValidUserId } from "@/lib/session-user";
import RequirePhoneNumberModal from "@/components/RequirePhoneNumberModal";

export default async function ReporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let needsPhoneNumber = false;

  if (session?.user) {
    const userId = await getValidUserId(session.user);
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { nomorHp: true },
      });
      needsPhoneNumber = !user?.nomorHp;
    }
  }

  return (
    <>
      <RequirePhoneNumberModal isOpen={needsPhoneNumber} />
      {children}
    </>
  );
}

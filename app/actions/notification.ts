'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function markAsRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    await prisma.notification.update({
      where: { 
        id: notificationId,
        userId: session.user.id
      },
      data: { isRead: true }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to mark as read' };
  }
}

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    await prisma.notification.updateMany({
      where: { 
        userId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to mark all as read' };
  }
}

export async function createNotification(userId: string, title: string, message: string, type: 'info' | 'success' | 'alert' = 'info') {
  try {
    await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type
      }
    });
  } catch (error) {
    console.error("Failed to create notification", error);
  }
}

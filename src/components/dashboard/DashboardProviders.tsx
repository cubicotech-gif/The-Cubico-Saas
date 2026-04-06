'use client';

import { ToastProvider } from '@/components/dashboard/Toast';
import NotificationListener from '@/components/dashboard/NotificationListener';

export default function DashboardProviders({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <NotificationListener userId={userId} />
      {children}
    </ToastProvider>
  );
}

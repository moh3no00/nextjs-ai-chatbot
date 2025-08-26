import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { ChatProvider } from '@/components/chat-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <ChatProvider>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </ChatProvider>
    </div>
  );
}

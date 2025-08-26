import { Metadata } from 'next';
import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { OrderStatusChart } from '@/components/dashboard/order-status-chart';
import { PurchaseTrendChart } from '@/components/dashboard/purchase-trend-chart';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { AlertsAndTasks } from '@/components/dashboard/alerts-and-tasks';

export const metadata: Metadata = {
  title: 'داشبورد - سیستم مدیریت قطعات یدکی نیسان',
  description: 'نمای کلی وضعیت سفارشات، پیش‌فاکتورها و پرداخت‌ها',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          داشبورد مدیریت
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            توزیع وضعیت سفارشات
          </h2>
          <OrderStatusChart />
        </div>

        {/* Purchase Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            روند خریدها
          </h2>
          <PurchaseTrendChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts and Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            هشدارها و وظایف
          </h2>
          <AlertsAndTasks />
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            آخرین فعالیت‌ها
          </h2>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}

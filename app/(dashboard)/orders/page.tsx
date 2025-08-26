import { Metadata } from 'next';
import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { OrdersTable } from '@/components/orders/orders-table';
import { OrderForm } from '@/components/orders/order-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'سفارشات خرید - سیستم مدیریت قطعات یدکی نیسان',
  description: 'ثبت، ویرایش و مدیریت سفارشات خرید',
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            مدیریت سفارشات خرید
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ثبت، ویرایش و مدیریت سفارشات خرید قطعات یدکی
          </p>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">لیست سفارشات</TabsTrigger>
          <TabsTrigger value="add">ثبت سفارش جدید</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <OrdersTable />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ثبت سفارش جدید
            </h2>
            <OrderForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

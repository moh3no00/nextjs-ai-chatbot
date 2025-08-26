import { Metadata } from 'next';
import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import { ProductsTable } from '@/components/products/products-table';
import { ProductForm } from '@/components/products/product-form';
import { ExcelImportExport } from '@/components/products/excel-import-export';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'مدیریت کالا - سیستم مدیریت قطعات یدکی نیسان',
  description: 'ثبت، ویرایش و مدیریت کالاها',
};

export default async function ProductsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            مدیریت کالا
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ثبت، ویرایش و مدیریت کالاها و قطعات یدکی
          </p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <ExcelImportExport />
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">لیست کالاها</TabsTrigger>
          <TabsTrigger value="add">ثبت کالای جدید</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <ProductsTable />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ثبت کالای جدید
            </h2>
            <ProductForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

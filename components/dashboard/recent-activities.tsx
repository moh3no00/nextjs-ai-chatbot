'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ShoppingCart,
  FileText,
  Receipt,
  CheckSquare,
  Phone,
  CreditCard,
  Package,
  Building2
} from 'lucide-react';
import { PersianDate } from '@/lib/utils/persian-date';

const activities = [
  {
    id: 1,
    type: 'order_created',
    title: 'سفارش جدید ثبت شد',
    description: 'سفارش PO-2024-056 برای شرکت پارت‌سازان ثبت شد',
    user: 'علی احمدی',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    icon: ShoppingCart,
    color: 'blue'
  },
  {
    id: 2,
    type: 'proforma_approved',
    title: 'پیش‌فاکتور تایید شد',
    description: 'پیش‌فاکتور PF-2024-089 تایید و ارسال شد',
    user: 'مریم کریمی',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: CheckSquare,
    color: 'green'
  },
  {
    id: 3,
    type: 'follow_up',
    title: 'پیگیری انجام شد',
    description: 'پیگیری سفارش PO-2024-052 از تامین‌کننده آسیا موتور',
    user: 'حسن رضایی',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    icon: Phone,
    color: 'orange'
  },
  {
    id: 4,
    type: 'payment_completed',
    title: 'پرداخت انجام شد',
    description: 'پرداخت فاکتور INV-2024-078 به مبلغ ۸۵ میلیون ریال',
    user: 'فاطمه محمدی',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: CreditCard,
    color: 'purple'
  },
  {
    id: 5,
    type: 'supplier_added',
    title: 'تامین‌کننده جدید',
    description: 'شرکت نوین قطعه به لیست تامین‌کنندگان اضافه شد',
    user: 'محمد موسوی',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: Building2,
    color: 'indigo'
  },
  {
    id: 6,
    type: 'product_added',
    title: 'کالای جدید ثبت شد',
    description: 'لنت ترمز جلو راست کد NS-2024-445 ثبت شد',
    user: 'زهرا صادقی',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: Package,
    color: 'teal'
  }
];

const getIconColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    teal: 'text-teal-600'
  };
  return colors[color] || 'text-gray-600';
};

const getActivityTypeBadge = (type: string) => {
  const types: Record<string, { label: string; variant: any }> = {
    order_created: { label: 'سفارش', variant: 'default' },
    proforma_approved: { label: 'تایید', variant: 'secondary' },
    follow_up: { label: 'پیگیری', variant: 'outline' },
    payment_completed: { label: 'پرداخت', variant: 'default' },
    supplier_added: { label: 'تامین‌کننده', variant: 'secondary' },
    product_added: { label: 'کالا', variant: 'outline' }
  };
  
  return types[type] || { label: 'عمومی', variant: 'outline' };
};

export function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">فعالیت اخیری موجود نیست</p>
        </div>
      ) : (
        activities.map((activity) => {
          const IconComponent = activity.icon;
          const badge = getActivityTypeBadge(activity.type);
          
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700`}>
                <IconComponent className={`h-4 w-4 ${getIconColor(activity.color)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <Badge variant={badge.variant} className="text-xs">
                    {badge.label}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.user}
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {PersianDate.formatRelative(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      
      {activities.length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            نمایش {activities.length} فعالیت اخیر
          </p>
        </div>
      )}
    </div>
  );
}

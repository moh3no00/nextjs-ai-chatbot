'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { PersianDate } from '@/lib/utils/persian-date';
import Link from 'next/link';

const alerts = [
  {
    id: 1,
    type: 'warning' as const,
    title: 'پیش‌فاکتور منقضی',
    description: 'پیش‌فاکتور شماره PF-2024-001 در تاریخ ۱۵ مهر منقضی می‌شود',
    priority: 'high' as const,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    link: '/proforma-invoices/1'
  },
  {
    id: 2,
    type: 'error' as const,
    title: 'پرداخت معوقه',
    description: 'فاکتور شماره INV-2024-045 ۳۰ روز از موعد پرداخت گذشته است',
    priority: 'urgent' as const,
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    link: '/payments/45'
  },
  {
    id: 3,
    type: 'info' as const,
    title: 'پیگیری مورد نیاز',
    description: 'سفارش شماره PO-2024-023 نیاز به پیگیری از تامین‌کننده دارد',
    priority: 'medium' as const,
    dueDate: new Date(),
    link: '/follow-ups?order=PO-2024-023'
  },
  {
    id: 4,
    type: 'success' as const,
    title: 'دریافت محموله',
    description: 'محموله سفارش PO-2024-018 با موفقیت به انبار تحویل شد',
    priority: 'low' as const,
    dueDate: new Date(),
    link: '/warehouse-receipts'
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'info':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'فوری';
    case 'high':
      return 'بالا';
    case 'medium':
      return 'متوسط';
    case 'low':
      return 'پایین';
    default:
      return 'نامشخص';
  }
};

export function AlertsAndTasks() {
  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
          <p className="text-sm">همه چیز به روز است!</p>
          <p className="text-xs mt-1">هیچ هشدار یا وظیفه فوری موجود نیست</p>
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start space-x-3 space-x-reverse p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-shrink-0">
              {getTypeIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge 
                        variant={getPriorityBadgeVariant(alert.priority) as any}
                        className="text-xs"
                      >
                        {getPriorityLabel(alert.priority)}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {PersianDate.formatRelative(alert.dueDate)}
                      </span>
                    </div>
                    <Link href={alert.link}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <ExternalLink className="h-3 w-3 ml-1" />
                        مشاهده
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      
      {alerts.length > 0 && (
        <div className="pt-2">
          <Link href="/alerts">
            <Button variant="outline" className="w-full text-sm">
              مشاهده همه هشدارها
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

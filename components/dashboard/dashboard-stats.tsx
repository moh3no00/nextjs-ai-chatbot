'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ShoppingCart,
  FileText,
  Receipt,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: React.ElementType;
  description?: string;
}

function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString('fa-IR') : value}
        </div>
        {change && (
          <div className="flex items-center space-x-1 space-x-reverse text-xs">
            {change.trend === 'up' && (
              <TrendingUp className="h-3 w-3 text-green-600" />
            )}
            {change.trend === 'down' && (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            {change.trend === 'neutral' && (
              <Minus className="h-3 w-3 text-gray-600" />
            )}
            <span
              className={cn(
                change.trend === 'up' && 'text-green-600',
                change.trend === 'down' && 'text-red-600',
                change.trend === 'neutral' && 'text-gray-600'
              )}
            >
              {change.value > 0 ? '+' : ''}{change.value.toLocaleString('fa-IR')}%
            </span>
            <span className="text-muted-foreground">
              نسبت به ماه گذشته
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  // These would normally come from your API/database
  const stats = [
    {
      title: 'سفارشات فعال',
      value: 24,
      change: { value: 12, trend: 'up' as const },
      icon: ShoppingCart,
      description: 'سفارشات در حال پردازش'
    },
    {
      title: 'پیش‌فاکتور در انتظار',
      value: 8,
      change: { value: -5, trend: 'down' as const },
      icon: FileText,
      description: 'منتظر تایید'
    },
    {
      title: 'فاکتور پرداخت‌نشده',
      value: 15,
      change: { value: 2, trend: 'up' as const },
      icon: Receipt,
      description: 'نیاز به پیگیری'
    },
    {
      title: 'مبلغ کل معوقه',
      value: '۲۵۰,۰۰۰,۰۰۰ ریال',
      change: { value: -8, trend: 'down' as const },
      icon: CreditCard,
      description: 'پرداخت‌های معوقه'
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

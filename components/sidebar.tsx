'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { UserNav } from '@/components/user-nav';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  CheckSquare,
  Phone,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  ChevronLeft,
  MessageSquare,
  Building2,
  Truck,
} from 'lucide-react';

const navigation = [
  {
    title: 'داشبورد',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'مدیریت کالا',
    icon: Package,
    items: [
      { title: 'ثبت کالا', href: '/products' },
      { title: 'دسته‌بندی کالا', href: '/categories' },
    ]
  },
  {
    title: 'مدیریت تامین‌کنندگان',
    icon: Building2,
    items: [
      { title: 'ثبت تامین‌کننده', href: '/suppliers' },
      { title: 'مخاطبین', href: '/supplier-contacts' },
    ]
  },
  {
    title: 'سفارشات خرید',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    title: 'پیش‌فاکتورها',
    icon: FileText,
    items: [
      { title: 'ثبت پیش‌فاکتور', href: '/proforma-invoices' },
      { title: 'تایید پیش‌فاکتور', href: '/proforma-approvals' },
    ]
  },
  {
    title: 'فاکتورهای خرید',
    href: '/invoices',
    icon: Receipt,
  },
  {
    title: 'پیگیری‌ها',
    href: '/follow-ups',
    icon: Phone,
  },
  {
    title: 'رسید انبار',
    href: '/warehouse-receipts',
    icon: Truck,
  },
  {
    title: 'پرداخت‌ها',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'گزارشات',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'تنظیمات',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                نیسان پارتس
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                مدیریت قطعات یدکی
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft
            className={cn(
              'h-4 w-4 transition-transform',
              collapsed ? 'rotate-180' : ''
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            if (item.items) {
              const isExpanded = expandedGroups.includes(item.title);
              return (
                <div key={item.title} className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => toggleGroup(item.title)}
                    className={cn(
                      'w-full justify-between text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700',
                      collapsed ? 'px-2' : 'px-3'
                    )}
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronLeft
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isExpanded ? 'rotate-90' : ''
                        )}
                      />
                    )}
                  </Button>
                  {isExpanded && !collapsed && (
                    <div className="space-y-1 pr-6">
                      {item.items.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700',
                              pathname === subItem.href
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                : ''
                            )}
                          >
                            {subItem.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.href} href={item.href!}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700',
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : '',
                    collapsed ? 'px-2' : 'px-3'
                  )}
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="text-sm">{item.title}</span>}
                  </div>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* AI Chat Button */}
      <div className="p-4">
        <Link href="/chat">
          <Button
            variant="outline"
            className={cn(
              'w-full',
              collapsed ? 'px-2' : 'px-3'
            )}
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <MessageSquare className="h-5 w-5" />
              {!collapsed && <span className="text-sm">چت با هوش مصنوعی</span>}
            </div>
          </Button>
        </Link>
      </div>

      <Separator />

      {/* User Navigation */}
      <div className="p-4">
        <UserNav collapsed={collapsed} />
      </div>
    </div>
  );
}

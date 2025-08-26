'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Search, 
  Filter,
  ShoppingCart
} from 'lucide-react';
import { PersianDate } from '@/lib/utils/persian-date';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  supplier: {
    id: string;
    name: string;
  };
  orderType: 'warranty' | 'service' | 'commercial';
  status: 'draft' | 'submitted' | 'confirmed' | 'partially_received' | 'completed' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate?: Date;
  totalAmount: number;
  itemsCount: number;
  createdBy: {
    name: string;
  };
  createdAt: Date;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PO-2024-001',
    supplier: { id: '1', name: 'شرکت پارت‌سازان' },
    orderType: 'commercial',
    status: 'confirmed',
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    totalAmount: 25000000,
    itemsCount: 5,
    createdBy: { name: 'علی احمدی' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    orderNumber: 'PO-2024-002',
    supplier: { id: '2', name: 'آسیا موتور' },
    orderType: 'warranty',
    status: 'submitted',
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalAmount: 15000000,
    itemsCount: 3,
    createdBy: { name: 'مریم کریمی' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    orderNumber: 'PO-2024-003',
    supplier: { id: '1', name: 'شرکت پارت‌سازان' },
    orderType: 'service',
    status: 'partially_received',
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expectedDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalAmount: 45000000,
    itemsCount: 8,
    createdBy: { name: 'حسن رضایی' },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
];

const getOrderTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    warranty: 'گارانتی',
    service: 'خدماتی',
    commercial: 'تجاری'
  };
  return types[type] || type;
};

const getStatusLabel = (status: string) => {
  const statuses: Record<string, string> = {
    draft: 'پیش‌نویس',
    submitted: 'ثبت‌شده',
    confirmed: 'تایید‌شده',
    partially_received: 'دریافت جزئی',
    completed: 'تکمیل‌شده',
    cancelled: 'لغو‌شده'
  };
  return statuses[status] || status;
};

const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, any> = {
    draft: 'outline',
    submitted: 'default',
    confirmed: 'secondary',
    partially_received: 'default',
    completed: 'default',
    cancelled: 'destructive'
  };
  return variants[status] || 'outline';
};

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
        order.supplier.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const handleView = (order: Order) => {
    toast.info(`مشاهده سفارش: ${order.orderNumber}`);
  };

  const handleEdit = (order: Order) => {
    toast.info(`ویرایش سفارش: ${order.orderNumber}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="جستجو در شماره سفارش یا نام تامین‌کننده..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-4 pr-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          نمایش {filteredOrders.length} سفارش از مجموع {orders.length} سفارش
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>شماره سفارش</TableHead>
              <TableHead>تامین‌کننده</TableHead>
              <TableHead>نوع سفارش</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تاریخ سفارش</TableHead>
              <TableHead>تاریخ تحویل</TableHead>
              <TableHead>مبلغ کل</TableHead>
              <TableHead>تعداد اقلام</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'سفارشی با این مشخصات یافت نشد' : 'هیچ سفارشی ثبت نشده است'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      {order.orderNumber}
                    </code>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {order.supplier.name}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">
                      {getOrderTypeLabel(order.orderType)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white">
                        {PersianDate.format(order.orderDate)}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {order.expectedDeliveryDate ? (
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">
                          {PersianDate.format(order.expectedDeliveryDate)}
                        </p>
                        <p className={`text-xs ${
                          order.expectedDeliveryDate < new Date() 
                            ? 'text-red-600' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {PersianDate.formatRelative(order.expectedDeliveryDate)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">
                        {order.totalAmount.toLocaleString('fa-IR')} ریال
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {(order.totalAmount / 1000000).toFixed(1)} میلیون
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary">
                      {order.itemsCount.toLocaleString('fa-IR')} قلم
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          مشاهده جزئیات
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(order)}>
                          <Edit className="mr-2 h-4 w-4" />
                          ویرایش
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

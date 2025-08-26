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
  Trash2, 
  MoreHorizontal, 
  Search, 
  Filter,
  Package
} from 'lucide-react';
import { PersianDate } from '@/lib/utils/persian-date';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  code: string;
  serialNumber?: string;
  technicalNumber?: string;
  category: {
    id: string;
    name: string;
  };
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: {
    name: string;
  };
}

// Mock data - in real app, this would come from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'لنت ترمز جلو راست',
    code: 'NS-2024-001',
    serialNumber: 'SN123456',
    technicalNumber: 'TN-45678',
    category: { id: '3', name: 'سیستم ترمز' },
    unit: 'عدد',
    description: 'لنت ترمز اصلی نیسان',
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'علی احمدی' }
  },
  {
    id: '2',
    name: 'فیلتر روغن موتور',
    code: 'NS-2024-002',
    serialNumber: 'SN789012',
    technicalNumber: 'TN-78901',
    category: { id: '1', name: 'قطعات موتور' },
    unit: 'عدد',
    description: 'فیلتر روغن اصلی',
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'مریم کریمی' }
  },
  {
    id: '3',
    name: 'چراغ جلو چپ',
    code: 'NS-2024-003',
    serialNumber: 'SN345678',
    technicalNumber: 'TN-34567',
    category: { id: '2', name: 'قطعات بدنه' },
    unit: 'عدد',
    description: 'چراغ جلو LED',
    isActive: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'حسن رضایی' }
  }
];

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.code.toLowerCase().includes(term.toLowerCase()) ||
        product.category.name.toLowerCase().includes(term.toLowerCase()) ||
        (product.serialNumber && product.serialNumber.toLowerCase().includes(term.toLowerCase())) ||
        (product.technicalNumber && product.technicalNumber.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  };

  const handleEdit = (product: Product) => {
    toast.info(`ویرایش کالا: ${product.name}`);
    // Here you would open an edit dialog or navigate to edit page
  };

  const handleDelete = (product: Product) => {
    if (confirm(`آیا از حذف کالا "${product.name}" مطمئن هستید؟`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      setFilteredProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success('کالا با موفقیت حذف شد');
    }
  };

  const toggleActive = (product: Product) => {
    const updatedProducts = products.map(p => 
      p.id === product.id 
        ? { ...p, isActive: !p.isActive }
        : p
    );
    setProducts(updatedProducts);
    setFilteredProducts(prev => prev.map(p => 
      p.id === product.id 
        ? { ...p, isActive: !p.isActive }
        : p
    ));
    toast.success(product.isActive ? 'کالا غیرفعال شد' : 'کالا فعال شد');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="جستجو در نام، کد، دسته‌بندی یا شماره..."
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
          نمایش {filteredProducts.length} کالا از مجموع {products.length} کالا
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام کالا</TableHead>
              <TableHead>کد کالا</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>شماره سریال</TableHead>
              <TableHead>شماره فنی</TableHead>
              <TableHead>واحد</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تاریخ ثبت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'کالایی با این مشخصات یافت نشد' : 'هیچ کالایی ثبت نشده است'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="text-gray-900 dark:text-white">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...` 
                            : product.description
                          }
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                      {product.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.serialNumber || '-'}</TableCell>
                  <TableCell>{product.technicalNumber || '-'}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={product.isActive ? 'default' : 'secondary'}
                      className={product.isActive ? 'bg-green-100 text-green-800' : ''}
                    >
                      {product.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white">
                        {PersianDate.format(product.createdAt)}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        توسط {product.createdBy.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActive(product)}>
                          <Package className="mr-2 h-4 w-4" />
                          {product.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          حذف
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

      {/* Pagination would go here */}
      {filteredProducts.length > 10 && (
        <div className="flex justify-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            صفحه‌بندی در نسخه‌های بعدی اضافه خواهد شد
          </p>
        </div>
      )}
    </div>
  );
}

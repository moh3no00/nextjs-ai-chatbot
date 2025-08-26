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
  Building2,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { PersianDate } from '@/lib/utils/persian-date';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  address?: string;
  taxId?: string;
  registrationNumber?: string;
  contacts: {
    name: string;
    position?: string;
    isPrimary: boolean;
  }[];
  isActive: boolean;
  createdAt: Date;
  createdBy: {
    name: string;
  };
}

// Mock data - in real app, this would come from API
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'شرکت پارت‌سازان',
    companyName: 'شرکت پارت‌سازان نیسان',
    phone: '021-12345678',
    mobile: '09123456789',
    email: 'info@partsazan.com',
    website: 'https://www.partsazan.com',
    address: 'تهران، خیابان انقلاب، پلاک ۱۲۳',
    taxId: '123456789',
    registrationNumber: '12345',
    contacts: [
      { name: 'احمد محمدی', position: 'مدیر فروش', isPrimary: true },
      { name: 'سارا احمدی', position: 'کارشناس', isPrimary: false }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'علی احمدی' }
  },
  {
    id: '2',
    name: 'آسیا موتور',
    companyName: 'شرکت آسیا موتور',
    phone: '021-87654321',
    mobile: '09987654321',
    email: 'info@asiamotor.com',
    address: 'تهران، خیابان ولیعصر، پلاک ۴۵۶',
    taxId: '987654321',
    contacts: [
      { name: 'مریم کریمی', position: 'مدیر عامل', isPrimary: true }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'مریم کریمی' }
  },
  {
    id: '3',
    name: 'نوین قطعه',
    companyName: 'شرکت نوین قطعه',
    phone: '021-11223344',
    email: 'info@novinghate.com',
    address: 'کرج، خیابان طالقانی، پلاک ۷۸۹',
    contacts: [],
    isActive: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdBy: { name: 'حسن رضایی' }
  }
];

export function SuppliersTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(mockSuppliers);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(term.toLowerCase()) ||
        supplier.companyName.toLowerCase().includes(term.toLowerCase()) ||
        (supplier.email && supplier.email.toLowerCase().includes(term.toLowerCase())) ||
        (supplier.phone && supplier.phone.includes(term)) ||
        (supplier.mobile && supplier.mobile.includes(term))
      );
      setFilteredSuppliers(filtered);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    toast.info(`ویرایش تامین‌کننده: ${supplier.name}`);
    // Here you would open an edit dialog or navigate to edit page
  };

  const handleDelete = (supplier: Supplier) => {
    if (confirm(`آیا از حذف تامین‌کننده "${supplier.name}" مطمئن هستید؟`)) {
      setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
      setFilteredSuppliers(prev => prev.filter(s => s.id !== supplier.id));
      toast.success('تامین‌کننده با موفقیت حذف شد');
    }
  };

  const toggleActive = (supplier: Supplier) => {
    const updatedSuppliers = suppliers.map(s => 
      s.id === supplier.id 
        ? { ...s, isActive: !s.isActive }
        : s
    );
    setSuppliers(updatedSuppliers);
    setFilteredSuppliers(prev => prev.map(s => 
      s.id === supplier.id 
        ? { ...s, isActive: !s.isActive }
        : s
    ));
    toast.success(supplier.isActive ? 'تامین‌کننده غیرفعال شد' : 'تامین‌کننده فعال شد');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="جستجو در نام، شرکت، ایمیل یا تلفن..."
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
          نمایش {filteredSuppliers.length} تامین‌کننده از مجموع {suppliers.length} تامین‌کننده
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>تامین‌کننده</TableHead>
              <TableHead>اطلاعات تماس</TableHead>
              <TableHead>مخاطب اصلی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>تاریخ ثبت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'تامین‌کننده‌ای با این مشخصات یافت نشد' : 'هیچ تامین‌کننده‌ای ثبت نشده است'}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => {
                const primaryContact = supplier.contacts.find(c => c.isPrimary);
                
                return (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {supplier.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {supplier.companyName}
                        </p>
                        {supplier.address && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {supplier.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {supplier.phone && (
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3 ml-1" />
                            {supplier.phone}
                          </div>
                        )}
                        {supplier.mobile && (
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Phone className="h-3 w-3 ml-1" />
                            {supplier.mobile}
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Mail className="h-3 w-3 ml-1" />
                            {supplier.email}
                          </div>
                        )}
                        {supplier.website && (
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Globe className="h-3 w-3 ml-1" />
                            <a 
                              href={supplier.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              وب‌سایت
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {primaryContact ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {primaryContact.name}
                          </p>
                          {primaryContact.position && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {primaryContact.position}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                      {supplier.contacts.length > 1 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          +{supplier.contacts.length - 1} مخاطب دیگر
                        </p>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={supplier.isActive ? 'default' : 'secondary'}
                        className={supplier.isActive ? 'bg-green-100 text-green-800' : ''}
                      >
                        {supplier.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white">
                          {PersianDate.format(supplier.createdAt)}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          توسط {supplier.createdBy.name}
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
                          <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                            <Edit className="mr-2 h-4 w-4" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(supplier)}>
                            <Building2 className="mr-2 h-4 w-4" />
                            {supplier.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(supplier)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

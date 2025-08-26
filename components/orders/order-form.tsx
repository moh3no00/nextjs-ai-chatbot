'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
}

interface OrderFormData {
  orderNumber: string;
  supplierId: string;
  orderType: 'warranty' | 'service' | 'commercial';
  expectedDeliveryDate: string;
  notes: string;
  items: OrderItem[];
}

const initialFormData: OrderFormData = {
  orderNumber: '',
  supplierId: '',
  orderType: 'commercial',
  expectedDeliveryDate: '',
  notes: '',
  items: [],
};

const mockSuppliers = [
  { id: '1', name: 'شرکت پارت‌سازان' },
  { id: '2', name: 'آسیا موتور' },
  { id: '3', name: 'نوین قطعه' },
];

const mockProducts = [
  { id: '1', name: 'لنت ترمز جلو راست', code: 'NS-2024-001' },
  { id: '2', name: 'فیلتر روغن موتور', code: 'NS-2024-002' },
  { id: '3', name: 'چراغ جلو چپ', code: 'NS-2024-003' },
];

const orderTypes = [
  { value: 'commercial', label: 'تجاری' },
  { value: 'warranty', label: 'گارانتی' },
  { value: 'service', label: 'خدماتی' },
];

interface OrderFormProps {
  initialData?: Partial<OrderFormData>;
  onSubmit?: (data: OrderFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function OrderForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    ...initialFormData,
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof Omit<OrderFormData, 'items'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index 
          ? { 
              ...item, 
              [field]: value,
              totalPrice: field === 'quantity' || field === 'unitPrice' 
                ? (field === 'quantity' ? value : item.quantity) * 
                  (field === 'unitPrice' ? value : (item.unitPrice || 0))
                : item.totalPrice
            }
          : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: OrderItem = {
      productId: '',
      productName: '',
      productCode: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      notes: '',
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      handleItemChange(index, 'productId', productId);
      handleItemChange(index, 'productName', product.name);
      handleItemChange(index, 'productCode', product.code);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderNumber.trim() || !formData.supplierId) {
      toast.error('شماره سفارش و انتخاب تامین‌کننده الزامی است');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('حداقل یک قلم کالا باید اضافه شود');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast.success(isEditing ? 'سفارش با موفقیت بروزرسانی شد' : 'سفارش با موفقیت ثبت شد');
      
      if (!isEditing) {
        setFormData(initialFormData);
      }
    } catch (error) {
      toast.error('خطا در ثبت سفارش');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <ShoppingCart className="h-5 w-5" />
            <span>اطلاعات پایه سفارش</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">شماره سفارش *</Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                placeholder="PO-2024-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierId">تامین‌کننده *</Label>
              <Select 
                value={formData.supplierId} 
                onValueChange={(value) => handleInputChange('supplierId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب تامین‌کننده" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderType">نوع سفارش</Label>
              <Select 
                value={formData.orderType} 
                onValueChange={(value: any) => handleInputChange('orderType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب نوع سفارش" />
                </SelectTrigger>
                <SelectContent>
                  {orderTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">تاریخ تحویل مورد انتظار</Label>
              <Input
                id="expectedDeliveryDate"
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="notes">یادداشت‌ها</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="یادداشت‌ها و توضیحات تکمیلی..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>اقلام سفارش</CardTitle>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن قلم
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              هیچ قلمی اضافه نشده است
            </p>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      قلم {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>کالا</Label>
                      <Select 
                        value={item.productId}
                        onValueChange={(value) => handleProductSelect(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="انتخاب کالا" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>تعداد</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        placeholder="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>قیمت واحد (ریال)</Label>
                      <Input
                        type="number"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>یادداشت</Label>
                      <Input
                        value={item.notes || ''}
                        onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                        placeholder="یادداشت برای این قلم..."
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>قیمت کل</Label>
                      <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded border">
                        <span className="text-sm font-medium">
                          {(item.totalPrice || 0).toLocaleString('fa-IR')} ریال
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.items.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">مجموع کل:</span>
                <span className="text-xl font-bold text-blue-600">
                  {calculateTotal().toLocaleString('fa-IR')} ریال
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-2 space-x-reverse pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            انصراف
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 ml-2" />
          {isLoading ? 'در حال ثبت...' : (isEditing ? 'بروزرسانی' : 'ثبت سفارش')}
        </Button>
      </div>
    </form>
  );
}

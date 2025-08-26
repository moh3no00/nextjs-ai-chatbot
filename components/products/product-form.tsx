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
import { toast } from 'sonner';
import { Save, Package } from 'lucide-react';

interface ProductFormData {
  name: string;
  code: string;
  serialNumber: string;
  technicalNumber: string;
  categoryId: string;
  description: string;
  unit: string;
}

const initialFormData: ProductFormData = {
  name: '',
  code: '',
  serialNumber: '',
  technicalNumber: '',
  categoryId: '',
  description: '',
  unit: 'عدد',
};

const categories = [
  { id: '1', name: 'قطعات موتور' },
  { id: '2', name: 'قطعات بدنه' },
  { id: '3', name: 'سیستم ترمز' },
  { id: '4', name: 'سیستم تعلیق' },
  { id: '5', name: 'قطعات الکترونیک' },
  { id: '6', name: 'سایر' },
];

const units = [
  'عدد',
  'جفت',
  'متر',
  'کیلوگرم',
  'لیتر',
  'بسته',
  'جعبه',
];

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit?: (data: ProductFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function ProductForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    ...initialFormData,
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('نام کالا و کد کالا الزامی هستند');
      return;
    }

    setIsLoading(true);

    try {
      // Here you would make an API call to save the product
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast.success(isEditing ? 'کالا با موفقیت بروزرسانی شد' : 'کالا با موفقیت ثبت شد');
      
      if (!isEditing) {
        setFormData(initialFormData);
      }
    } catch (error) {
      toast.error('خطا در ثبت کالا');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse">
          <Package className="h-5 w-5" />
          <span>{isEditing ? 'ویرایش کالا' : 'ثبت کالای جدید'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام کالا *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="مثال: لنت ترمز جلو"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">کد کالا *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="مثال: NS-2024-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">سریال کالا</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                placeholder="مثال: SN123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalNumber">شماره فنی</Label>
              <Input
                id="technicalNumber"
                value={formData.technicalNumber}
                onChange={(e) => handleInputChange('technicalNumber', e.target.value)}
                placeholder="مثال: TN-45678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">دسته‌بندی</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => handleInputChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">واحد</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب واحد" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="توضیحات تکمیلی در مورد کالا..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                انصراف
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 ml-2" />
              {isLoading ? 'در حال ثبت...' : (isEditing ? 'بروزرسانی' : 'ثبت کالا')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

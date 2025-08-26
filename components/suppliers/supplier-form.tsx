'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Save, Building2, Plus, Trash2 } from 'lucide-react';

interface Contact {
  name: string;
  position: string;
  phone: string;
  mobile: string;
  email: string;
  notes: string;
  isPrimary: boolean;
}

interface SupplierFormData {
  name: string;
  companyName: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  taxId: string;
  registrationNumber: string;
  notes: string;
  contacts: Contact[];
}

const initialFormData: SupplierFormData = {
  name: '',
  companyName: '',
  address: '',
  phone: '',
  mobile: '',
  email: '',
  website: '',
  taxId: '',
  registrationNumber: '',
  notes: '',
  contacts: [],
};

const initialContact: Contact = {
  name: '',
  position: '',
  phone: '',
  mobile: '',
  email: '',
  notes: '',
  isPrimary: false,
};

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  onSubmit?: (data: SupplierFormData) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function SupplierForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}: SupplierFormProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    ...initialFormData,
    ...initialData,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof Omit<SupplierFormData, 'contacts'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (index: number, field: keyof Contact, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { ...initialContact }],
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const setPrimaryContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.map((contact, i) => ({
        ...contact,
        isPrimary: i === index,
      })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.companyName.trim()) {
      toast.error('نام تامین‌کننده و نام شرکت الزامی هستند');
      return;
    }

    setIsLoading(true);

    try {
      // Here you would make an API call to save the supplier
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      toast.success(isEditing ? 'تامین‌کننده با موفقیت بروزرسانی شد' : 'تامین‌کننده با موفقیت ثبت شد');
      
      if (!isEditing) {
        setFormData(initialFormData);
      }
    } catch (error) {
      toast.error('خطا در ثبت تامین‌کننده');
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
            <Building2 className="h-5 w-5" />
            <span>اطلاعات پایه</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام تامین‌کننده *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="مثال: شرکت پارت‌سازان"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">نام شرکت *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="مثال: شرکت پارت‌سازان نیسان"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">تلفن</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="021-12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">موبایل</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="09123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">وب‌سایت</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://www.company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">شناسه مالیاتی</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="123456789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationNumber">شماره ثبت</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="address">آدرس</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="آدرس کامل تامین‌کننده..."
              rows={3}
            />
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

      {/* Contacts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>اشخاص مرتبط</CardTitle>
            <Button type="button" variant="outline" onClick={addContact}>
              <Plus className="h-4 w-4 ml-2" />
              افزودن مخاطب
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.contacts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              هیچ مخاطبی اضافه نشده است
            </p>
          ) : (
            <div className="space-y-4">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      مخاطب {index + 1}
                      {contact.isPrimary && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2 py-1 rounded">
                          اصلی
                        </span>
                      )}
                    </h4>
                    <div className="flex space-x-1 space-x-reverse">
                      {!contact.isPrimary && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPrimaryContact(index)}
                        >
                          تعیین به عنوان اصلی
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeContact(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>نام و نام خانوادگی</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        placeholder="نام مخاطب"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>سمت</Label>
                      <Input
                        value={contact.position}
                        onChange={(e) => handleContactChange(index, 'position', e.target.value)}
                        placeholder="مدیر فروش"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>تلفن</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                        placeholder="021-12345678"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>موبایل</Label>
                      <Input
                        value={contact.mobile}
                        onChange={(e) => handleContactChange(index, 'mobile', e.target.value)}
                        placeholder="09123456789"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>ایمیل</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                        placeholder="contact@company.com"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>یادداشت</Label>
                      <Textarea
                        value={contact.notes}
                        onChange={(e) => handleContactChange(index, 'notes', e.target.value)}
                        placeholder="یادداشت‌ها در مورد این مخاطب..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          {isLoading ? 'در حال ثبت...' : (isEditing ? 'بروزرسانی' : 'ثبت تامین‌کننده')}
        </Button>
      </div>
    </form>
  );
}

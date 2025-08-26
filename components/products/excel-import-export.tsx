'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  ChevronDown,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ExcelProduct {
  'نام کالا': string;
  'کد کالا': string;
  'شماره سریال': string;
  'شماره فنی': string;
  'دسته‌بندی': string;
  'واحد': string;
  'توضیحات': string;
}

const sampleData: ExcelProduct[] = [
  {
    'نام کالا': 'لنت ترمز جلو راست',
    'کد کالا': 'NS-2024-001',
    'شماره سریال': 'SN123456',
    'شماره فنی': 'TN-45678',
    'دسته‌بندی': 'سیستم ترمز',
    'واحد': 'عدد',
    'توضیحات': 'لنت ترمز اصلی نیسان'
  },
  {
    'نام کالا': 'فیلتر روغن موتور',
    'کد کالا': 'NS-2024-002',
    'شماره سریال': 'SN789012',
    'شماره فنی': 'TN-78901',
    'دسته‌بندی': 'قطعات موتور',
    'واحد': 'عدد',
    'توضیحات': 'فیلتر روغن اصلی'
  }
];

export function ExcelImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleFile = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'نمونه کالاها');
    
    // Set RTL direction for the worksheet
    if (worksheet['!ref']) {
      worksheet['!dir'] = 'rtl';
    }

    XLSX.writeFile(workbook, 'نمونه-کالاها.xlsx');
    toast.success('فایل نمونه دانلود شد');
  };

  const exportData = async () => {
    setIsExporting(true);
    
    try {
      // In a real app, you would fetch this data from your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock data for export - replace with actual data
      const exportData = [
        {
          'نام کالا': 'لنت ترمز جلو راست',
          'کد کالا': 'NS-2024-001',
          'شماره سریال': 'SN123456',
          'شماره فنی': 'TN-45678',
          'دسته‌بندی': 'سیستم ترمز',
          'واحد': 'عدد',
          'توضیحات': 'لنت ترمز اصلی نیسان',
          'تاریخ ثبت': '۱۴۰۳/۰۸/۰۵',
          'ثبت کننده': 'علی احمدی'
        },
        // Add more products here
      ];

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'کالاها');
      
      const currentDate = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-');
      XLSX.writeFile(workbook, `کالاها-${currentDate}.xlsx`);
      
      toast.success('اطلاعات با موفقیت صادر شد');
    } catch (error) {
      toast.error('خطا در صادر کردن اطلاعات');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelProduct[];
        
        // Validate data structure
        if (jsonData.length === 0) {
          throw new Error('فایل خالی است');
        }

        const requiredFields = ['نام کالا', 'کد کالا'];
        const firstRow = jsonData[0];
        const missingFields = requiredFields.filter(field => !firstRow.hasOwnProperty(field));
        
        if (missingFields.length > 0) {
          throw new Error(`فیلدهای الزامی موجود نیست: ${missingFields.join(', ')}`);
        }

        // Process the data
        processImportData(jsonData);
        
      } catch (error) {
        console.error('Import error:', error);
        toast.error(error instanceof Error ? error.message : 'خطا در خواندن فایل');
      } finally {
        setIsImporting(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const processImportData = async (data: ExcelProduct[]) => {
    try {
      // Here you would send the data to your API
      console.log('Import data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${data.length} کالا با موفقیت وارد شد`);
      
      // You might want to refresh the products table here
      // window.location.reload() or update state
      
    } catch (error) {
      toast.error('خطا در واردات اطلاعات');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2 space-x-reverse">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Excel</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={downloadSampleFile}>
            <Download className="mr-2 h-4 w-4" />
            دانلود فایل نمونه
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={triggerFileUpload} disabled={isImporting}>
            {isImporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            واردات از Excel
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={exportData} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            صادرات به Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

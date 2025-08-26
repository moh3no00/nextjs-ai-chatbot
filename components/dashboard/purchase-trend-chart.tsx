'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'فروردین', orders: 12, amount: 85000000 },
  { month: 'اردیبهشت', orders: 18, amount: 125000000 },
  { month: 'خرداد', orders: 15, amount: 95000000 },
  { month: 'تیر', orders: 22, amount: 165000000 },
  { month: 'مرداد', orders: 28, amount: 195000000 },
  { month: 'شهریور', orders: 24, amount: 175000000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.dataKey === 'orders' ? 'تعداد سفارشات' : 'مبلغ (ریال)'}:{' '}
            {entry.dataKey === 'orders' 
              ? entry.value.toLocaleString('fa-IR')
              : `${(entry.value / 1000000).toLocaleString('fa-IR')} میلیون`
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PurchaseTrendChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', direction: 'rtl' }}
            formatter={(value: string) => (
              <span className="text-gray-700 dark:text-gray-300">
                {value === 'orders' ? 'تعداد سفارشات' : 'مبلغ (ریال)'}
              </span>
            )}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

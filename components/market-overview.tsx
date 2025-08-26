'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Bitcoin,
  DollarSign,
  Banknote,
  Coins,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketOverviewData {
  crypto: Array<{
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume: number;
    marketCap: number;
  }>;
  stocks: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  forex: Array<{
    pair: string;
    rate: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  metals: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    unit: string;
  }>;
}

const MOCK_DATA: MarketOverviewData = {
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change24h: 2.45, volume: 28500000000, marketCap: 847000000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 2650.30, change24h: -1.20, volume: 15200000000, marketCap: 318000000000 },
    { symbol: 'BNB', name: 'Binance Coin', price: 310.75, change24h: 0.85, volume: 1200000000, marketCap: 47800000000 },
    { symbol: 'SOL', name: 'Solana', price: 98.45, change24h: 4.20, volume: 2100000000, marketCap: 42500000000 },
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 182.52, change: 2.45, changePercent: 1.36 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2840.15, change: -15.30, changePercent: -0.54 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.20, changePercent: 1.12 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -8.75, changePercent: -3.40 },
  ],
  forex: [
    { pair: 'EUR/USD', rate: 1.0875, change: 0.0025, trend: 'up' },
    { pair: 'GBP/USD', rate: 1.2545, change: -0.0012, trend: 'down' },
    { pair: 'USD/JPY', rate: 150.25, change: 0.45, trend: 'up' },
    { pair: 'AUD/USD', rate: 0.6520, change: -0.0008, trend: 'down' },
  ],
  metals: [
    { symbol: 'GOLD', name: 'Gold', price: 2055.50, change: 12.50, unit: 'USD/oz' },
    { symbol: 'SILVER', name: 'Silver', price: 24.85, change: -0.35, unit: 'USD/oz' },
    { symbol: 'PLATINUM', name: 'Platinum', price: 945.20, change: 8.75, unit: 'USD/oz' },
    { symbol: 'COPPER', name: 'Copper', price: 8420.50, change: -45.20, unit: 'USD/ton' },
  ],
};

export function MarketOverview() {
  const [data, setData] = useState<MarketOverviewData>(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call with random price changes
    setTimeout(() => {
      const updatedData = {
        ...MOCK_DATA,
        crypto: MOCK_DATA.crypto.map(coin => ({
          ...coin,
          price: coin.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          change24h: (Math.random() - 0.5) * 10, // ±5% random change
        })),
        stocks: MOCK_DATA.stocks.map(stock => ({
          ...stock,
          price: stock.price * (1 + (Math.random() - 0.5) * 0.02),
          changePercent: (Math.random() - 0.5) * 6,
        })),
      };
      setData(updatedData);
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  const formatPrice = (price: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Market Overview</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={refreshData} disabled={loading} variant="outline">
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          {loading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cryptocurrency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bitcoin className="h-5 w-5 text-orange-500" />
              <span>Cryptocurrency</span>
            </CardTitle>
            <CardDescription>Top cryptocurrencies by market cap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.crypto.map((crypto) => (
                <div key={crypto.symbol} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{crypto.symbol}</span>
                      <Badge variant="outline" className="text-xs">{crypto.name}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cap: {formatMarketCap(crypto.marketCap)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${formatPrice(crypto.price)}</p>
                    <div className="flex items-center space-x-1">
                      {crypto.change24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={cn(
                        'text-sm font-medium',
                        crypto.change24h > 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {crypto.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Stock Market</span>
            </CardTitle>
            <CardDescription>Major US stocks performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.stocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{stock.symbol}</span>
                      <Badge variant="outline" className="text-xs">{stock.name}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${formatPrice(stock.price)}</p>
                    <div className="flex items-center space-x-1">
                      {stock.changePercent > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={cn(
                        'text-sm font-medium',
                        stock.changePercent > 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Forex */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span>Foreign Exchange</span>
            </CardTitle>
            <CardDescription>Major currency pairs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.forex.map((forex) => (
                <div key={forex.pair} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <span className="font-semibold">{forex.pair}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(forex.rate, 4)}</p>
                    <div className="flex items-center space-x-1">
                      {forex.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : forex.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ) : (
                        <Activity className="h-3 w-3 text-gray-500" />
                      )}
                      <span className={cn(
                        'text-sm font-medium',
                        forex.change > 0 ? 'text-green-500' : 
                        forex.change < 0 ? 'text-red-500' : 'text-gray-500'
                      )}>
                        {forex.change > 0 ? '+' : ''}{formatPrice(forex.change, 4)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Metals/Commodities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              <span>Precious Metals</span>
            </CardTitle>
            <CardDescription>Commodity prices and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.metals.map((metal) => (
                <div key={metal.symbol} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{metal.symbol}</span>
                      <Badge variant="outline" className="text-xs">{metal.name}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{metal.unit}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${formatPrice(metal.price)}</p>
                    <div className="flex items-center space-x-1">
                      {metal.change > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={cn(
                        'text-sm font-medium',
                        metal.change > 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {metal.change > 0 ? '+' : ''}{formatPrice(metal.change)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

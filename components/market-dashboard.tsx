'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  BarChart3,
  Brain,
  Target,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { MarketSignal } from './market-signal';
import { MarketOverview } from './market-overview';

interface MarketAnalysis {
  symbol: string;
  currentPrice: number;
  technicalAnalysis: {
    trend: 'bullish' | 'bearish' | 'neutral';
    support: number;
    resistance: number;
    rsi: number;
    macdSignal: 'buy' | 'sell' | 'neutral';
    movingAverages: {
      sma20: number;
      sma50: number;
      ema12: number;
      ema26: number;
    };
  };
  fundamentalAnalysis: {
    marketSentiment: 'positive' | 'negative' | 'neutral';
    volumeAnalysis: 'high' | 'normal' | 'low';
    marketCapTrend: 'growing' | 'declining' | 'stable';
    newsImpact: 'positive' | 'negative' | 'neutral';
  };
  psychologicalAnalysis: {
    fearGreedIndex: number;
    socialSentiment: 'bullish' | 'bearish' | 'neutral';
    institutionalFlow: 'inflow' | 'outflow' | 'neutral';
    retailInterest: 'high' | 'medium' | 'low';
  };
  signal: {
    action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    confidence: number;
    timeframe: string;
    entry: number;
    stopLoss: number;
    targetPrice: number;
    reasoning: string;
  };
}

interface MarketAnalysisResponse {
  success: boolean;
  market: string;
  symbol: string;
  analysis?: MarketAnalysis;
  error?: string;
}

const POPULAR_SYMBOLS = {
  crypto: ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'XRP', 'DOT', 'AVAX'],
  stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  metals: ['GOLD', 'SILVER', 'PLATINUM', 'COPPER'],
  commodities: ['OIL', 'GOLD', 'SILVER', 'WHEAT', 'CORN'],
};

export function MarketDashboard() {
  const [selectedMarket, setSelectedMarket] = useState<keyof typeof POPULAR_SYMBOLS>('crypto');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1d');
  const [analysis, setAnalysis] = useState<MarketAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<MarketAnalysisResponse[]>([]);

  const analyzeMarket = async (market: string, symbol: string) => {
    if (!symbol) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market,
          symbol,
          timeframe,
          analysisType: 'full',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data);
        toast.success(`Analysis completed for ${symbol}`);
      } else {
        toast.error(data.error || 'Analysis failed');
      }
    } catch (error) {
      toast.error('Failed to analyze market');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = () => {
    if (analysis && analysis.success) {
      const exists = watchlist.some(item => 
        item.symbol === analysis.symbol && item.market === analysis.market
      );
      
      if (!exists) {
        setWatchlist(prev => [...prev, analysis]);
        toast.success(`${analysis.symbol} added to watchlist`);
      } else {
        toast.info(`${analysis.symbol} is already in watchlist`);
      }
    }
  };

  const removeFromWatchlist = (symbol: string, market: string) => {
    setWatchlist(prev => prev.filter(item => 
      !(item.symbol === symbol && item.market === market)
    ));
    toast.success(`${symbol} removed from watchlist`);
  };

  const getSignalColor = (action: string) => {
    switch (action) {
      case 'strong_buy': return 'bg-green-600 text-white';
      case 'buy': return 'bg-green-500 text-white';
      case 'hold': return 'bg-yellow-500 text-black';
      case 'sell': return 'bg-red-500 text-white';
      case 'strong_sell': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Market Overview */}
      <MarketOverview />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Market Analysis</h1>
          <p className="text-muted-foreground">
            Comprehensive financial market analysis powered by artificial intelligence
          </p>
        </div>
        <Button 
          onClick={() => analyzeMarket(selectedMarket, selectedSymbol || customSymbol)}
          disabled={loading || (!selectedSymbol && !customSymbol)}
          className="ml-4"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Analyzing...' : 'Analyze Market'}
        </Button>
      </div>

      {/* Market Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Market Selection</CardTitle>
          <CardDescription>
            Choose the market and symbol you want to analyze
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="market">Market</Label>
              <Select value={selectedMarket} onValueChange={(value: any) => {
                setSelectedMarket(value);
                setSelectedSymbol('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="metals">Metals</SelectItem>
                  <SelectItem value="commodities">Commodities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Popular Symbols</Label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger>
                  <SelectValue placeholder="Select symbol" />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_SYMBOLS[selectedMarket].map(symbol => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom">Custom Symbol</Label>
              <Input
                id="custom"
                placeholder="Enter symbol..."
                value={customSymbol}
                onChange={(e) => {
                  setCustomSymbol(e.target.value);
                  setSelectedSymbol('');
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                  <SelectItem value="1w">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && analysis.success && analysis.analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="fundamental">Fundamental</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                      <p className="text-2xl font-bold">${analysis.analysis.currentPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(analysis.analysis.technicalAnalysis.trend)}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Trend</p>
                      <p className="text-xl font-semibold capitalize">
                        {analysis.analysis.technicalAnalysis.trend}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fear & Greed</p>
                      <p className="text-xl font-semibold">
                        {analysis.analysis.psychologicalAnalysis.fearGreedIndex}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Badge className={cn('px-3 py-1', getSignalColor(analysis.analysis.signal.action))}>
                      {analysis.analysis.signal.action.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                    <Progress value={analysis.analysis.signal.confidence} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {analysis.analysis.signal.confidence}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Signal Reasoning</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.analysis.signal.reasoning}</p>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Entry</p>
                    <p className="font-semibold">${analysis.analysis.signal.entry.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stop Loss</p>
                    <p className="font-semibold text-red-500">${analysis.analysis.signal.stopLoss.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Target</p>
                    <p className="font-semibold text-green-500">${analysis.analysis.signal.targetPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Technical Indicators</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">RSI</span>
                    <Badge variant={
                      analysis.analysis.technicalAnalysis.rsi > 70 ? 'destructive' :
                      analysis.analysis.technicalAnalysis.rsi < 30 ? 'default' : 'secondary'
                    }>
                      {analysis.analysis.technicalAnalysis.rsi}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">MACD Signal</span>
                    <Badge variant={
                      analysis.analysis.technicalAnalysis.macdSignal === 'buy' ? 'default' :
                      analysis.analysis.technicalAnalysis.macdSignal === 'sell' ? 'destructive' : 'secondary'
                    }>
                      {analysis.analysis.technicalAnalysis.macdSignal.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Support Level</span>
                    <span className="font-semibold">${analysis.analysis.technicalAnalysis.support.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Resistance Level</span>
                    <span className="font-semibold">${analysis.analysis.technicalAnalysis.resistance.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Moving Averages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SMA 20</span>
                    <span className="font-semibold">${analysis.analysis.technicalAnalysis.movingAverages.sma20.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SMA 50</span>
                    <span className="font-semibold">${analysis.analysis.technicalAnalysis.movingAverages.sma50.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">EMA 12</span>
                    <span className="font-semibold">${analysis.analysis.technicalAnalysis.movingAverages.ema12.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">EMA 26</span>
                    <span className="font-semibold">${analysis.analysis.technicalAnalysis.movingAverages.ema26.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fundamental" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Market Fundamentals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Sentiment</span>
                    <Badge variant={
                      analysis.analysis.fundamentalAnalysis.marketSentiment === 'positive' ? 'default' :
                      analysis.analysis.fundamentalAnalysis.marketSentiment === 'negative' ? 'destructive' : 'secondary'
                    }>
                      {analysis.analysis.fundamentalAnalysis.marketSentiment.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Volume Analysis</span>
                    <Badge variant={
                      analysis.analysis.fundamentalAnalysis.volumeAnalysis === 'high' ? 'default' : 'secondary'
                    }>
                      {analysis.analysis.fundamentalAnalysis.volumeAnalysis.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Market Cap Trend</span>
                    <Badge variant={
                      analysis.analysis.fundamentalAnalysis.marketCapTrend === 'growing' ? 'default' :
                      analysis.analysis.fundamentalAnalysis.marketCapTrend === 'declining' ? 'destructive' : 'secondary'
                    }>
                      {analysis.analysis.fundamentalAnalysis.marketCapTrend.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Psychological Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fear & Greed Index</span>
                      <span className="font-semibold">{analysis.analysis.psychologicalAnalysis.fearGreedIndex}</span>
                    </div>
                    <Progress value={analysis.analysis.psychologicalAnalysis.fearGreedIndex} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Social Sentiment</span>
                    <Badge variant={
                      analysis.analysis.psychologicalAnalysis.socialSentiment === 'bullish' ? 'default' :
                      analysis.analysis.psychologicalAnalysis.socialSentiment === 'bearish' ? 'destructive' : 'secondary'
                    }>
                      {analysis.analysis.psychologicalAnalysis.socialSentiment.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Institutional Flow</span>
                    <Badge variant={
                      analysis.analysis.psychologicalAnalysis.institutionalFlow === 'inflow' ? 'default' :
                      analysis.analysis.psychologicalAnalysis.institutionalFlow === 'outflow' ? 'destructive' : 'secondary'
                    }>
                      {analysis.analysis.psychologicalAnalysis.institutionalFlow.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={addToWatchlist} variant="outline" size="sm">
                Add to Watchlist
              </Button>
            </div>
            <MarketSignal 
              signal={analysis.analysis.signal}
              symbol={analysis.analysis.symbol}
              currentPrice={analysis.analysis.currentPrice}
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Watchlist */}
      {watchlist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Market Watchlist</CardTitle>
            <CardDescription>
              Your monitored markets and their latest signals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {watchlist.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{item.symbol}</p>
                      <p className="text-sm text-muted-foreground capitalize">{item.market}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.analysis?.currentPrice.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.analysis?.technicalAnalysis.trend}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={cn('text-xs', getSignalColor(item.analysis?.signal.action || 'hold'))}>
                      {item.analysis?.signal.action?.replace('_', ' ').toUpperCase() || 'HOLD'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWatchlist(item.symbol, item.market)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

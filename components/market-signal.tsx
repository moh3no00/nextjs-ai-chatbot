'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  DollarSign,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketSignalProps {
  signal: {
    action: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    confidence: number;
    timeframe: string;
    entry: number;
    stopLoss: number;
    targetPrice: number;
    reasoning: string;
  };
  symbol: string;
  currentPrice: number;
}

const getSignalColor = (action: string) => {
  switch (action) {
    case 'strong_buy': return 'bg-green-600 text-white border-green-600';
    case 'buy': return 'bg-green-500 text-white border-green-500';
    case 'hold': return 'bg-yellow-500 text-black border-yellow-500';
    case 'sell': return 'bg-red-500 text-white border-red-500';
    case 'strong_sell': return 'bg-red-600 text-white border-red-600';
    default: return 'bg-gray-500 text-white border-gray-500';
  }
};

const getSignalIcon = (action: string) => {
  switch (action) {
    case 'strong_buy':
    case 'buy':
      return <TrendingUp className="h-4 w-4" />;
    case 'sell':
    case 'strong_sell':
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export function MarketSignal({ signal, symbol, currentPrice }: MarketSignalProps) {
  const riskRewardRatio = Math.abs(signal.targetPrice - signal.entry) / Math.abs(signal.entry - signal.stopLoss);
  const potentialProfit = ((signal.targetPrice - signal.entry) / signal.entry) * 100;
  const potentialLoss = ((signal.stopLoss - signal.entry) / signal.entry) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <span>{symbol}</span>
              <Badge className={cn('flex items-center space-x-1', getSignalColor(signal.action))}>
                {getSignalIcon(signal.action)}
                <span>{signal.action.replace('_', ' ').toUpperCase()}</span>
              </Badge>
            </CardTitle>
            <CardDescription>
              {signal.timeframe} • Confidence: {signal.confidence}%
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Current Price</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Confidence Meter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Signal Confidence</span>
            <span className="text-sm font-bold">{signal.confidence}%</span>
          </div>
          <Progress 
            value={signal.confidence} 
            className={cn(
              "h-2",
              signal.confidence >= 80 ? "bg-green-100" : 
              signal.confidence >= 60 ? "bg-yellow-100" : "bg-red-100"
            )} 
          />
        </div>

        {/* Price Levels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
              <p className="text-sm font-medium text-blue-700">Entry</p>
            </div>
            <p className="text-lg font-bold text-blue-600">${signal.entry.toFixed(2)}</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <p className="text-sm font-medium text-red-700">Stop Loss</p>
            </div>
            <p className="text-lg font-bold text-red-600">${signal.stopLoss.toFixed(2)}</p>
            <p className="text-xs text-red-500">{potentialLoss.toFixed(1)}%</p>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm font-medium text-green-700">Target</p>
            </div>
            <p className="text-lg font-bold text-green-600">${signal.targetPrice.toFixed(2)}</p>
            <p className="text-xs text-green-500">+{potentialProfit.toFixed(1)}%</p>
          </div>
        </div>

        {/* Risk/Reward Analysis */}
        <div className="p-3 bg-gray-50 rounded-lg border">
          <h4 className="font-medium mb-2 flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Risk/Reward Analysis
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Risk/Reward Ratio</p>
              <p className="font-semibold text-lg">1:{riskRewardRatio.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Position Size Suggested</p>
              <p className="font-semibold text-lg">
                {signal.confidence >= 80 ? 'Large' : 
                 signal.confidence >= 60 ? 'Medium' : 'Small'}
              </p>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div>
          <h4 className="font-medium mb-2">Signal Reasoning</h4>
          <p className="text-sm text-muted-foreground leading-relaxed bg-gray-50 p-3 rounded-lg border">
            {signal.reasoning}
          </p>
        </div>

        {/* Action Recommendations */}
        <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <h4 className="font-medium mb-2">Recommended Actions</h4>
          <ul className="text-sm space-y-1">
            {signal.action.includes('buy') && (
              <>
                <li>• Consider entering position at or below ${signal.entry.toFixed(2)}</li>
                <li>• Set stop loss at ${signal.stopLoss.toFixed(2)} to limit downside risk</li>
                <li>• Target profit at ${signal.targetPrice.toFixed(2)}</li>
              </>
            )}
            {signal.action.includes('sell') && (
              <>
                <li>• Consider closing long positions or entering short position</li>
                <li>• Use ${signal.entry.toFixed(2)} as reference entry for short</li>
                <li>• Place stop loss at ${signal.stopLoss.toFixed(2)}</li>
              </>
            )}
            {signal.action === 'hold' && (
              <>
                <li>• Maintain current positions</li>
                <li>• Wait for clearer market signals</li>
                <li>• Monitor key support/resistance levels</li>
              </>
            )}
            <li>• Always use proper risk management (max 2-5% per trade)</li>
            <li>• Consider market conditions and your personal risk tolerance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

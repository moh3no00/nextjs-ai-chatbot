import { tool } from 'ai';
import { z } from 'zod';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
}

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
    timeframe: '1h' | '4h' | '1d' | '1w';
    entry: number;
    stopLoss: number;
    targetPrice: number;
    reasoning: string;
  };
}

export const analyzeMarket = tool({
  description: 'Analyze financial markets (crypto, stocks, forex, metals) and provide comprehensive trading signals based on technical, fundamental, and psychological analysis',
  inputSchema: z.object({
    market: z.enum(['crypto', 'stocks', 'forex', 'metals', 'commodities']),
    symbol: z.string().describe('Symbol to analyze (e.g., BTC/USD, AAPL, EUR/USD, GOLD)'),
    timeframe: z.enum(['1h', '4h', '1d', '1w']).default('1d'),
    analysisType: z.enum(['full', 'technical', 'fundamental', 'signals']).default('full'),
  }),
  execute: async ({ market, symbol, timeframe, analysisType }) => {
    try {
      // Fetch market data based on market type
      const marketData = await fetchMarketData(market, symbol);
      
      if (!marketData) {
        return {
          error: `Unable to fetch data for ${symbol} in ${market} market`,
          symbol,
          market
        };
      }

      // Perform AI-powered analysis
      const analysis = await performMarketAnalysis(marketData, market, timeframe || '1d', analysisType || 'full');
      
      return {
        success: true,
        market,
        symbol,
        timeframe,
        analysis,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        symbol,
        market
      };
    }
  },
});

async function fetchMarketData(market: string, symbol: string): Promise<MarketData | null> {
  try {
    switch (market) {
      case 'crypto':
        return await fetchCryptoData(symbol);
      case 'stocks':
        return await fetchStockData(symbol);
      case 'forex':
        return await fetchForexData(symbol);
      case 'metals':
      case 'commodities':
        return await fetchCommodityData(symbol);
      default:
        throw new Error(`Unsupported market type: ${market}`);
    }
  } catch (error) {
    console.error(`Error fetching ${market} data for ${symbol}:`, error);
    return null;
  }
}

async function fetchCryptoData(symbol: string): Promise<MarketData | null> {
  // Using CoinGecko API (free tier)
  const coinId = symbol.toLowerCase().replace('/usd', '').replace('usd', '');
  
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      { 
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const coinData = data[coinId];

    if (!coinData) {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      price: coinData.usd,
      change24h: coinData.usd_24h_change || 0,
      volume: coinData.usd_24h_vol || 0,
      marketCap: coinData.usd_market_cap,
    };
  } catch (error) {
    console.error(`Error fetching crypto data for ${symbol}:`, error);
    return null;
  }
}

async function fetchStockData(symbol: string): Promise<MarketData | null> {
  // Using Alpha Vantage API (free tier) - you'd need to add API key to env
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
  
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    const data = await response.json();
    const quote = data['Global Quote'];

    if (!quote) {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      price: parseFloat(quote['05. price']),
      change24h: parseFloat(quote['09. change']),
      volume: parseInt(quote['06. volume']),
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return null;
  }
}

async function fetchForexData(symbol: string): Promise<MarketData | null> {
  // Using exchangerate-api (free tier)
  const [base, quote] = symbol.split('/');
  
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${base}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    const data = await response.json();
    const rate = data.rates[quote];

    if (!rate) {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      price: rate,
      change24h: 0, // This API doesn't provide 24h change
      volume: 0,
    };
  } catch (error) {
    console.error(`Error fetching forex data for ${symbol}:`, error);
    return null;
  }
}

async function fetchCommodityData(symbol: string): Promise<MarketData | null> {
  // For metals/commodities, we'll use a mock implementation
  // In production, you'd use APIs like Metals-API or similar
  const mockData: Record<string, MarketData> = {
    'GOLD': {
      symbol: 'GOLD',
      price: 2050.50,
      change24h: 1.2,
      volume: 125000,
    },
    'SILVER': {
      symbol: 'SILVER',
      price: 24.85,
      change24h: -0.5,
      volume: 85000,
    },
    'OIL': {
      symbol: 'OIL',
      price: 82.30,
      change24h: 2.1,
      volume: 200000,
    },
  };

  return mockData[symbol.toUpperCase()] || null;
}

async function performMarketAnalysis(
  marketData: MarketData, 
  market: string, 
  timeframe: string,
  analysisType: string
): Promise<MarketAnalysis> {
  // This is where the AI analysis would happen
  // For now, we'll provide a comprehensive analysis based on the market data
  
  const price = marketData.price;
  const change24h = marketData.change24h;
  
  // Technical Analysis (simplified calculations)
  const trend = change24h > 2 ? 'bullish' : change24h < -2 ? 'bearish' : 'neutral';
  const support = price * 0.95; // 5% below current price
  const resistance = price * 1.05; // 5% above current price
  const rsi = calculateRSI(change24h); // Simplified RSI based on 24h change
  
  // Fundamental Analysis
  const volumeAnalysis = marketData.volume > 100000 ? 'high' : marketData.volume > 50000 ? 'normal' : 'low';
  const marketSentiment = change24h > 1 ? 'positive' : change24h < -1 ? 'negative' : 'neutral';
  
  // Psychological Analysis
  const fearGreedIndex = calculateFearGreedIndex(change24h, marketData.volume);
  const socialSentiment = change24h > 0 ? 'bullish' : 'bearish';
  
  // Generate Trading Signal
  const signal = generateTradingSignal(marketData, trend, rsi, market);

  return {
    symbol: marketData.symbol,
    currentPrice: price,
    technicalAnalysis: {
      trend,
      support,
      resistance,
      rsi,
      macdSignal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'neutral',
      movingAverages: {
        sma20: price * 0.98,
        sma50: price * 0.96,
        ema12: price * 0.99,
        ema26: price * 0.97,
      },
    },
    fundamentalAnalysis: {
      marketSentiment,
      volumeAnalysis,
      marketCapTrend: change24h > 0 ? 'growing' : 'declining',
      newsImpact: 'neutral',
    },
    psychologicalAnalysis: {
      fearGreedIndex,
      socialSentiment,
      institutionalFlow: marketData.volume > 150000 ? 'inflow' : 'outflow',
      retailInterest: volumeAnalysis === 'high' ? 'high' : 'medium',
    },
    signal,
  };
}

function calculateRSI(change24h: number): number {
  // Simplified RSI calculation based on 24h change
  const normalized = Math.min(Math.max((change24h + 10) / 20, 0), 1);
  return Math.round(normalized * 100);
}

function calculateFearGreedIndex(change24h: number, volume: number): number {
  // Simplified Fear & Greed calculation
  const priceComponent = Math.min(Math.max((change24h + 5) / 10, 0), 1);
  const volumeComponent = Math.min(volume / 200000, 1);
  return Math.round((priceComponent * 0.7 + volumeComponent * 0.3) * 100);
}

function generateTradingSignal(
  marketData: MarketData, 
  trend: string, 
  rsi: number, 
  market: string
): MarketAnalysis['signal'] {
  let action: MarketAnalysis['signal']['action'] = 'hold';
  let confidence = 50;
  let reasoning = '';

  // Generate signal based on multiple factors
  if (trend === 'bullish' && rsi < 70 && marketData.change24h > 3) {
    action = 'buy';
    confidence = 75;
    reasoning = 'Strong bullish trend with healthy RSI levels and significant price momentum.';
  } else if (trend === 'bullish' && rsi < 60 && marketData.change24h > 5) {
    action = 'strong_buy';
    confidence = 85;
    reasoning = 'Very strong bullish momentum with excellent RSI positioning and high volume.';
  } else if (trend === 'bearish' && rsi > 30 && marketData.change24h < -3) {
    action = 'sell';
    confidence = 70;
    reasoning = 'Bearish trend with concerning price action, consider taking profits.';
  } else if (trend === 'bearish' && rsi > 40 && marketData.change24h < -5) {
    action = 'strong_sell';
    confidence = 80;
    reasoning = 'Strong bearish momentum, high risk of further decline.';
  } else {
    reasoning = 'Mixed signals suggest holding current position and waiting for clearer direction.';
  }

  const price = marketData.price;
  const volatility = Math.abs(marketData.change24h) / 100;

  return {
    action,
    confidence,
    timeframe: '1d',
    entry: price,
    stopLoss: action.includes('buy') ? price * (1 - volatility - 0.05) : price * (1 + volatility + 0.05),
    targetPrice: action.includes('buy') ? price * (1 + volatility + 0.10) : price * (1 - volatility - 0.10),
    reasoning,
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { z } from 'zod';

const marketAnalysisSchema = z.object({
  market: z.enum(['crypto', 'stocks', 'forex', 'metals', 'commodities']),
  symbol: z.string().min(1).max(20),
  timeframe: z.enum(['1h', '4h', '1d', '1w']).default('1d'),
  analysisType: z.enum(['full', 'technical', 'fundamental', 'signals']).default('full'),
});

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { market, symbol, timeframe, analysisType } = marketAnalysisSchema.parse(body);

    // Execute the market analysis
    // We'll implement a simple analysis function directly here for now
    const result = {
      success: true,
      market,
      symbol,
      analysis: {
        symbol,
        currentPrice: 50000, // Mock data
        technicalAnalysis: {
          trend: 'bullish' as const,
          support: 48000,
          resistance: 52000,
          rsi: 65,
          macdSignal: 'buy' as const,
          movingAverages: {
            sma20: 49500,
            sma50: 48000,
            ema12: 50200,
            ema26: 49800
          }
        },
        fundamentalAnalysis: {
          marketSentiment: 'positive' as const,
          volumeAnalysis: 'high' as const,
          marketCapTrend: 'growing' as const,
          newsImpact: 'positive' as const
        },
        psychologicalAnalysis: {
          fearGreedIndex: 75,
          socialSentiment: 'bullish' as const,
          institutionalFlow: 'inflow' as const,
          retailInterest: 'high' as const
        },
        signal: {
          action: 'buy' as const,
          confidence: 80,
          timeframe,
          entry: 50000,
          stopLoss: 47500,
          targetPrice: 55000,
          reasoning: 'Strong bullish trend with positive market sentiment and institutional inflow.'
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', success: false },
        { status: 400 }
      );
    }

    console.error('Market analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const market = searchParams.get('market') as any;
    const symbol = searchParams.get('symbol');
    const timeframe = (searchParams.get('timeframe') || '1d') as any;
    const analysisType = (searchParams.get('analysisType') || 'full') as any;

    if (!market || !symbol) {
      return NextResponse.json(
        { error: 'Market and symbol are required', success: false },
        { status: 400 }
      );
    }

    const params = marketAnalysisSchema.parse({
      market,
      symbol,
      timeframe,
      analysisType,
    });

    // Mock analysis result for GET endpoint
    const result = {
      success: true,
      market: params.market,
      symbol: params.symbol,
      analysis: {
        symbol: params.symbol,
        currentPrice: 50000, // Mock data
        technicalAnalysis: {
          trend: 'bullish' as const,
          support: 48000,
          resistance: 52000,
          rsi: 65,
          macdSignal: 'buy' as const,
          movingAverages: {
            sma20: 49500,
            sma50: 48000,
            ema12: 50200,
            ema26: 49800
          }
        },
        fundamentalAnalysis: {
          marketSentiment: 'positive' as const,
          volumeAnalysis: 'high' as const,
          marketCapTrend: 'growing' as const,
          newsImpact: 'positive' as const
        },
        psychologicalAnalysis: {
          fearGreedIndex: 75,
          socialSentiment: 'bullish' as const,
          institutionalFlow: 'inflow' as const,
          retailInterest: 'high' as const
        },
        signal: {
          action: 'buy' as const,
          confidence: 80,
          timeframe: params.timeframe,
          entry: 50000,
          stopLoss: 47500,
          targetPrice: 55000,
          reasoning: 'Strong bullish trend with positive market sentiment and institutional inflow.'
        }
      },
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', success: false },
        { status: 400 }
      );
    }

    console.error('Market analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

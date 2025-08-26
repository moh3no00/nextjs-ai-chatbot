CREATE TABLE IF NOT EXISTS "MarketAnalysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"market" varchar NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"timeframe" varchar NOT NULL,
	"currentPrice" numeric(20, 8) NOT NULL,
	"technicalTrend" varchar NOT NULL,
	"supportLevel" numeric(20, 8) NOT NULL,
	"resistanceLevel" numeric(20, 8) NOT NULL,
	"rsi" numeric(5, 2) NOT NULL,
	"macdSignal" varchar NOT NULL,
	"signalAction" varchar NOT NULL,
	"signalConfidence" integer NOT NULL,
	"entryPrice" numeric(20, 8) NOT NULL,
	"stopLoss" numeric(20, 8) NOT NULL,
	"targetPrice" numeric(20, 8) NOT NULL,
	"reasoning" text NOT NULL,
	"marketSentiment" varchar NOT NULL,
	"fearGreedIndex" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MarketWatchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"market" varchar NOT NULL,
	"symbol" varchar(20) NOT NULL,
	"alertPrice" numeric(20, 8),
	"alertType" varchar,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MarketAnalysis" ADD CONSTRAINT "MarketAnalysis_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MarketWatchlist" ADD CONSTRAINT "MarketWatchlist_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

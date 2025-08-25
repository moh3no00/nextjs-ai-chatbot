import type { InferSelectModel } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  decimal,
  integer,
} from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable('Message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  content: json('content').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable('Message_v2', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role: varchar('role').notNull(),
  parts: json('parts').notNull(),
  attachments: json('attachments').notNull(),
  createdAt: timestamp('createdAt').notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  'Vote_v2',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  },
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  },
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'Suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText: text('originalText').notNull(),
    suggestedText: text('suggestedText').notNull(),
    description: text('description'),
    isResolved: boolean('isResolved').notNull().default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  }),
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  'Stream',
  {
    id: uuid('id').notNull().defaultRandom(),
    chatId: uuid('chatId').notNull(),
    createdAt: timestamp('createdAt').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  }),
);

export type Stream = InferSelectModel<typeof stream>;

export const marketAnalysis = pgTable('MarketAnalysis', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  market: varchar('market', { enum: ['crypto', 'stocks', 'forex', 'metals', 'commodities'] }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  timeframe: varchar('timeframe', { enum: ['1h', '4h', '1d', '1w'] }).notNull(),
  currentPrice: decimal('currentPrice', { precision: 20, scale: 8 }).notNull(),
  
  // Technical Analysis
  technicalTrend: varchar('technicalTrend', { enum: ['bullish', 'bearish', 'neutral'] }).notNull(),
  supportLevel: decimal('supportLevel', { precision: 20, scale: 8 }).notNull(),
  resistanceLevel: decimal('resistanceLevel', { precision: 20, scale: 8 }).notNull(),
  rsi: decimal('rsi', { precision: 5, scale: 2 }).notNull(),
  macdSignal: varchar('macdSignal', { enum: ['buy', 'sell', 'neutral'] }).notNull(),
  
  // Signal
  signalAction: varchar('signalAction', { 
    enum: ['strong_buy', 'buy', 'hold', 'sell', 'strong_sell'] 
  }).notNull(),
  signalConfidence: integer('signalConfidence').notNull(),
  entryPrice: decimal('entryPrice', { precision: 20, scale: 8 }).notNull(),
  stopLoss: decimal('stopLoss', { precision: 20, scale: 8 }).notNull(),
  targetPrice: decimal('targetPrice', { precision: 20, scale: 8 }).notNull(),
  reasoning: text('reasoning').notNull(),
  
  // Market Sentiment
  marketSentiment: varchar('marketSentiment', { enum: ['positive', 'negative', 'neutral'] }).notNull(),
  fearGreedIndex: integer('fearGreedIndex').notNull(),
  
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type MarketAnalysis = InferSelectModel<typeof marketAnalysis>;

export const marketWatchlist = pgTable('MarketWatchlist', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  market: varchar('market', { enum: ['crypto', 'stocks', 'forex', 'metals', 'commodities'] }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  alertPrice: decimal('alertPrice', { precision: 20, scale: 8 }),
  alertType: varchar('alertType', { enum: ['above', 'below'] }),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type MarketWatchlist = InferSelectModel<typeof marketWatchlist>;

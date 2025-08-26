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
  serial,
} from 'drizzle-orm/pg-core';

// User Management with Access Levels
export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 128 }).notNull().unique(),
  password: varchar('password', { length: 128 }),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { enum: ['admin', 'manager', 'user', 'viewer'] })
    .notNull()
    .default('user'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

// Product/Item Categories
export const category = pgTable('Category', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  nameEn: varchar('nameEn', { length: 100 }),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type Category = InferSelectModel<typeof category>;

// Products/Items (کالا)
export const product = pgTable('Product', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  serialNumber: varchar('serialNumber', { length: 100 }),
  technicalNumber: varchar('technicalNumber', { length: 100 }),
  categoryId: uuid('categoryId').references(() => category.id),
  description: text('description'),
  unit: varchar('unit', { length: 20 }).default('عدد'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy').references(() => user.id),
});

export type Product = InferSelectModel<typeof product>;

// Suppliers (تامین‌کنندگان)
export const supplier = pgTable('Supplier', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  companyName: varchar('companyName', { length: 200 }),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  mobile: varchar('mobile', { length: 20 }),
  email: varchar('email', { length: 100 }),
  website: varchar('website', { length: 200 }),
  taxId: varchar('taxId', { length: 50 }),
  registrationNumber: varchar('registrationNumber', { length: 50 }),
  notes: text('notes'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy').references(() => user.id),
});

export type Supplier = InferSelectModel<typeof supplier>;

// Supplier Contacts (اشخاص مرتبط با تامین‌کننده)
export const supplierContact = pgTable('SupplierContact', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  mobile: varchar('mobile', { length: 20 }),
  email: varchar('email', { length: 100 }),
  notes: text('notes'),
  isPrimary: boolean('isPrimary').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type SupplierContact = InferSelectModel<typeof supplierContact>;

// Supplier Products (قطعات تأمینی توسط تامین‌کننده)
export const supplierProduct = pgTable('SupplierProduct', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id, { onDelete: 'cascade' }),
  productId: uuid('productId')
    .notNull()
    .references(() => product.id, { onDelete: 'cascade' }),
  lastPrice: decimal('lastPrice', { precision: 15, scale: 2 }),
  lastOrderDate: timestamp('lastOrderDate'),
  leadTime: integer('leadTime'), // days
  minOrderQty: integer('minOrderQty'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export type SupplierProduct = InferSelectModel<typeof supplierProduct>;

// Purchase Orders (سفارشات خرید)
export const purchaseOrder = pgTable('PurchaseOrder', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  orderNumber: varchar('orderNumber', { length: 50 }).notNull().unique(),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id),
  orderType: varchar('orderType', { 
    enum: ['warranty', 'service', 'commercial'] 
  }).notNull().default('commercial'),
  status: varchar('status', { 
    enum: ['draft', 'submitted', 'confirmed', 'partially_received', 'completed', 'cancelled'] 
  }).notNull().default('draft'),
  orderDate: timestamp('orderDate').notNull().defaultNow(),
  expectedDeliveryDate: timestamp('expectedDeliveryDate'),
  totalAmount: decimal('totalAmount', { precision: 15, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy')
    .notNull()
    .references(() => user.id),
});

export type PurchaseOrder = InferSelectModel<typeof purchaseOrder>;

// Purchase Order Items (آیتم‌های سفارش خرید)
export const purchaseOrderItem = pgTable('PurchaseOrderItem', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  orderId: uuid('orderId')
    .notNull()
    .references(() => purchaseOrder.id, { onDelete: 'cascade' }),
  productId: uuid('productId')
    .notNull()
    .references(() => product.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unitPrice', { precision: 15, scale: 2 }),
  totalPrice: decimal('totalPrice', { precision: 15, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type PurchaseOrderItem = InferSelectModel<typeof purchaseOrderItem>;

// Proforma Invoices (پیش‌فاکتورها)
export const proformaInvoice = pgTable('ProformaInvoice', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  invoiceNumber: varchar('invoiceNumber', { length: 50 }).notNull(),
  orderId: uuid('orderId')
    .notNull()
    .references(() => purchaseOrder.id),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id),
  invoiceDate: timestamp('invoiceDate').notNull(),
  status: varchar('status', { 
    enum: ['pending', 'approved', 'rejected', 'expired'] 
  }).notNull().default('pending'),
  subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
  taxAmount: decimal('taxAmount', { precision: 15, scale: 2 }).notNull().default('0'),
  totalAmount: decimal('totalAmount', { precision: 15, scale: 2 }).notNull(),
  validUntil: timestamp('validUntil'),
  filePath: varchar('filePath', { length: 500 }),
  notes: text('notes'),
  approvedAt: timestamp('approvedAt'),
  approvedBy: uuid('approvedBy').references(() => user.id),
  approvalNotes: text('approvalNotes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy')
    .notNull()
    .references(() => user.id),
});

export type ProformaInvoice = InferSelectModel<typeof proformaInvoice>;

// Proforma Invoice Items
export const proformaInvoiceItem = pgTable('ProformaInvoiceItem', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  proformaId: uuid('proformaId')
    .notNull()
    .references(() => proformaInvoice.id, { onDelete: 'cascade' }),
  productId: uuid('productId')
    .notNull()
    .references(() => product.id),
  orderItemId: uuid('orderItemId')
    .references(() => purchaseOrderItem.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unitPrice', { precision: 15, scale: 2 }).notNull(),
  totalPrice: decimal('totalPrice', { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type ProformaInvoiceItem = InferSelectModel<typeof proformaInvoiceItem>;

// Purchase Invoices (فاکتورهای خرید)
export const purchaseInvoice = pgTable('PurchaseInvoice', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  invoiceNumber: varchar('invoiceNumber', { length: 50 }).notNull(),
  proformaId: uuid('proformaId')
    .references(() => proformaInvoice.id),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id),
  invoiceDate: timestamp('invoiceDate').notNull(),
  documentNumber: varchar('documentNumber', { length: 50 }),
  treasuryNumber: varchar('treasuryNumber', { length: 50 }),
  commissionApprovalNumber: varchar('commissionApprovalNumber', { length: 50 }),
  commissionApprovalDate: timestamp('commissionApprovalDate'),
  subtotal: decimal('subtotal', { precision: 15, scale: 2 }).notNull(),
  taxAmount: decimal('taxAmount', { precision: 15, scale: 2 }).notNull().default('0'),
  totalAmount: decimal('totalAmount', { precision: 15, scale: 2 }).notNull(),
  filePath: varchar('filePath', { length: 500 }),
  status: varchar('status', { 
    enum: ['draft', 'confirmed', 'partially_paid', 'paid', 'cancelled'] 
  }).notNull().default('draft'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy')
    .notNull()
    .references(() => user.id),
});

export type PurchaseInvoice = InferSelectModel<typeof purchaseInvoice>;

// Purchase Invoice Items
export const purchaseInvoiceItem = pgTable('PurchaseInvoiceItem', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  invoiceId: uuid('invoiceId')
    .notNull()
    .references(() => purchaseInvoice.id, { onDelete: 'cascade' }),
  productId: uuid('productId')
    .notNull()
    .references(() => product.id),
  proformaItemId: uuid('proformaItemId')
    .references(() => proformaInvoiceItem.id),
  quantity: integer('quantity').notNull(),
  suppliedQuantity: integer('suppliedQuantity').notNull().default(0),
  remainingQuantity: integer('remainingQuantity').notNull().default(0),
  unitPrice: decimal('unitPrice', { precision: 15, scale: 2 }).notNull(),
  totalPrice: decimal('totalPrice', { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type PurchaseInvoiceItem = InferSelectModel<typeof purchaseInvoiceItem>;

// Follow-ups (پیگیری‌ها)
export const followUp = pgTable('FollowUp', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id),
  orderId: uuid('orderId')
    .references(() => purchaseOrder.id),
  proformaId: uuid('proformaId')
    .references(() => proformaInvoice.id),
  productId: uuid('productId')
    .references(() => product.id),
  followUpDate: timestamp('followUpDate').notNull().defaultNow(),
  description: text('description').notNull(),
  expectedDeliveryDate: timestamp('expectedDeliveryDate'),
  result: text('result'),
  status: varchar('status', { 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'] 
  }).notNull().default('pending'),
  nextFollowUpDate: timestamp('nextFollowUpDate'),
  reminderSet: boolean('reminderSet').notNull().default(false),
  priority: varchar('priority', { 
    enum: ['low', 'medium', 'high', 'urgent'] 
  }).notNull().default('medium'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy')
    .notNull()
    .references(() => user.id),
});

export type FollowUp = InferSelectModel<typeof followUp>;

// Warehouse Receipts (رسید انبار)
export const warehouseReceipt = pgTable('WarehouseReceipt', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  receiptNumber: varchar('receiptNumber', { length: 50 }).notNull().unique(),
  purchaseRequestNumber: varchar('purchaseRequestNumber', { length: 50 }),
  invoiceId: uuid('invoiceId')
    .references(() => purchaseInvoice.id),
  receiptDate: timestamp('receiptDate').notNull().defaultNow(),
  status: varchar('status', { 
    enum: ['received', 'partial', 'pending', 'cancelled'] 
  }).notNull().default('received'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  createdBy: uuid('createdBy')
    .notNull()
    .references(() => user.id),
});

export type WarehouseReceipt = InferSelectModel<typeof warehouseReceipt>;

// Financial Payments (پرداخت‌های مالی)
export const payment = pgTable('Payment', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  invoiceId: uuid('invoiceId')
    .notNull()
    .references(() => purchaseInvoice.id),
  supplierId: uuid('supplierId')
    .notNull()
    .references(() => supplier.id),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  paymentDate: timestamp('paymentDate'),
  documentSubmittedDate: timestamp('documentSubmittedDate'),
  paymentDocumentNumber: varchar('paymentDocumentNumber', { length: 50 }),
  treasuryNumber: varchar('treasuryNumber', { length: 50 }),
  status: varchar('status', { 
    enum: ['pending', 'in_progress', 'paid', 'rejected', 'cancelled'] 
  }).notNull().default('pending'),
  notes: text('notes'),
  followUpNotes: text('followUpNotes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: uuid('createdBy')
    .notNull()
    .references(() => user.id),
});

export type Payment = InferSelectModel<typeof payment>;

// System Settings
export const setting = pgTable('Setting', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull().default('general'),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  updatedBy: uuid('updatedBy')
    .references(() => user.id),
});

export type Setting = InferSelectModel<typeof setting>;

// Activity Logs for Audit Trail
export const activityLog = pgTable('ActivityLog', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entityType', { length: 50 }).notNull(),
  entityId: varchar('entityId', { length: 100 }).notNull(),
  details: json('details'),
  ipAddress: varchar('ipAddress', { length: 45 }),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type ActivityLog = InferSelectModel<typeof activityLog>;

// Notifications
export const notification = pgTable('Notification', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { 
    enum: ['info', 'warning', 'error', 'success'] 
  }).notNull().default('info'),
  relatedEntityType: varchar('relatedEntityType', { length: 50 }),
  relatedEntityId: varchar('relatedEntityId', { length: 100 }),
  isRead: boolean('isRead').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type Notification = InferSelectModel<typeof notification>;

// Keep the existing Chat functionality for AI Assistant
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

import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer,
  bigint,
  jsonb, 
  pgEnum,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ==========================================
// 1. ENUMS
// ==========================================
export const roleEnum = pgEnum('role', ['superadmin', 'admin', 'designer', 'tenant']);
export const genericStatusEnum = pgEnum('generic_status', ['active', 'suspended']); 
export const templateStatusEnum = pgEnum('template_status', ['draft', 'pending_approval', 'published', 'rejected']);
export const storeStatusEnum = pgEnum('store_status', ['pending_payment', 'active', 'inactive', 'suspended']);
export const transactionTypeEnum = pgEnum('transaction_type', ['activation_fee', 'template_purchase']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'cancelled']);
export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'completed', 'failed']);
export const walletMutationTypeEnum = pgEnum('wallet_mutation_type', ['commission_added', 'payout_requested', 'payout_completed']);

// ==========================================
// 2. CORE AUTH TABLES (BETTER-AUTH COMPATIBLE)
// ==========================================

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),

  role: roleEnum('role').default('tenant').notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  };
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
  };
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('accounts_user_id_idx').on(table.userId),
  };
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 3. ADMIN & SECURITY
// ==========================================

export const adminWhitelist = pgTable('admin_whitelist', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  addedBy: text('added_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subdomainBlacklist = pgTable('subdomain_blacklist', {
  id: text('id').primaryKey(),
  keyword: text('keyword').notNull().unique(),
  reason: text('reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 4. PAYMENTS (ACTIVATION & TRANSACTIONS)
// ==========================================

export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  
  transactionId: text('transaction_id').notNull().unique(), // Xendit ID
  status: paymentStatusEnum('status').default('pending').notNull(),
  provider: text('provider').default('xendit').notNull(),
  
  metadata: jsonb('metadata').default({}).notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('payments_user_id_idx').on(table.userId),
    transactionIdIdx: index('payments_transaction_id_idx').on(table.transactionId),
    statusIdx: index('payments_status_idx').on(table.status),
  };
});

// ==========================================
// 5. DESIGNER PROFILES & FINANCE
// ==========================================

export const designers = pgTable('designers', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  portfolioUrl: text('portfolio_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().unique().references(() => designers.userId, { onDelete: 'cascade' }),
  balance: bigint('balance', { mode: 'number' }).default(0).notNull(), 
  pendingBalance: bigint('pending_balance', { mode: 'number' }).default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const walletMutations = pgTable('wallet_mutations', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull().references(() => wallets.id, { onDelete: 'cascade' }),
  type: walletMutationTypeEnum('type').notNull(), 
  amount: bigint('amount', { mode: 'number' }).notNull(), 
  description: text('description').notNull(), 
  referenceId: text('reference_id'), 
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    walletIdIdx: index('wallet_mutations_wallet_id_idx').on(table.walletId),
  };
});

export const bankAccounts = pgTable('bank_accounts', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().references(() => designers.userId, { onDelete: 'cascade' }),
  bankName: text('bank_name').notNull(), 
  accountNumber: text('account_number').notNull(),
  accountHolder: text('account_holder').notNull(), 
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    designerIdIdx: index('bank_accounts_designer_id_idx').on(table.designerId),
  };
});

// ==========================================
// 6. TEMPLATES & COMMISSIONS
// ==========================================

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  price: bigint('price', { mode: 'number' }).default(0).notNull(), 
  config: jsonb('config').notNull().default({ version: 1, sections: [] }),
  
  status: templateStatusEnum('status').default('draft').notNull(),
  rejectionReason: text('rejection_reason'),
  
  designerId: text('designer_id').references(() => designers.userId, { onDelete: 'set null' }),
  approvedBy: text('approved_by').references(() => users.id, { onDelete: 'set null' }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
}, (table) => {
  return {
    designerIdIdx: index('templates_designer_id_idx').on(table.designerId),
    statusIdx: index('templates_status_idx').on(table.status),
  };
});

export const userTemplates = pgTable('user_templates', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => templates.id, { onDelete: 'cascade' }),
  purchasedAt: timestamp('purchased_at', { withTimezone: true }),
}, (table) => {
  return {
    userTemplateUniqueIdx: uniqueIndex('user_template_unique_idx').on(table.userId, table.templateId),
  };
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: transactionTypeEnum('type').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),

  templateId: text('template_id').references(() => templates.id, { onDelete: 'restrict' }),
  
  transactionId: text('transaction_id').notNull().unique(), // Xendit ID
  provider: text('provider').default('xendit').notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('transactions_user_id_idx').on(table.userId),
    statusIdx: index('transactions_status_idx').on(table.status),
    transactionIdIdx: index('transactions_transaction_id_idx').on(table.transactionId),
  };
});

export const commissions = pgTable('commissions', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().references(() => designers.userId, { onDelete: 'cascade' }),
  transactionId: text('transaction_id').notNull().unique().references(() => transactions.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => templates.id, { onDelete: 'restrict' }),
  
  amount: bigint('amount', { mode: 'number' }).notNull(),
  percentage: integer('percentage').default(30).notNull(),
  status: payoutStatusEnum('status').default('pending').notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    designerIdIdx: index('commissions_designer_id_idx').on(table.designerId),
  };
});

export const payoutRequests = pgTable('payout_requests', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().references(() => designers.userId, { onDelete: 'cascade' }),
  bankAccountId: text('bank_account_id').notNull().references(() => bankAccounts.id, { onDelete: 'restrict' }),
  
  amount: bigint('amount', { mode: 'number' }).notNull(), 
  status: payoutStatusEnum('status').default('pending').notNull(),
  
  payoutId: text('payout_id').unique(),
  failureReason: text('failure_reason'),
  processedBy: text('processed_by').references(() => users.id, { onDelete: 'set null' }),
  
  requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    designerIdIdx: index('payout_requests_designer_id_idx').on(table.designerId),
    statusIdx: index('payout_requests_status_idx').on(table.status),
  };
});

// ==========================================
// 7. STORES (TENANT STOREFRONTS)
// ==========================================

export const stores = pgTable('stores', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull().unique(), 
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  templateId: text('template_id').notNull().references(() => templates.id, { onDelete: 'restrict' }),
  
  whatsappNumber: text('whatsapp_number').notNull(), 
  
  status: storeStatusEnum('status').default('active').notNull(),
  
  config: jsonb('config').notNull().default({ version: 1, sections: [] }),
  
  totalWaClicks: integer('total_wa_clicks').default(0).notNull(),
  totalViews: integer('total_views').default(0).notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    subdomainIdx: uniqueIndex('stores_subdomain_unique_idx')
      .on(table.subdomain)
      .where(sql`${table.deletedAt} IS NULL`),
    userIdIdx: uniqueIndex('stores_user_id_unique_idx')
      .on(table.userId)
      .where(sql`${table.deletedAt} IS NULL`),
  };
});

export const productCategories = pgTable('product_categories', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  
  name: text('name').notNull(),
  description: text('description'),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    storeIdIdx: index('product_categories_store_id_idx').on(table.storeId),
  };
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  categoryId: text('category_id').references(() => productCategories.id, { onDelete: 'set null' }),
  
  name: text('name').notNull(),
  description: text('description'),
  price: bigint('price', { mode: 'number' }).notNull(), 
  
  imageIds: jsonb('image_ids').default([]).notNull(),
  
  status: genericStatusEnum('status').default('active').notNull(),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    storeIdIdx: index('products_store_id_idx').on(table.storeId),
    categoryIdIdx: index('products_category_id_idx').on(table.categoryId),
  };
});

// ==========================================
// 8. MEDIA (IMAGES)
// ==========================================

export const images = pgTable('images', {
  id: text('id').primaryKey(),
  provider: text('provider').default('cloudinary').notNull(),
  providerKey: text('provider_key').notNull().unique(),
  version: integer('version').default(1).notNull(),
  
  dimensions: jsonb('dimensions').default({}).notNull(),
  altText: text('alt_text'),
  sizeBytes: integer('size_bytes'),
  
  uploadedBy: text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    providerKeyIdx: index('images_provider_key_idx').on(table.providerKey),
    deletedAtIdx: index('images_deleted_at_idx').on(table.deletedAt),
  };
});

// ==========================================
// 9. DRIZZLE RELATIONS (OBJECT MAPPING)
// ==========================================

export const usersRelations = relations(users, ({ one, many }) => ({
  designerProfile: one(designers, { fields: [users.id], references: [designers.userId] }),
  store: one(stores, { fields: [users.id], references: [stores.userId] }),
  payments: many(payments),
  transactions: many(transactions),
  ownedTemplates: many(userTemplates),
}));

export const designersRelations = relations(designers, ({ one, many }) => ({
  user: one(users, { fields: [designers.userId], references: [users.id] }),
  wallet: one(wallets, { fields: [designers.userId], references: [wallets.designerId] }),
  bankAccounts: many(bankAccounts),
  createdTemplates: many(templates, { relationName: 'designerTemplates' }),
  commissions: many(commissions),
  payoutRequests: many(payoutRequests),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  designer: one(designers, { fields: [templates.designerId], references: [designers.userId], relationName: 'designerTemplates' }),
  approver: one(users, { fields: [templates.approvedBy], references: [users.id] }),
  owners: many(userTemplates),
  stores: many(stores),
  commissions: many(commissions),
  transactions: many(transactions),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  designer: one(designers, { fields: [wallets.designerId], references: [designers.userId] }),
  mutations: many(walletMutations),
}));

export const walletMutationsRelations = relations(walletMutations, ({ one }) => ({
  wallet: one(wallets, { fields: [walletMutations.walletId], references: [wallets.id] }),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  designer: one(designers, { fields: [bankAccounts.designerId], references: [designers.userId] }),
  payoutRequests: many(payoutRequests),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  designer: one(designers, { fields: [commissions.designerId], references: [designers.userId] }),
  transaction: one(transactions, { fields: [commissions.transactionId], references: [transactions.id] }),
  template: one(templates, { fields: [commissions.templateId], references: [templates.id] }),
}));

export const payoutRequestsRelations = relations(payoutRequests, ({ one }) => ({
  designer: one(designers, { fields: [payoutRequests.designerId], references: [designers.userId] }),
  bankAccount: one(bankAccounts, { fields: [payoutRequests.bankAccountId], references: [bankAccounts.id] }),
  processor: one(users, { fields: [payoutRequests.processedBy], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  template: one(templates, { fields: [transactions.templateId], references: [templates.id] }),
  commission: one(commissions, { fields: [transactions.id], references: [commissions.transactionId] }),
}));

export const userTemplatesRelations = relations(userTemplates, ({ one }) => ({
  user: one(users, { fields: [userTemplates.userId], references: [users.id] }),
  template: one(templates, { fields: [userTemplates.templateId], references: [templates.id] }),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, { fields: [stores.userId], references: [users.id] }),
  template: one(templates, { fields: [stores.templateId], references: [templates.id] }),
  products: many(products),
}));

export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  store: one(stores, { fields: [productCategories.storeId], references: [stores.id] }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  uploader: one(users, { fields: [images.uploadedBy], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

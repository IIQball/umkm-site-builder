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
export const templateStatusEnum = pgEnum('template_status', ['draft', 'pending', 'approved', 'rejected']);
export const storeStatusEnum = pgEnum('store_status', ['pending', 'active', 'inactive', 'suspended']);
export const transactionTypeEnum = pgEnum('transaction_type', ['store_registration', 'template_purchase']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'success', 'failed', 'expired', 'canceled', 'refunded']);
export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'completed', 'rejected']);
export const walletMutationTypeEnum = pgEnum('wallet_mutation_type', ['CREDIT', 'DEBIT']);

// ==========================================
// 2. CORE AUTH TABLES (BETTER-AUTH COMPATIBLE)
// ==========================================

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),

  role: roleEnum('role').default('tenant').notNull(),
  status: genericStatusEnum('status').default('active').notNull(),
  suspendReason: text('suspend_reason'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), 
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ==========================================
// 3. ADMIN & SECURITY
// ==========================================

export const adminWhitelist = pgTable('admin_whitelist', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: roleEnum('role').default('admin').notNull(),
  addedBy: text('added_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 4. DESIGNER PROFILES & FINANCE
// ==========================================

export const designers = pgTable('designers', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  portfolioUrl: text('portfolio_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().unique().references(() => designers.userId, { onDelete: 'cascade' }),
  balance: bigint('balance', { mode: 'number' }).default(0).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const walletMutations = pgTable('wallet_mutations', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull().references(() => wallets.id, { onDelete: 'cascade' }),
  type: walletMutationTypeEnum('type').notNull(), 
  amount: bigint('amount', { mode: 'number' }).notNull(), 
  balanceAfter: bigint('balance_after', { mode: 'number' }).notNull(), 
  description: text('description').notNull(), 
  referenceId: text('reference_id'), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bankAccounts = pgTable('bank_accounts', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().unique().references(() => designers.userId, { onDelete: 'cascade' }),
  bankName: text('bank_name').notNull(), 
  accountNumber: text('account_number').notNull(),
  accountHolder: text('account_holder').notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// 5. TEMPLATES & TRANSACTIONS
// ==========================================

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  price: bigint('price', { mode: 'number' }).default(0).notNull(), 
  config: jsonb('config').notNull(),
  
  status: templateStatusEnum('status').default('pending').notNull(),
  rejectionReason: text('rejection_reason'),
  deleteReason: text('delete_reason'),
  
  designerId: text('designer_id').notNull().references(() => designers.userId),
  approvedBy: text('approved_by').references(() => users.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: transactionTypeEnum('type').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),

  storeId: text('store_id').references(() => stores.id, { onDelete: 'restrict' }), 
  templateId: text('template_id').references(() => templates.id, { onDelete: 'restrict' }),
  
  externalId: text('external_id').notNull().unique(),
  paymentGatewayRef: text('payment_gateway_ref').unique(),
  paymentChannel: text('payment_channel'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    transactionUserIdx: index('transactions_user_id_idx').on(table.userId),
    transactionStatusIdx: index('transactions_status_idx').on(table.status),
    transactionExternalIdx: index('transactions_external_id_idx').on(table.externalId),
  };
});

export const commissions = pgTable('commissions', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().references(() => designers.userId),
  transactionId: text('transaction_id').notNull().unique().references(() => transactions.id), 
  templateId: text('template_id').notNull().references(() => templates.id),
  
  totalAmount: bigint('total_amount', { mode: 'number' }).notNull(), 
  platformFee: bigint('platform_fee', { mode: 'number' }).notNull(), 
  designerAmount: bigint('designer_amount', { mode: 'number' }).notNull(), 
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const payoutRequests = pgTable('payout_requests', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().references(() => designers.userId),
  bankAccountId: text('bank_account_id').notNull().references(() => bankAccounts.id),
  
  amount: bigint('amount', { mode: 'number' }).notNull(), 
  status: payoutStatusEnum('status').default('pending').notNull(),
  
  xenditPayoutId: text('xendit_payout_id').unique(),
  gatewayReference: text('gateway_reference'), 
  gatewayMessage: text('gateway_message'), 
  processedBy: text('processed_by').references(() => users.id),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userTemplates = pgTable('user_templates', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  templateId: text('template_id').notNull().references(() => templates.id),
  acquiredAt: timestamp('acquired_at').defaultNow().notNull(),
}, (table) => {
  return {
    userTemplateUniqueIdx: uniqueIndex('user_template_unique_idx').on(table.userId, table.templateId),
  };
});

// ==========================================
// 6. TOKO / STORES (Berfungsi sebagai Tenant Profile)
// ==========================================

export const stores = pgTable('stores', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull(), 
  userId: text('user_id').notNull().references(() => users.id),
  templateId: text('template_id').notNull().references(() => templates.id),
  
  waNumber: text('wa_number').notNull(), 
  googleMapsUrl: text('google_maps_url'),
  isRegistrationPaid: boolean('is_registration_paid').default(false).notNull(), 
  
  status: storeStatusEnum('status').default('active').notNull(),
  suspendReason: text('suspend_reason'),
  deleteReason: text('delete_reason'),
  
  customization: jsonb('customization').default({}).notNull(),
  totalWaClicks: integer('total_wa_clicks').default(0).notNull(),
  totalViews: integer('total_views').default(0).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => {
  return {
    subdomainIdx: index('stores_subdomain_idx').on(table.subdomain),
    storeUserUniqueIdx: uniqueIndex('stores_user_id_unique_idx')
      .on(table.userId)
      .where(sql`${table.deletedAt} IS NULL`),
    storeSubdomainUniqueIdx: uniqueIndex('stores_subdomain_unique_idx')
      .on(table.subdomain)
      .where(sql`${table.deletedAt} IS NULL`),
  };
});

export const storeCategories = pgTable('store_categories', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => {
  return { 
    storeCategoryIdx: index('store_categories_store_id_idx').on(table.storeId),
    storeSlugUniqueIdx: uniqueIndex('store_slug_unique_idx').on(table.storeId, table.slug)
  };
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id),
  categoryId: text('category_id').notNull().references(() => storeCategories.id),
  
  name: text('name').notNull(),
  slug: text('slug').notNull(), 
  basePrice: bigint('base_price', { mode: 'number' }).notNull(), 
  
  variants: jsonb('variants').default([]).notNull(),
  description: text('description'),
  imageUrls: jsonb('image_urls').default([]).notNull(),
  
  isAvailable: boolean('is_available').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => {
  return {
    storeProductIdx: index('products_store_id_idx').on(table.storeId),
    categoryProductIdx: index('products_category_id_idx').on(table.categoryId),
    productSlugUniqueIdx: uniqueIndex('product_slug_unique_idx').on(table.storeId, table.slug),
  }
});

// ==========================================
// 7. TABEL ACTIVITY LOGS & SETTINGS
// ==========================================

export const activityLogs = pgTable('activity_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  storeId: text('store_id').references(() => stores.id),
  action: text('action').notNull(),
  details: jsonb('details').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const platformSettings = pgTable('platform_settings', {
  id: text('id').primaryKey(),
  platformFeePercentage: integer('platform_fee_percentage').default(30).notNull(), 
  payoutMinimumBalance: bigint('payout_minimum_balance', { mode: 'number' }).default(50000).notNull(), 
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: text('updated_by').references(() => users.id),
});

// ==========================================
// 8. DRIZZLE RELATIONS (Object Mapping)
// ==========================================

export const usersRelations = relations(users, ({ one, many }) => ({
  designerProfile: one(designers),
  store: one(stores), 
  transactions: many(transactions),
  ownedTemplates: many(userTemplates),
  activities: many(activityLogs),
  updatedSettings: many(platformSettings),
}));

export const designersRelations = relations(designers, ({ one, many }) => ({
  user: one(users, { fields: [designers.userId], references: [users.id] }),
  wallet: one(wallets),
  bankAccount: one(bankAccounts),
  createdTemplates: many(templates, { relationName: 'createdTemplates' }),
  commissions: many(commissions),
  payoutRequests: many(payoutRequests),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  designer: one(designers, { fields: [templates.designerId], references: [designers.userId], relationName: 'createdTemplates' }),
  approver: one(users, { fields: [templates.approvedBy], references: [users.id] }),
  stores: many(stores),
  owners: many(userTemplates),
  commissions: many(commissions),
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
  payouts: many(payoutRequests), 
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
  commission: one(commissions), 
  store: one(stores, { fields: [transactions.storeId], references: [stores.id] }),
  template: one(templates, { fields: [transactions.templateId], references: [templates.id] }),
}));

export const userTemplatesRelations = relations(userTemplates, ({ one }) => ({
  user: one(users, { fields: [userTemplates.userId], references: [users.id] }),
  template: one(templates, { fields: [userTemplates.templateId], references: [templates.id] }),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, { fields: [stores.userId], references: [users.id] }),
  template: one(templates, { fields: [stores.templateId], references: [templates.id] }),
  categories: many(storeCategories),
  products: many(products),
  activities: many(activityLogs),
}));

export const storeCategoriesRelations = relations(storeCategories, ({ one, many }) => ({
  store: one(stores, { fields: [storeCategories.storeId], references: [stores.id] }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(storeCategories, { fields: [products.categoryId], references: [storeCategories.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
  store: one(stores, { fields: [activityLogs.storeId], references: [stores.id] }),
}));

export const platformSettingsRelations = relations(platformSettings, ({ one }) => ({
  updater: one(users, { fields: [platformSettings.updatedBy], references: [users.id] }),
}));
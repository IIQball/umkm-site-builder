import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  bigint,
  doublePrecision,
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
export const transactionTypeEnum = pgEnum('transaction_type', ['template_purchase']);
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
  emailVerified: boolean('email_verified').default(true).notNull(),
  image: text('image'),

  role: roleEnum('role').default('tenant').notNull(),
  status: genericStatusEnum('status').default('active').notNull(),
  suspendReason: text('suspend_reason'),
 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const tenantInvitations = pgTable('tenant_invitations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  otpCode: text('otp_code'),
  invitedBy: text('invited_by').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  invitationEmailIdx: index('tenant_invitations_email_idx').on(table.email),
  invitationTokenIdx: uniqueIndex('tenant_invitations_token_idx').on(table.token),
}));

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
  issuer: text('issuer'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  // `expires_at` is mapped to better-auth's `accessTokenExpiresAt` in src/lib/auth.ts.
  expiresAt: timestamp('expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  idToken: text('id_token'),
  scope: text('scope'),
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
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  balance: bigint('balance', { mode: 'number' }).default(0).notNull(),
  availableBalance: bigint('available_balance', { mode: 'number' }).default(0).notNull(),
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
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bankCode: text('bank_code').notNull(),
  bankName: text('bank_name').notNull(),
  accountNumber: text('account_number').notNull(),
  accountHolder: text('account_holder').notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userBankIdx: index('bank_accounts_user_id_idx').on(table.userId),
  userAccountUniqueIdx: uniqueIndex('bank_accounts_user_account_unique_idx')
    .on(table.userId, table.bankCode, table.accountNumber),
  userPrimaryAccountIdx: uniqueIndex('bank_accounts_user_primary_idx')
    .on(table.userId)
    .where(sql`${table.isPrimary} = true`),
}));

// ==========================================
// 5. TEMPLATES & TRANSACTIONS
// ==========================================

export const templateCategories = pgTable('template_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    templateCategorySlugIdx: uniqueIndex('template_categories_slug_idx').on(table.slug),
  };
});

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  thumbnailUrl: text('thumbnail_url'),
  price: bigint('price', { mode: 'number' }).default(0).notNull(),
  config: jsonb('config').notNull(),
 
  status: templateStatusEnum('status').default('pending').notNull(),
  rejectionReason: text('rejection_reason'),
  deleteReason: text('delete_reason'),
 
  categoryId: text('category_id').references(() => templateCategories.id, { onDelete: 'set null' }),
  designerId: text('designer_id').notNull().references(() => designers.userId),
  approvedBy: text('approved_by').references(() => users.id),
 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
}, (table) => {
  return {
    templateCategoryIdx: index('templates_category_id_idx').on(table.categoryId),
    templateSlugIdx: uniqueIndex('templates_slug_idx').on(table.slug),
  };
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: transactionTypeEnum('type').notNull(),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  adminFee: bigint('admin_fee', { mode: 'number' }).default(0).notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),

  storeId: text('store_id').references(() => stores.id, { onDelete: 'restrict' }),
  templateId: text('template_id').references(() => templates.id, { onDelete: 'restrict' }),
  assistedBy: text('assisted_by').references(() => users.id),
 
  externalId: text('external_id').notNull().unique(),
  paymentGatewayRef: text('payment_gateway_ref').unique(),
  paymentChannel: text('payment_channel'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    transactionUserIdx: index('transactions_user_id_idx').on(table.userId),
    transactionStatusIdx: index('transactions_status_idx').on(table.status),
    transactionExternalIdx: index('transactions_external_id_idx').on(table.externalId),
    transactionAssistedByIdx: index('transactions_assisted_by_idx').on(table.assistedBy),
  };
});

export const commissions = pgTable('commissions', {
  id: text('id').primaryKey(),
  designerId: text('designer_id').notNull().references(() => designers.userId),
  adminId: text('admin_id').references(() => users.id),
  transactionId: text('transaction_id').notNull().unique().references(() => transactions.id),
  templateId: text('template_id').notNull().references(() => templates.id),
 
  totalAmount: bigint('total_amount', { mode: 'number' }).notNull(),
  platformFee: bigint('platform_fee', { mode: 'number' }).notNull(),
  designerAmount: bigint('designer_amount', { mode: 'number' }).notNull(),
  adminAmount: bigint('admin_amount', { mode: 'number' }).default(0).notNull(),
 
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  commissionAdminIdx: index('commissions_admin_id_idx').on(table.adminId),
}));

export const payoutRequests = pgTable('payout_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  bankAccountId: text('bank_account_id').notNull().references(() => bankAccounts.id),
 
  amount: bigint('amount', { mode: 'number' }).notNull(),
  status: payoutStatusEnum('status').default('pending').notNull(),
 
  xenditPayoutId: text('xendit_payout_id').unique(),
  gatewayReference: text('gateway_reference'),
  gatewayMessage: text('gateway_message'),
  processedBy: text('processed_by').references(() => users.id),
 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  payoutUserIdx: index('payout_requests_user_id_idx').on(table.userId),
}));

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

// kategori toko
export const businessCategories = pgTable('business_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon'),
  createdBy: text('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  businessCategorySlugIdx: uniqueIndex('business_categories_slug_idx').on(table.slug),
}));

export const stores = pgTable('stores', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  subdomain: text('subdomain').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  templateId: text('template_id').notNull().references(() => templates.id),
  categoryId: text('category_id').references(() => businessCategories.id, { onDelete: 'set null' }),

  waNumber: text('wa_number').notNull(),
  address: text('address'),
  googleMapsUrl: text('google_maps_url').notNull(),
  googleMapsEmbedUrl: text('google_maps_embed_url'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),

  registeredBy: text('registered_by').references(() => users.id),
  lastEditedBy: text('last_edited_by').references(() => users.id),

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
    storeNameIdx: index('stores_name_idx').on(table.name),
    storeCategoryMasterIdx: index('stores_category_id_idx').on(table.categoryId),
    storeRegisteredByIdx: index('stores_registered_by_idx').on(table.registeredBy),
    storeCoordinatesIdx: index('stores_coordinates_idx').on(table.latitude, table.longitude),
    storeUserUniqueIdx: uniqueIndex('stores_user_id_unique_idx')
      .on(table.userId)
      .where(sql`${table.deletedAt} IS NULL`),
    storeSubdomainUniqueIdx: uniqueIndex('stores_subdomain_unique_idx')
      .on(table.subdomain)
      .where(sql`${table.deletedAt} IS NULL`),
  };
});

// kategori jasa/produk per toko
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
    productNameIdx: index('products_name_idx').on(table.name),
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
  adminServiceFee: bigint('admin_service_fee', { mode: 'number' }).default(5000).notNull(),
  payoutMinimumBalance: bigint('payout_minimum_balance', { mode: 'number' }).default(50000).notNull(),
  settlementDelayDays: integer('settlement_delay_days').default(7).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: text('updated_by').references(() => users.id),
});

// ==========================================
// 8. DRIZZLE RELATIONS (Object Mapping)
// ==========================================

export const usersRelations = relations(users, ({ one, many }) => ({
  designerProfile: one(designers),
  store: one(stores, { 
    fields: [users.id], 
    references: [stores.userId], 
    relationName: 'storeOwner' 
  }),
  wallet: one(wallets),
  bankAccounts: many(bankAccounts),
  payoutRequests: many(payoutRequests, { relationName: 'userPayoutRequests' }),
  processedPayouts: many(payoutRequests, { relationName: 'processedPayoutRequests' }),
  registeredStores: many(stores, { relationName: 'registeredStores' }),
  editedStores: many(stores, { relationName: 'editedStores' }),
  sentInvitations: many(tenantInvitations),
  assistedTransactions: many(transactions, { relationName: 'assistedTransactions' }),
  transactions: many(transactions, { relationName: 'userTransactions' }),
  adminCommissions: many(commissions),
  ownedTemplates: many(userTemplates),
  activities: many(activityLogs),
  updatedSettings: many(platformSettings),
}));

export const tenantInvitationsRelations = relations(tenantInvitations, ({ one }) => ({
  sender: one(users, { fields: [tenantInvitations.invitedBy], references: [users.id] }),
}));

export const designersRelations = relations(designers, ({ one, many }) => ({
  user: one(users, { fields: [designers.userId], references: [users.id] }),
  createdTemplates: many(templates, { relationName: 'createdTemplates' }),
  commissions: many(commissions),
}));

export const templateCategoriesRelations = relations(templateCategories, ({ many }) => ({
  templates: many(templates),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  category: one(templateCategories, { fields: [templates.categoryId], references: [templateCategories.id] }),
  designer: one(designers, { fields: [templates.designerId], references: [designers.userId], relationName: 'createdTemplates' }),
  approver: one(users, { fields: [templates.approvedBy], references: [users.id] }),
  stores: many(stores),
  owners: many(userTemplates),
  commissions: many(commissions),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.id] }),
  mutations: many(walletMutations),
}));

export const walletMutationsRelations = relations(walletMutations, ({ one }) => ({
  wallet: one(wallets, { fields: [walletMutations.walletId], references: [wallets.id] }),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  user: one(users, { fields: [bankAccounts.userId], references: [users.id] }),
  payouts: many(payoutRequests),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  designer: one(designers, { fields: [commissions.designerId], references: [designers.userId] }),
  admin: one(users, { fields: [commissions.adminId], references: [users.id] }),
  transaction: one(transactions, { fields: [commissions.transactionId], references: [transactions.id] }),
  template: one(templates, { fields: [commissions.templateId], references: [templates.id] }),
}));

export const payoutRequestsRelations = relations(payoutRequests, ({ one }) => ({
  user: one(users, { fields: [payoutRequests.userId], references: [users.id], relationName: 'userPayoutRequests' }),
  bankAccount: one(bankAccounts, { fields: [payoutRequests.bankAccountId], references: [bankAccounts.id] }),
  processor: one(users, { fields: [payoutRequests.processedBy], references: [users.id], relationName: 'processedPayoutRequests' }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id], relationName: 'userTransactions' }),
  assistant: one(users, { fields: [transactions.assistedBy], references: [users.id], relationName: 'assistedTransactions' }),
  commission: one(commissions),
  store: one(stores, { fields: [transactions.storeId], references: [stores.id] }),
  template: one(templates, { fields: [transactions.templateId], references: [templates.id] }),
}));

export const userTemplatesRelations = relations(userTemplates, ({ one }) => ({
  user: one(users, { fields: [userTemplates.userId], references: [users.id] }),
  template: one(templates, { fields: [userTemplates.templateId], references: [templates.id] }),
}));

export const businessCategoriesRelations = relations(businessCategories, ({ one, many }) => ({
  creator: one(users, { fields: [businessCategories.createdBy], references: [users.id] }),
  stores: many(stores),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, { fields: [stores.userId], references: [users.id], relationName: 'storeOwner' }),
  registrar: one(users, { fields: [stores.registeredBy], references: [users.id], relationName: 'registeredStores' }),
  lastEditor: one(users, { fields: [stores.lastEditedBy], references: [users.id], relationName: 'editedStores' }),
  template: one(templates, { fields: [stores.templateId], references: [templates.id] }),
  category: one(businessCategories, { fields: [stores.categoryId], references: [businessCategories.id] }),
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
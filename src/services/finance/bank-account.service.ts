import { db } from '@/lib/db/client';
import { bankAccounts, designers, wallets } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AppError } from '@/lib/utils';
import type { BankAccount } from '@/types';

export const MAX_BANK_ACCOUNTS_PER_USER = 3;

export interface AddBankAccountInput {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

/**
 * Ensure user has required profile records (wallet/designer) if interacting with finances
 */
export async function ensureUserFinanceProfile(userId: string): Promise<void> {
  const existingDesigner = await db
    .select()
    .from(designers)
    .where(eq(designers.userId, userId))
    .limit(1);

  if (existingDesigner.length === 0) {
    await db.insert(designers).values({
      userId,
      isVerified: true,
    }).onConflictDoNothing();

    await db.insert(wallets).values({
      id: `wal_${crypto.randomUUID()}`,
      userId,
      balance: 0,
      availableBalance: 0,
    }).onConflictDoNothing();
  }
}

/**
 * Get all bank accounts registered for a user (up to 3)
 */
export async function getUserBankAccounts(userId: string): Promise<BankAccount[]> {
  const records = await db
    .select()
    .from(bankAccounts)
    .where(eq(bankAccounts.userId, userId))
    .orderBy(desc(bankAccounts.isPrimary), desc(bankAccounts.createdAt));

  return records.map((r) => ({
    id: r.id,
    bankCode: r.bankCode,
    bankName: r.bankName,
    accountNumber: r.accountNumber,
    accountHolder: r.accountHolder,
    holderName: r.accountHolder,
    accountHolderName: r.accountHolder,
    isPrimary: r.isPrimary,
    isVerified: r.isVerified,
    createdAt: r.createdAt,
  }));
}

/**
 * Add a new bank account for a user (max 3 accounts allowed)
 */
export async function addUserBankAccount(
  userId: string,
  input: AddBankAccountInput
): Promise<BankAccount> {
  await ensureUserFinanceProfile(userId);

  const existingAccounts = await db
    .select()
    .from(bankAccounts)
    .where(eq(bankAccounts.userId, userId));

  if (existingAccounts.length >= MAX_BANK_ACCOUNTS_PER_USER) {
    throw new AppError(
      `Maksimal ${MAX_BANK_ACCOUNTS_PER_USER} rekening bank yang dapat didaftarkan`,
      400,
      undefined,
      'MAX_LIMIT_REACHED'
    );
  }

  const cleanNum = input.accountNumber.trim();
  const cleanCode = (input.bankCode || input.bankName).trim().toUpperCase();

  const isDuplicate = existingAccounts.some(
    (a) =>
      a.bankCode.trim().toUpperCase() === cleanCode &&
      a.accountNumber.trim() === cleanNum
  );

  if (isDuplicate) {
    throw new AppError(
      'Nomor rekening ini sudah terdaftar di akun Anda',
      400,
      undefined,
      'DUPLICATE_ACCOUNT'
    );
  }

  const isFirstAccount = existingAccounts.length === 0;
  const newId = `ba_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const [newRecord] = await db
    .insert(bankAccounts)
    .values({
      id: newId,
      userId,
      bankCode: cleanCode,
      bankName: input.bankName.trim(),
      accountNumber: cleanNum,
      accountHolder: input.accountHolder.trim(),
      isPrimary: isFirstAccount,
      isVerified: true,
    })
    .returning();

  return {
    id: newRecord.id,
    bankCode: newRecord.bankCode,
    bankName: newRecord.bankName,
    accountNumber: newRecord.accountNumber,
    accountHolder: newRecord.accountHolder,
    holderName: newRecord.accountHolder,
    accountHolderName: newRecord.accountHolder,
    isPrimary: newRecord.isPrimary,
    isVerified: newRecord.isVerified,
    createdAt: newRecord.createdAt,
  };
}

/**
 * Delete a user's bank account and promote another account to primary if needed
 */
export async function deleteUserBankAccount(
  userId: string,
  accountId: string
): Promise<void> {
  const existing = await db
    .select()
    .from(bankAccounts)
    .where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, userId)))
    .limit(1);

  if (existing.length === 0) {
    throw new AppError('Rekening bank tidak ditemukan', 404, undefined, 'NOT_FOUND');
  }

  const wasPrimary = existing[0].isPrimary;

  await db
    .delete(bankAccounts)
    .where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, userId)));

  // If deleted account was primary, set the first remaining account to primary
  if (wasPrimary) {
    const remaining = await db
      .select()
      .from(bankAccounts)
      .where(eq(bankAccounts.userId, userId))
      .orderBy(desc(bankAccounts.createdAt))
      .limit(1);

    if (remaining.length > 0) {
      await db
        .update(bankAccounts)
        .set({ isPrimary: true, updatedAt: new Date() })
        .where(eq(bankAccounts.id, remaining[0].id));
    }
  }
}

/**
 * Set a specific bank account as primary for a user
 */
export async function setPrimaryBankAccount(
  userId: string,
  accountId: string
): Promise<BankAccount> {
  const existing = await db
    .select()
    .from(bankAccounts)
    .where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, userId)))
    .limit(1);

  if (existing.length === 0) {
    throw new AppError('Rekening bank tidak ditemukan', 404, undefined, 'NOT_FOUND');
  }

  // Reset all accounts to non-primary
  await db
    .update(bankAccounts)
    .set({ isPrimary: false, updatedAt: new Date() })
    .where(eq(bankAccounts.userId, userId));

  // Set target account as primary
  const [updated] = await db
    .update(bankAccounts)
    .set({ isPrimary: true, updatedAt: new Date() })
    .where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, userId)))
    .returning();

  return {
    id: updated.id,
    bankCode: updated.bankCode,
    bankName: updated.bankName,
    accountNumber: updated.accountNumber,
    accountHolder: updated.accountHolder,
    holderName: updated.accountHolder,
    accountHolderName: updated.accountHolder,
    isPrimary: updated.isPrimary,
    isVerified: updated.isVerified,
    createdAt: updated.createdAt,
  };
}

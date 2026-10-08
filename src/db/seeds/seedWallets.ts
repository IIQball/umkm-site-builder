/* eslint-disable no-console */
import { db } from "@/lib/db/client";
import { payoutRequests, walletMutations } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_ID = "JqtM1b62JYl46KUKNPp3eB5P635224Gm";
const ADMIN_WALLET_ID = "wal_ac1d1e7c-5f3a-433f-8647-0d5c669dc515";
const ADMIN_BANK_ID = "ba_1791008994672_miopn";

const DESIGNER_ID = "LvTEyKxIZkAs1qxl2lGVYE2ODzb0ZDHV";
const DESIGNER_WALLET_ID = "wal_dc838dc1-c1cb-443a-9437-495045408196";
const DESIGNER_BANK_ID = "ba_1791009066388_fq899";

const PAYOUT_STATUSES: Array<"completed" | "processing" | "pending" | "rejected"> = [
  "completed", "completed", "completed", "processing", "pending", "rejected",
];

export async function seedWallets() {
  const baseDate = new Date("2026-09-22T08:00:00Z");

  // 1. Payout Requests untuk Admin (20 data)
  for (let i = 0; i < 20; i++) {
    const pId = `po-adm-${String(i + 1).padStart(2, "0")}`;
    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 16);
    const status = PAYOUT_STATUSES[i % PAYOUT_STATUSES.length];
    const amount = 50000 + (i * 25000);

    const existing = await db.query.payoutRequests.findFirst({
      where: eq(payoutRequests.id, pId),
    });

    if (!existing) {
      await db.insert(payoutRequests).values({
        id: pId,
        userId: ADMIN_ID,
        bankAccountId: ADMIN_BANK_ID,
        amount,
        status,
        xenditPayoutId: `disb_adm_${String(i + 1).padStart(3, "0")}`,
        gatewayReference: `REF-ADM-PO-${String(i + 1).padStart(3, "0")}`,
        gatewayMessage: status === "rejected" ? "Nama pemilik rekening tidak sesuai" : "Pencairan fee pendampingan",
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  // 2. Payout Requests untuk Desainer (20 data)
  for (let i = 0; i < 20; i++) {
    const pId = `po-dsg-${String(i + 1).padStart(2, "0")}`;
    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 15);
    const status = PAYOUT_STATUSES[i % PAYOUT_STATUSES.length];
    const amount = 75000 + (i * 30000);

    const existing = await db.query.payoutRequests.findFirst({
      where: eq(payoutRequests.id, pId),
    });

    if (!existing) {
      await db.insert(payoutRequests).values({
        id: pId,
        userId: DESIGNER_ID,
        bankAccountId: DESIGNER_BANK_ID,
        amount,
        status,
        xenditPayoutId: `disb_dsg_${String(i + 1).padStart(3, "0")}`,
        gatewayReference: `REF-DSG-PO-${String(i + 1).padStart(3, "0")}`,
        gatewayMessage: status === "rejected" ? "Nomor rekening tidak aktif" : "Pencairan komisi template",
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  // 3. Wallet Mutations untuk Admin (20 data)
  let adminRunningBalance = 100000;
  for (let i = 0; i < 20; i++) {
    const mutId = `mut-adm-${String(i + 1).padStart(2, "0")}`;
    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 14);
    const isCredit = i % 3 !== 0;
    const type: "CREDIT" | "DEBIT" = isCredit ? "CREDIT" : "DEBIT";
    const amount = isCredit ? 25000 + (i * 5000) : 50000;
    adminRunningBalance = isCredit ? adminRunningBalance + amount : Math.max(0, adminRunningBalance - amount);

    const existing = await db.query.walletMutations.findFirst({
      where: eq(walletMutations.id, mutId),
    });

    if (!existing) {
      await db.insert(walletMutations).values({
        id: mutId,
        walletId: ADMIN_WALLET_ID,
        type,
        amount,
        balanceAfter: adminRunningBalance,
        description: isCredit ? `Fee pendampingan transaksi UMKM #${i + 1}` : `Penarikan dana ke rekening #${i + 1}`,
        referenceId: isCredit ? `TX-ADM-${i + 1}` : `disb_adm_${String(i + 1).padStart(3, "0")}`,
        createdAt,
      });
    }
  }

  // 4. Wallet Mutations untuk Desainer (20 data)
  let designerRunningBalance = 200000;
  for (let i = 0; i < 20; i++) {
    const mutId = `mut-dsg-${String(i + 1).padStart(2, "0")}`;
    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 13);
    const isCredit = i % 3 !== 0;
    const type: "CREDIT" | "DEBIT" = isCredit ? "CREDIT" : "DEBIT";
    const amount = isCredit ? 90000 + (i * 10000) : 100000;
    designerRunningBalance = isCredit ? designerRunningBalance + amount : Math.max(0, designerRunningBalance - amount);

    const existing = await db.query.walletMutations.findFirst({
      where: eq(walletMutations.id, mutId),
    });

    if (!existing) {
      await db.insert(walletMutations).values({
        id: mutId,
        walletId: DESIGNER_WALLET_ID,
        type,
        amount,
        balanceAfter: designerRunningBalance,
        description: isCredit ? `Komisi penjualan template #${i + 1}` : `Penarikan dana komisi ke rekening #${i + 1}`,
        referenceId: isCredit ? `TX-DSG-${i + 1}` : `disb_dsg_${String(i + 1).padStart(3, "0")}`,
        createdAt,
      });
    }
  }
}

/* eslint-disable no-console */
import { db } from "@/lib/db/client";
import { transactions, commissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SEED_TEMPLATES_DATA } from "./seedTemplates";

const ADMIN_ID = "JqtM1b62JYl46KUKNPp3eB5P635224Gm";
const DESIGNER_ID = "LvTEyKxIZkAs1qxl2lGVYE2ODzb0ZDHV";
const TENANT_ID = "ghvrXGgsRRuRgXjQxCouSvY05HCOe2xY";

const PAYMENT_CHANNELS = ["QRIS", "BCA_VA", "BNI_VA", "MANDIRI_VA", "BRI_VA"];

export async function seedTransactions() {
  const baseDate = new Date("2026-09-24T10:00:00Z");

  for (let i = 0; i < 20; i++) {
    const tpl = SEED_TEMPLATES_DATA[i];
    const txId = `tx-seed-${String(i + 1).padStart(2, "0")}`;
    const commId = `comm-seed-${String(i + 1).padStart(2, "0")}`;
    const createdAt = new Date(baseDate.getTime() + i * 3600000 * 14);

    const baseAmount = tpl.price || 150000;
    const adminFee = 5000;
    const totalAmount = baseAmount + adminFee;

    let status: "success" | "pending" | "failed" = "success";
    if (i === 18) status = "pending";
    if (i === 19) status = "failed";

    const existingTx = await db.query.transactions.findFirst({
      where: eq(transactions.id, txId),
    });

    if (!existingTx) {
      await db.insert(transactions).values({
        id: txId,
        userId: TENANT_ID,
        type: "template_purchase",
        amount: totalAmount,
        adminFee,
        status,
        templateId: tpl.id,
        assistedBy: ADMIN_ID,
        externalId: `INV-2026-09-${String(i + 101).padStart(4, "0")}`,
        paymentGatewayRef: `PAY-GW-REF-${String(i + 1001)}`,
        paymentChannel: PAYMENT_CHANNELS[i % PAYMENT_CHANNELS.length],
        createdAt,
      });
    }

    if (status === "success") {
      const existingComm = await db.query.commissions.findFirst({
        where: eq(commissions.transactionId, txId),
      });

      if (!existingComm) {
        const platformFee = Math.round(baseAmount * 0.2);
        const adminAmount = Math.round(baseAmount * 0.1);
        const designerAmount = baseAmount - platformFee - adminAmount;

        await db.insert(commissions).values({
          id: commId,
          designerId: DESIGNER_ID,
          adminId: ADMIN_ID,
          transactionId: txId,
          templateId: tpl.id,
          totalAmount: baseAmount,
          platformFee,
          designerAmount,
          adminAmount,
          createdAt,
        });
      }
    }
  }
}

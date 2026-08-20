import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { templates, userTemplates, transactions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthenticatedUser } from '@/lib/auth';
import { xenditClient } from '@/lib/finance/xendit';

const PurchaseSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
});

interface ResponseData {
  ok: boolean;
  isFree?: boolean;
  message?: string;
  data?: {
    invoiceUrl: string;
    invoiceId: string;
    externalId: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Harap masuk terlebih dahulu' } } as ResponseData),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (user.status !== 'active') {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'FORBIDDEN', message: 'Akun Anda ditangguhkan' } } as ResponseData),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json().catch(() => ({}));
    const { templateId } = PurchaseSchema.parse(body);

    const template = await db.query.templates.findFirst({
      where: and(eq(templates.id, templateId), eq(templates.status, 'approved')),
    });

    if (!template) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'NOT_FOUND', message: 'Template tidak ditemukan atau belum disetujui' } } as ResponseData),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check ownership
    const existingOwnership = await db.query.userTemplates.findFirst({
      where: and(eq(userTemplates.userId, user.id), eq(userTemplates.templateId, templateId)),
    });

    if (existingOwnership) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'TEMPLATE_ALREADY_OWNED', message: 'Anda sudah memiliki template ini' } } as ResponseData),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Free template case
    if (template.price === 0) {
      const userTemplateId = `utpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await db.insert(userTemplates).values({
        id: userTemplateId,
        userId: user.id,
        templateId: template.id,
        acquiredAt: new Date(),
      });

      return new Response(
        JSON.stringify({ ok: true, isFree: true, message: 'Template gratis berhasil ditambahkan ke akun Anda' } as ResponseData),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Paid template case
    const invoiceNum = `INV-${user.id}-${Date.now()}`;
    const protocol = context.request.url.startsWith('https') ? 'https' : 'http';
    const host = context.request.headers.get('host') || 'localhost:4321';
    const baseUrl = `${protocol}://${host}`;

    const xenditInvoice = await xenditClient.createInvoice({
      invoiceNum,
      amount: template.price / 100, // DB stores cents, convert to IDR
      payerEmail: user.email,
      description: `Pembelian Template: ${template.name}`,
      expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      successRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=success`,
      failureRedirectUrl: `${baseUrl}/checkout/${invoiceNum}?status=failed`,
      metadata: {
        userId: user.id,
        type: 'template_purchase',
        templateId: template.id,
      },
    });

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    await db.insert(transactions).values({
      id: transactionId,
      userId: user.id,
      type: 'template_purchase',
      amount: template.price, // cents
      status: 'pending',
      templateId: template.id,
      externalId: invoiceNum,
      paymentGatewayRef: xenditInvoice.id,
      paymentChannel: null,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        ok: true,
        data: {
          invoiceUrl: xenditInvoice.invoiceUrl || '',
          invoiceId: xenditInvoice.id,
          externalId: invoiceNum,
        },
      } as ResponseData),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ ok: false, error: { code: 'VALIDATION_ERROR', message: error.errors[0].message || 'Invalid input' } } as ResponseData),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: false,
        error: { code: 'INTERNAL', message: error instanceof Error ? error.message : 'Gagal memproses pembelian template' },
      } as ResponseData),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

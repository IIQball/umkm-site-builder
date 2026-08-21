import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { templates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TemplateConfigSchema } from '@/schemas';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';

interface ApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  data?: T;
  redirectUrl?: string;
  error?: {
    code: string;
    message: string;
  };
}

const SubmitReviewSchema = z.object({
  templateId: z.string().min(1, 'templateId is required'),
});

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Akses desainer diperlukan untuk mengajukan review',
          },
        } as ApiResponse),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json().catch(() => ({}));
    const { templateId } = SubmitReviewSchema.parse(body);

    const template = await db.query.templates.findFirst({
      where: (templates) => eq(templates.id, templateId),
    });

    if (!template) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Template tidak ditemukan',
          },
        } as ApiResponse),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Otorisasi kepemilikan designer (admin dan superadmin dapat bypass)
    const isOwner = template.designerId === user.id;
    const isPrivileged = user.role === 'admin' || user.role === 'superadmin';
    if (!isOwner && !isPrivileged) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Anda tidak memiliki hak akses untuk mengajukan template ini',
          },
        } as ApiResponse),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validasi konfigurasi template
    const configValidation = TemplateConfigSchema.safeParse(template.config);
    if (!configValidation.success) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'INVALID_CONFIG',
            message: 'Struktur konfigurasi template tidak lengkap atau tidak valid',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update status menjadi 'pending'
    const updated = await db
      .update(templates)
      .set({
        status: 'pending',
        updatedAt: new Date(),
      })
      .where(eq(templates.id, templateId))
      .returning();

    return new Response(
      JSON.stringify({
        ok: true,
        data: updated[0],
        status: 'pending',
        redirectUrl: `/builder/preview/${templateId}`,
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Input tidak valid',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // eslint-disable-next-line no-console
    console.error("Submit review 500 error:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal mengirim ulasan template',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

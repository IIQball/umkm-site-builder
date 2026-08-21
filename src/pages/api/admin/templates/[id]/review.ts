import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { templates } from '@/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { reviewTemplateSchema } from '@/schemas';
import { getAuthenticatedUser, isAuthorizedAdmin } from '@/lib/auth';

interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  ok?: boolean;
  message?: string;
  template?: T;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const handleReview = async (context: Parameters<APIRoute>[0]): Promise<Response> => {
  try {
    const user = await getAuthenticatedUser(context.request);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: { code: 'UNAUTHORIZED', message: 'Autentikasi diperlukan' },
        } as ApiResponse),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isAuthorizedAdmin(user)) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: { code: 'FORBIDDEN', message: 'Akses khusus admin diperlukan' },
        } as ApiResponse),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const templateId = context.params.id;
    if (!templateId) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: { code: 'VALIDATION_ERROR', message: 'ID Template wajib diisi' },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json().catch(() => ({}));
    const validatedInput = reviewTemplateSchema.parse(body);

    const existingTemplate = await db.query.templates.findFirst({
      where: (t) => and(eq(t.id, templateId), isNull(t.deletedAt)),
    });

    if (!existingTemplate) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: { code: 'NOT_FOUND', message: 'Template tidak ditemukan' },
        } as ApiResponse),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (existingTemplate.status !== 'pending') {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Hanya template dengan status pending yang dapat ditinjau',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatePayload =
      validatedInput.action === 'approve'
        ? {
            status: 'approved' as const,
            approvedBy: user.id,
            rejectionReason: null,
            updatedAt: new Date(),
          }
        : {
            status: 'rejected' as const,
            rejectionReason: validatedInput.rejectionReason,
            updatedAt: new Date(),
          };

    const [updatedData] = await db
      .update(templates)
      .set(updatePayload)
      .where(eq(templates.id, templateId))
      .returning();

    return new Response(
      JSON.stringify({
        success: true,
        ok: true,
        message: 'Status template berhasil diperbarui',
        template: updatedData,
        data: updatedData,
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0]?.message || 'Input tidak valid',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal meninjau template',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = handleReview;
export const PUT: APIRoute = handleReview;

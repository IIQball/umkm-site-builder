import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { templates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TemplateDraftUpdateSchema } from '@/schemas/template.schema';

interface ApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    const url = new URL(context.request.url);
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'templateId query parameter is required',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await context.request.json();
    const input = TemplateDraftUpdateSchema.parse(body);

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.thumbnailUrl !== undefined) updateData.thumbnailUrl = input.thumbnailUrl || null;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.config !== undefined) updateData.config = input.config;

    const updated = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, templateId))
      .returning();

    if (!updated.length) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Template not found',
          },
        } as ApiResponse),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        data: updated[0],
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
            message: error.errors[0]?.message || 'Invalid input configuration',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Failed to save template',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

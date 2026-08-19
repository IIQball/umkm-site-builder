import type { APIRoute } from 'astro';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { templates } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  TemplateDraftCreateSchema,
  TemplateDraftUpdateSchema,
  TemplateDraftSubmitSchema,
  DEFAULT_TEMPLATE_SECTIONS,
} from '@/schemas/template.schema';

interface ApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

const DEFAULT_DESIGNER_ID = 'designer_123';

export const GET: APIRoute = async (context): Promise<Response> => {
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

    const template = await db.query.templates.findFirst({
      where: (templates) => eq(templates.id, templateId),
    });

    if (!template) {
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
        data: template,
      } as ApiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
   } catch {
     return new Response(
       JSON.stringify({
         ok: false,
         error: {
           code: 'INTERNAL',
           message: 'Failed to fetch template',
         },
       } as ApiResponse),
       { status: 500, headers: { 'Content-Type': 'application/json' } }
     );
   }
};

export const POST: APIRoute = async (context): Promise<Response> => {
  try {
    const body = await context.request.json();
    const input = TemplateDraftCreateSchema.parse(body);

    const templateId = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newTemplate = await db
      .insert(templates)
      .values({
        id: templateId,
        name: input.name,
        description: input.description,
        thumbnailUrl: input.thumbnailUrl,
        price: Math.floor((input.price || 0) * 100),
        designerId: DEFAULT_DESIGNER_ID,
        status: 'draft',
        config: {
          theme: {
            primaryColor: '#3b82f6',
            fontFamily: 'sans-serif',
          },
          sections: DEFAULT_TEMPLATE_SECTIONS,
        },
      })
      .returning();

    return new Response(
      JSON.stringify({
        ok: true,
        data: newTemplate[0],
      } as ApiResponse),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
   } catch (error) {
     if (error instanceof z.ZodError) {
       return new Response(
         JSON.stringify({
           ok: false,
           error: {
             code: 'VALIDATION_ERROR',
             message: error.errors[0].message || 'Invalid input',
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
           message: 'Failed to create template',
         },
       } as ApiResponse),
       { status: 500, headers: { 'Content-Type': 'application/json' } }
     );
   }
};

export const PUT: APIRoute = async (context): Promise<Response> => {
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
    if (input.thumbnailUrl !== undefined) updateData.thumbnailUrl = input.thumbnailUrl;
    if (input.price !== undefined) updateData.price = Math.floor(input.price * 100);
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
            message: error.errors[0].message || 'Invalid input',
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
          message: 'Failed to update template',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PATCH: APIRoute = async (context): Promise<Response> => {
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
    const input = TemplateDraftSubmitSchema.parse(body);

    const submitted = await db
      .update(templates)
      .set({
        name: input.name,
        description: input.description,
        thumbnailUrl: input.thumbnailUrl,
        price: Math.floor(input.price * 100),
        config: input.config,
        status: 'pending',
        updatedAt: new Date(),
      })
      .where(and(eq(templates.id, templateId), eq(templates.status, 'draft')))
      .returning();

    if (!submitted.length) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            code: 'INVALID_STATE',
            message: 'Template must be in draft status to submit',
          },
        } as ApiResponse),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        data: submitted[0],
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
            message: error.errors[0].message || 'Invalid input',
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
          message: 'Failed to submit template',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

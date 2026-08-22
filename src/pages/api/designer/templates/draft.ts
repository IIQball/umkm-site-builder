import type { APIRoute } from 'astro';
import { getAuthenticatedUser, isAuthorizedDesigner } from '@/lib/auth';
import {
  TemplateDraftCreateSchema,
  TemplateDraftUpdateSchema,
  TemplateDraftSubmitSchema,
} from '@/schemas';
import { handleApiRoute, jsonSuccess, validate, AppError } from '@/lib/utils';
import {
  getTemplateById,
  createTemplateDraft,
  updateTemplateDraft,
  submitTemplateForReview,
  deleteTemplateDraft,
} from '@/services/templates';

export const GET: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const url = new URL(context.request.url);
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      throw new AppError('templateId query parameter is required', 400);
    }

    const template = await getTemplateById(templateId, user.id, user.role);

    return jsonSuccess(template, 'Template berhasil diambil');
  });
};

export const POST: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateDraftCreateSchema, body);

    const newTemplate = await createTemplateDraft(input, user.id);

    return jsonSuccess(newTemplate, 'Template draft created', 201);
  });
};

export const PUT: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const url = new URL(context.request.url);
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      throw new AppError('templateId query parameter is required', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateDraftUpdateSchema, body);

    const updated = await updateTemplateDraft(templateId, input, user.id, user.role);

    return jsonSuccess(updated, 'Template draft updated');
  });
};

export const PATCH: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const url = new URL(context.request.url);
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      throw new AppError('templateId query parameter is required', 400);
    }

    const body = await context.request.json().catch(() => ({}));
    const input = validate(TemplateDraftSubmitSchema, body);

    const submitted = await submitTemplateForReview(templateId, user.id, user.role, {
      name: input.name,
      description: input.description,
      thumbnailUrl: input.thumbnailUrl || '',
      price: input.price,
      config: input.config,
    });

    return jsonSuccess(submitted, 'Template submitted for review');
  });
};

export const DELETE: APIRoute = async (context): Promise<Response> => {
  return handleApiRoute(async () => {
    const user = await getAuthenticatedUser(context.request);
    if (!user || !isAuthorizedDesigner(user)) {
      throw new AppError('Designer access required', 401);
    }

    const url = new URL(context.request.url);
    const templateId = url.searchParams.get('templateId');

    if (!templateId) {
      throw new AppError('templateId is required', 400);
    }

    await deleteTemplateDraft(templateId, user.id, user.role);

    return jsonSuccess(null, 'Template draft deleted');
  });
};

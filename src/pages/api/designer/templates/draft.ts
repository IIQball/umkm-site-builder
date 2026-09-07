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
  deleteBatchTemplateDrafts,
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

    return jsonSuccess(template);
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

    return jsonSuccess(newTemplate, 201);
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

    return jsonSuccess(updated);
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

    return jsonSuccess(submitted);
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
    const body = await context.request.json().catch(() => ({}));

    // Handle batch deletion if templateIds array is provided
    if (Array.isArray(body?.templateIds) && body.templateIds.length > 0) {
      const result = await deleteBatchTemplateDrafts(body.templateIds, user.id, user.role);
      return jsonSuccess(result);
    }

    const targetId = templateId || body?.templateId;
    if (!targetId) {
      throw new AppError('templateId is required', 400);
    }

    await deleteTemplateDraft(targetId, user.id, user.role);

    return jsonSuccess(null);
  });
};

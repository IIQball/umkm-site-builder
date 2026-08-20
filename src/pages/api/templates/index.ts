import type { APIRoute } from 'astro';
import { getPublicTemplates, type PublicTemplateItem } from '@/services/template.service';

interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const GET: APIRoute = async (): Promise<Response> => {
  try {
    const list = await getPublicTemplates();

    return new Response(
      JSON.stringify({
        ok: true,
        data: list,
      } as ApiResponse<PublicTemplateItem[]>),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=10, s-maxage=30',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          code: 'INTERNAL',
          message: error instanceof Error ? error.message : 'Gagal memuat katalog template',
        },
      } as ApiResponse),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

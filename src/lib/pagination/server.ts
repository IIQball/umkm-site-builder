import { count, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { PaginatedResult, PaginationParams } from '@/types/common';

export const PAGE_SIZE = 10;

/**
 * Extracts and validates page parameter from a URL or string, returning 1-based page and offset.
 */
export function getPaginationParams(
  requestUrl: string | URL,
  paramName: string = 'page'
): PaginationParams {
  let page = 1;

  try {
    const url = typeof requestUrl === 'string' ? new URL(requestUrl, 'http://localhost') : requestUrl;
    const raw = url.searchParams.get(paramName);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        page = parsed;
      }
    }
  } catch {
    page = 1;
  }

  const offset = (page - 1) * PAGE_SIZE;
  return { page, offset, pageSize: PAGE_SIZE };
}

export type PaginateDb = {
  select: (fields?: Record<string, unknown>) => {
    from: (targetTable: PgTable) => {
      where: (clause: SQL) => Promise<unknown>;
    } & Promise<unknown>;
  };
};

export type PaginateQueryBuilder<T> =
  | { limit: (limit: number) => { offset: (offset: number) => Promise<T[]> } }
  | ((limit: number, offset: number) => Promise<T[]>);

/**
 * Generic pagination runner for Drizzle queries.
 * Fetches page records with limit/offset and total row count in parallel via Promise.all.
 */
export async function paginate<T>(
  db: PaginateDb,
  table: PgTable,
  queryBuilder: PaginateQueryBuilder<T>,
  whereClause?: SQL | undefined,
  page: number = 1,
  pageSize: number = PAGE_SIZE
): Promise<PaginatedResult<T>> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const safePageSize = Math.max(1, Math.floor(pageSize) || PAGE_SIZE);
  const offset = (safePage - 1) * safePageSize;

  const dataPromise = (
    typeof queryBuilder === 'function'
      ? queryBuilder(safePageSize, offset)
      : queryBuilder.limit(safePageSize).offset(offset)
  ) as Promise<T[]>;

  const countQuery = whereClause
    ? db.select({ total: count() }).from(table).where(whereClause)
    : db.select({ total: count() }).from(table);

  const [data, countResult] = await Promise.all([
    dataPromise,
    countQuery as Promise<Array<{ total: number | string }>>,
  ]);

  const totalItems = Number(countResult?.[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

  return {
    data: (data || []) as T[],
    totalItems,
    totalPages,
    currentPage: safePage,
    pageSize: safePageSize,
  };
}

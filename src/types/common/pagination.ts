/**
 * Standard Pagination Types
 */

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginationParams {
  page: number;
  offset: number;
  pageSize: number;
}

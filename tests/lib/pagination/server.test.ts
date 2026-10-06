import { describe, it, expect, vi } from 'vitest';
import { getPaginationParams, paginate, PAGE_SIZE, type PaginateDb } from '@/lib/pagination/server';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';

describe('Server Pagination Helper', () => {
  describe('PAGE_SIZE constant', () => {
    it('should be defined as 10', () => {
      expect(PAGE_SIZE).toBe(10);
    });
  });

  describe('getPaginationParams', () => {
    it('should extract valid positive integer page from URL string', () => {
      const res = getPaginationParams('http://localhost:4321/dashboard?page=3');
      expect(res.page).toBe(3);
      expect(res.offset).toBe(20);
      expect(res.pageSize).toBe(10);
    });

    it('should default to page 1 when parameter is missing', () => {
      const res = getPaginationParams('http://localhost:4321/dashboard');
      expect(res.page).toBe(1);
      expect(res.offset).toBe(0);
      expect(res.pageSize).toBe(10);
    });

    it('should default to page 1 for invalid non-numeric values', () => {
      const res = getPaginationParams('http://localhost:4321/dashboard?page=abc');
      expect(res.page).toBe(1);
      expect(res.offset).toBe(0);
    });

    it('should default to page 1 for zero or negative values', () => {
      expect(getPaginationParams('http://localhost:4321/dashboard?page=0').page).toBe(1);
      expect(getPaginationParams('http://localhost:4321/dashboard?page=-5').page).toBe(1);
    });

    it('should support URL object as input', () => {
      const url = new URL('http://localhost:4321/dashboard?page=2');
      const res = getPaginationParams(url);
      expect(res.page).toBe(2);
      expect(res.offset).toBe(10);
    });

    it('should extract custom paramName correctly', () => {
      const res = getPaginationParams('http://localhost:4321/dashboard?txPage=4', 'txPage');
      expect(res.page).toBe(4);
      expect(res.offset).toBe(30);
    });
  });

  describe('paginate', () => {
    it('should execute pagination with queryBuilder object and count query', async () => {
      const mockData = [{ id: '1' }, { id: '2' }];
      const mockOffset = vi.fn().mockResolvedValue(mockData);
      const mockLimit = vi.fn().mockReturnValue({ offset: mockOffset });
      const queryBuilder = { limit: mockLimit };

      const mockFrom = vi.fn().mockResolvedValue([{ total: 25 }]);
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      const mockDb = { select: mockSelect } as unknown as PaginateDb;

      const mockTable = {} as PgTable;

      const result = await paginate(mockDb, mockTable, queryBuilder, undefined, 2, 10);

      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(mockOffset).toHaveBeenCalledWith(10);
      expect(result.data).toEqual(mockData);
      expect(result.totalItems).toBe(25);
      expect(result.totalPages).toBe(3);
      expect(result.currentPage).toBe(2);
      expect(result.pageSize).toBe(10);
    });

    it('should support function queryBuilder', async () => {
      const mockData = [{ id: 'a' }];
      const queryBuilderFn = vi.fn().mockResolvedValue(mockData);

      const mockWhere = vi.fn().mockResolvedValue([{ total: 1 }]);
      const mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
      const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });
      const mockDb = { select: mockSelect } as unknown as PaginateDb;
      const mockTable = {} as PgTable;

      const result = await paginate(mockDb, mockTable, queryBuilderFn, {} as unknown as SQL, 1, 10);

      expect(queryBuilderFn).toHaveBeenCalledWith(10, 0);
      expect(result.data).toEqual(mockData);
      expect(result.totalItems).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it('should ensure totalPages is at least 1 when totalItems is 0', async () => {
      const queryBuilderFn = vi.fn().mockResolvedValue([]);
      const mockFrom = vi.fn().mockResolvedValue([{ total: 0 }]);
      const mockDb = { select: vi.fn().mockReturnValue({ from: mockFrom }) } as unknown as PaginateDb;

      const result = await paginate(mockDb, {} as PgTable, queryBuilderFn, undefined, 1, 10);

      expect(result.totalItems).toBe(0);
      expect(result.totalPages).toBe(1);
      expect(result.data).toEqual([]);
    });
  });
});

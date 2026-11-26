/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'bun:test' {
  export interface Mock<T extends (...args: any[]) => any = (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>;
    mockReturnValue(val: any): this;
    mockReturnValueOnce(val: any): this;
    mockResolvedValue(val: any): this;
    mockResolvedValueOnce(val: any): this;
    mockRejectedValue(val: any): this;
    mockRejectedValueOnce(val: any): this;
    mockImplementation(fn: (...args: any[]) => any): this;
    mockImplementationOnce(fn: (...args: any[]) => any): this;
    mockClear(): void;
    mockReset(): void;
    mockRestore(): void;
    mock: {
      calls: any[][];
      results: { type: string; value: any }[];
      instances: any[];
    };
  }

  export function describe(name: string, fn: () => void | Promise<void>): void;
  export namespace describe {
    export function skip(name: string, fn: () => void | Promise<void>): void;
    export function only(name: string, fn: () => void | Promise<void>): void;
  }

  export function it(name: string, fn: () => void | Promise<void>): void;
  export namespace it {
    export function skip(name: string, fn: () => void | Promise<void>): void;
    export function only(name: string, fn: () => void | Promise<void>): void;
  }

  export const test: typeof it;

  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;

  export function expect(actual: any): any;
  export namespace expect {
    export function objectContaining(expected: any): any;
    export function stringContaining(expected: string): any;
    export function arrayContaining(expected: any[]): any;
    export function any(constructor: any): any;
    export function anything(): any;
  }

  export function mock<T extends (...args: any[]) => any>(fn?: T): Mock<T>;
  export namespace mock {
    export function module(specifier: string, factory: () => any): void;
  }

  export function spyOn<T extends object, K extends keyof T>(obj: T, method: K): Mock<any>;
  export function setSystemTime(date?: Date | number): void;
}

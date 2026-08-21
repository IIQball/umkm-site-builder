import { describe, it, expect, beforeEach } from 'vitest';
import { toast, type Toast } from '@/lib/toast';
import { get } from 'svelte/store';

describe('Global Toast Store', () => {
  beforeEach(() => {
    toast.clear();
  });

  it('should add a success toast with correct structure', () => {
    const id = toast.success('Operation completed successfully', 'Success');
    const items: Toast[] = get(toast);

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(id);
    expect(items[0].type).toBe('success');
    expect(items[0].message).toBe('Operation completed successfully');
    expect(items[0].title).toBe('Success');
  });

  it('should add an error toast with correct structure', () => {
    const id = toast.error('Something went wrong', 'Error');
    const items: Toast[] = get(toast);

    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(id);
    expect(items[0].type).toBe('error');
    expect(items[0].message).toBe('Something went wrong');
    expect(items[0].title).toBe('Error');
  });

  it('should add warning and info toasts', () => {
    toast.warning('Check your input', 'Warning');
    toast.info('New update available', 'Info');

    const items: Toast[] = get(toast);
    expect(items).toHaveLength(2);
    expect(items[0].type).toBe('warning');
    expect(items[1].type).toBe('info');
  });

  it('should remove a toast by id', () => {
    const id1 = toast.success('Message 1');
    const id2 = toast.error('Message 2');

    expect(get(toast)).toHaveLength(2);

    toast.remove(id1);

    const remaining = get(toast);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(id2);
  });

  it('should clear all toasts', () => {
    toast.success('Msg 1');
    toast.error('Msg 2');
    toast.info('Msg 3');

    expect(get(toast)).toHaveLength(3);

    toast.clear();

    expect(get(toast)).toHaveLength(0);
  });
});

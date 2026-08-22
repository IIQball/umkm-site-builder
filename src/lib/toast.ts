import { writable } from 'svelte/store';
import type { ToastType, Toast } from '@/types';

const DEFAULT_DURATION = 5000;

const createToastStore = () => {
  const { subscribe, update, set } = writable<Toast[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const remove = (id: string) => {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    update((toasts) => toasts.filter((t) => t.id !== id));
  };

  const clear = () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    set([]);
  };

  const add = (
    type: ToastType,
    message: string,
    title?: string,
    duration: number = DEFAULT_DURATION
  ): string => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newToast: Toast = { id, type, message, title, duration };

    update((toasts) => [...toasts, newToast]);

    if (duration > 0 && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        remove(id);
      }, duration);
      timers.set(id, timer);
    }

    return id;
  };

  return {
    subscribe,
    remove,
    clear,
    success: (message: string, title?: string, duration?: number) => add('success', message, title, duration),
    error: (message: string, title?: string, duration?: number) => add('error', message, title, duration),
    warning: (message: string, title?: string, duration?: number) => add('warning', message, title, duration),
    info: (message: string, title?: string, duration?: number) => add('info', message, title, duration),
  };
};

export const toast = createToastStore();

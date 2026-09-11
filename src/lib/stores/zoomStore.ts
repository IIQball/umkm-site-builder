import { writable } from 'svelte/store';

const MIN_ZOOM = 0.25; // 25% maximum zoom-out limit
const MAX_ZOOM = 2.0;  // 200% maximum zoom-in limit
const DEFAULT_ZOOM = 1.0;
const ZOOM_STEP = 0.1; // 10% step

const getInitialZoom = (): number => {
  if (typeof window === 'undefined') return DEFAULT_ZOOM;
  try {
    const saved = localStorage.getItem('app_zoom_level');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= MIN_ZOOM && parsed <= MAX_ZOOM) {
        return Math.round(parsed * 100) / 100;
      }
    }
  } catch {
    // localStorage not accessible
  }
  return DEFAULT_ZOOM;
};

const applyZoomToDOM = (zoom: number) => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--app-zoom', String(zoom));
  
  // Also apply zoom directly to content containers if present
  const containers = document.querySelectorAll<HTMLElement>(
    '#dashboard-content-container, #base-content-container, .app-zoom-target'
  );
  containers.forEach((el) => {
    el.style.zoom = String(zoom);
  });
};

function createZoomStore() {
  const { subscribe, set, update } = writable<number>(getInitialZoom());

  return {
    subscribe,
    zoomIn: () => {
      update((current) => {
        const next = Math.min(MAX_ZOOM, Math.round((current + ZOOM_STEP) * 100) / 100);
        if (typeof window !== 'undefined') {
          localStorage.setItem('app_zoom_level', String(next));
        }
        applyZoomToDOM(next);
        return next;
      });
    },
    zoomOut: () => {
      update((current) => {
        const next = Math.max(MIN_ZOOM, Math.round((current - ZOOM_STEP) * 100) / 100);
        if (typeof window !== 'undefined') {
          localStorage.setItem('app_zoom_level', String(next));
        }
        applyZoomToDOM(next);
        return next;
      });
    },
    setZoom: (val: number) => {
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(val * 100) / 100));
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_zoom_level', String(clamped));
      }
      applyZoomToDOM(clamped);
      set(clamped);
    },
    resetZoom: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('app_zoom_level', String(DEFAULT_ZOOM));
      }
      applyZoomToDOM(DEFAULT_ZOOM);
      set(DEFAULT_ZOOM);
    },
    init: () => {
      if (typeof window === 'undefined') return;
      const initial = getInitialZoom();
      applyZoomToDOM(initial);
      set(initial);
    },
    min: MIN_ZOOM,
    max: MAX_ZOOM,
    step: ZOOM_STEP,
  };
}

export const zoomStore = createZoomStore();

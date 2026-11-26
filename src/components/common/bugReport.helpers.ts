export interface BugAttachmentMeta {
  name: string;
  size: number;
  mimeType: string;
}

export const MAX_BUG_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const OPEN_BUG_REPORT_EVENT = 'pinoka:open-bug-report';

type BugModalWindow = Window & { __pinokaPendingBugModal?: boolean };

export function captureBugEnvironment(): { routeUrl: string; userAgent: string } {
  if (typeof window === 'undefined') {
    return { routeUrl: '/', userAgent: 'unknown' };
  }
  const routeUrl = window.location.href.slice(0, 1000);
  const screenTag = `${window.innerWidth}x${window.innerHeight}`;
  const rawUa = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  return {
    routeUrl,
    userAgent: `${rawUa} [viewport:${screenTag}]`.slice(0, 600),
  };
}

export function extractBugAttachmentMeta(
  file: File | undefined
): { meta: BugAttachmentMeta | null; error: string | null } {
  if (!file) return { meta: null, error: null };
  if (file.size > MAX_BUG_ATTACHMENT_BYTES) {
    return { meta: null, error: 'Ukuran berkas lampiran maksimal 10 MB.' };
  }
  return {
    meta: {
      name: file.name.slice(0, 180),
      size: file.size,
      mimeType: (file.type || 'application/octet-stream').slice(0, 100),
    },
    error: null,
  };
}

export function formatBugAttachmentSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function openBugReportModal(): void {
  if (typeof window === 'undefined') return;
  (window as BugModalWindow).__pinokaPendingBugModal = true;
  window.dispatchEvent(new CustomEvent(OPEN_BUG_REPORT_EVENT));
}

export function subscribeBugReportModal(onOpen: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const win = window as BugModalWindow;
  if (win.__pinokaPendingBugModal) {
    win.__pinokaPendingBugModal = false;
    onOpen();
  }
  const handler = () => {
    win.__pinokaPendingBugModal = false;
    onOpen();
  };
  window.addEventListener(OPEN_BUG_REPORT_EVENT, handler);
  return () => window.removeEventListener(OPEN_BUG_REPORT_EVENT, handler);
}

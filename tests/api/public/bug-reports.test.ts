import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { POST, OPTIONS, resetBugReportRateLimiters } from '@/pages/api/public/bug-reports';
import * as authLib from '@/lib/auth';
import * as bugReportService from '@/services/bug-report.service';

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(),
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock('@/services/bug-report.service', () => ({
  createBugReport: vi.fn(),
  listBugReports: vi.fn(),
  getBugReportById: vi.fn(),
  updateBugReportStatus: vi.fn(),
}));

type PostContext = Parameters<typeof POST>[0];
type OptionsContext = Parameters<typeof OPTIONS>[0];

describe('Public Bug Report API (/api/public/bug-reports)', () => {
  const mockGetAuthUser = authLib.getAuthenticatedUser as unknown as Mock;
  const mockCreateBugReport = bugReportService.createBugReport as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    resetBugReportRateLimiters();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('OPTIONS CORS preflight', () => {
    it('reflects CORS headers for allowed Pinoka origin', async () => {
      const req = new Request('http://localhost:4321/api/public/bug-reports', {
        method: 'OPTIONS',
        headers: { Origin: 'https://pinoka.id' },
      });

      const res = await OPTIONS({ request: req } as unknown as OptionsContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://pinoka.id');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('omits Access-Control-Allow-Origin for disallowed external origin', async () => {
      const req = new Request('http://localhost:4321/api/public/bug-reports', {
        method: 'OPTIONS',
        headers: { Origin: 'https://evil-attacker.example' },
      });

      const res = await OPTIONS({ request: req } as unknown as OptionsContext);
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });
  });

  describe('POST validation, creation, and rate limiting', () => {
    it('returns 400 VALIDATION_ERROR when description is too short or attachment url is unsafe', async () => {
      mockGetAuthUser.mockResolvedValue(null);

      const req = new Request('http://localhost:4321/api/public/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '203.0.113.10',
        },
        body: JSON.stringify({
          sourceApp: 'landing_page',
          description: 'pendek',
          routeUrl: '/',
          attachmentMeta: {
            name: 'xss.png',
            url: 'javascript:alert(1)',
          },
        }),
      });

      const res = await POST({ request: req, clientAddress: '203.0.113.10' } as unknown as PostContext);
      expect(res.status).toBe(400);

      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.meta?.code).toBe('VALIDATION_ERROR');
      expect(mockCreateBugReport).not.toHaveBeenCalled();
    });

    it('returns 201 and stores public anonymous bug report with attachment metadata', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockCreateBugReport.mockResolvedValue({
        id: 'bug_123',
        sourceApp: 'landing_page',
        status: 'unresolved',
        createdAt: '2026-11-11T05:00:00.000Z',
      });

      const req = new Request('http://localhost:4321/api/public/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://pinoka.id',
          'User-Agent': 'Mozilla/5.0 TestBrowser',
          'x-forwarded-for': '203.0.113.11',
        },
        body: JSON.stringify({
          sourceApp: 'landing_page',
          title: 'Tombol CTA tidak merespons',
          description: 'Tombol daftar di halaman utama tidak terbuka saat diklik di mobile.',
          stepsToReproduce: '1. Buka beranda\n2. Klik Mulai Sekarang',
          routeUrl: 'https://pinoka.id/#cta',
          userAgent: 'Mozilla/5.0 Viewport 375x812',
          reporterEmail: 'pengunjung@umkm.id',
          attachmentMeta: {
            name: 'bug-mobile.png',
            size: 12450,
            mimeType: 'image/png',
          },
        }),
      });

      const res = await POST({ request: req, clientAddress: '203.0.113.11' } as unknown as PostContext);
      expect(res.status).toBe(201);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://pinoka.id');

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.id).toBe('bug_123');
      expect(body.data.status).toBe('unresolved');
      expect(mockCreateBugReport).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceApp: 'landing_page',
          attachmentMeta: expect.objectContaining({
            name: 'bug-mobile.png',
            size: 12450,
            mimeType: 'image/png',
          }),
        }),
        { userId: null, email: null, role: 'public' },
        'Mozilla/5.0 TestBrowser'
      );
    });

    it('attaches authenticated tenant context when reporter is logged in', async () => {
      mockGetAuthUser.mockResolvedValue({
        id: 'usr_tenant_1',
        name: 'Sari',
        email: 'sari@kopi.id',
        role: 'tenant',
        status: 'active',
      });
      mockCreateBugReport.mockResolvedValue({
        id: 'bug_456',
        sourceApp: 'site_builder',
        status: 'unresolved',
        createdAt: '2026-11-11T05:05:00.000Z',
      });

      const req = new Request('http://localhost:4321/api/public/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '203.0.113.12',
        },
        body: JSON.stringify({
          sourceApp: 'site_builder',
          description: 'Panel properti kanvas tidak menyimpan perubahan warna tombol.',
          routeUrl: '/builder/store_1',
        }),
      });

      const res = await POST({ request: req, clientAddress: '203.0.113.12' } as unknown as PostContext);
      expect(res.status).toBe(201);
      expect(mockCreateBugReport).toHaveBeenCalledWith(
        expect.objectContaining({ sourceApp: 'site_builder' }),
        { userId: 'usr_tenant_1', email: 'sari@kopi.id', role: 'tenant' },
        'unknown'
      );
    });

    it('enforces strict 2-minute cooldown and Retry-After header from same IP', async () => {
      mockGetAuthUser.mockResolvedValue(null);
      mockCreateBugReport.mockResolvedValue({
        id: 'bug_rate',
        sourceApp: 'site_builder',
        status: 'unresolved',
        createdAt: '2026-11-11T05:10:00.000Z',
      });

      const buildReq = (idx: number, spoofedXff?: string) =>
        new Request('http://localhost:4321/api/public/bug-reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: 'https://pinoka.id',
            'x-forwarded-for': spoofedXff || '198.51.100.77',
          },
          body: JSON.stringify({
            sourceApp: 'site_builder',
            description: `Laporan bug unik #${idx} untuk menguji cooldown ketat pengiriman.`,
            routeUrl: `/dashboard?case=${idx}`,
          }),
        });

      const firstRes = await POST({ request: buildReq(1), clientAddress: '198.51.100.77' } as unknown as PostContext);
      expect(firstRes.status).toBe(201);

      const secondRes = await POST({ request: buildReq(2, '203.0.113.250'), clientAddress: '198.51.100.77' } as unknown as PostContext);
      expect(secondRes.status).toBe(429);
      expect(secondRes.headers.get('Access-Control-Allow-Origin')).toBe('https://pinoka.id');
      expect(secondRes.headers.get('Retry-After')).toBe('120');

      const body = await secondRes.json();
      expect(body.success).toBe(false);
      expect(body.data).toBeNull();
      expect(body.meta?.code).toBe('RATE_LIMITED');
    });

    it('enforces 15-minute burst (2), 24-hour cap (5), duplicate lock, and per-user tracking across IPs', async () => {
      vi.useFakeTimers();

      mockGetAuthUser.mockResolvedValue({
        id: 'usr_spam_guard',
        name: 'Budi',
        email: 'budi@toko.id',
        role: 'tenant',
        status: 'active',
      });
      mockCreateBugReport.mockResolvedValue({
        id: 'bug_seq',
        sourceApp: 'site_builder',
        status: 'unresolved',
        createdAt: '2026-11-11T08:00:00.000Z',
      });

      const sendFromIp = async (ip: string, description: string, routeUrl: string) => {
        const req = new Request('http://localhost:4321/api/public/bug-reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': ip },
          body: JSON.stringify({ sourceApp: 'site_builder', description, routeUrl }),
        });
        return POST({ request: req, clientAddress: ip } as unknown as PostContext);
      };

      expect((await sendFromIp('198.51.100.1', 'Tombol checkout tidak merespons di mobile.', '/builder/1')).status).toBe(201);

      // Same content after cooldown -> blocked by 30-min duplicate lock even from different IP
      vi.advanceTimersByTime(3 * 60 * 1000);
      const dupRes = await sendFromIp('198.51.100.2', '  tombol CHECKOUT   tidak merespons di mobile. ', '/builder/1');
      expect(dupRes.status).toBe(429);
      expect(dupRes.headers.get('Retry-After')).toBe('1800');

      // 2nd distinct report passes after cooldown, 3rd within 15 min fails even from another IP (per-user tracked)
      expect((await sendFromIp('198.51.100.3', 'Gambar produk tidak muncul di preview.', '/builder/2')).status).toBe(201);
      vi.advanceTimersByTime(3 * 60 * 1000);
      const burstRes = await sendFromIp('198.51.100.4', 'Font judul bergeser saat ganti preset.', '/builder/3');
      expect(burstRes.status).toBe(429);
      expect(burstRes.headers.get('Retry-After')).toBe('900');

      // Advance past 15-min windows to hit 5/24h daily cap for same user across IPs
      for (const [idx, ip] of [[3, '198.51.100.5'], [4, '198.51.100.6'], [5, '198.51.100.7']] as const) {
        vi.advanceTimersByTime(16 * 60 * 1000);
        expect((await sendFromIp(ip, `Laporan valid berbeda ke-${idx} dalam sehari.`, `/builder/p${idx}`)).status).toBe(201);
      }

      vi.advanceTimersByTime(16 * 60 * 1000);
      const dailyRes = await sendFromIp('198.51.100.8', 'Laporan keenam melebihi kuota harian akun.', '/builder/p6');
      expect(dailyRes.status).toBe(429);
      expect(dailyRes.headers.get('Retry-After')).toBe('86400');
    });
  });
});


import { z } from 'zod';

export const BUG_REPORT_STATUSES = ['unresolved', 'in_progress', 'resolved'] as const;
export type BugReportStatus = (typeof BUG_REPORT_STATUSES)[number];

export const BUG_REPORT_SOURCES = ['site_builder', 'landing_page'] as const;
export type BugReportSource = (typeof BUG_REPORT_SOURCES)[number];

const safeAttachmentUrlSchema = z
  .string()
  .trim()
  .max(1000, 'URL lampiran terlalu panjang')
  .refine(
    (val) => !val || /^https?:\/\//i.test(val) || val.startsWith('/'),
    'URL lampiran harus menggunakan protokol HTTP/HTTPS atau path relatif'
  );

export const BugReportAttachmentMetaSchema = z
  .object({
    name: z.string().trim().min(1).max(180).optional(),
    size: z.number().int().nonnegative().max(25 * 1024 * 1024).optional(),
    mimeType: z.string().trim().min(1).max(100).optional(),
    url: safeAttachmentUrlSchema.optional(),
  })
  .strict();

export const CreateBugReportSchema = z.object({
  sourceApp: z.enum(BUG_REPORT_SOURCES).default('site_builder'),
  title: z
    .string()
    .trim()
    .max(140, 'Judul masalah maksimal 140 karakter')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .trim()
    .min(10, 'Deskripsi masalah minimal 10 karakter')
    .max(4000, 'Deskripsi masalah maksimal 4000 karakter'),
  stepsToReproduce: z
    .string()
    .trim()
    .max(4000, 'Langkah reproduksi maksimal 4000 karakter')
    .optional()
    .or(z.literal('')),
  routeUrl: z
    .string()
    .trim()
    .min(1, 'URL halaman wajib disertakan')
    .max(1000, 'URL halaman terlalu panjang'),
  userAgent: z.string().trim().max(600).optional(),
  reporterEmail: z
    .string()
    .trim()
    .email('Format email tidak valid')
    .max(180)
    .optional()
    .or(z.literal('')),
  attachmentMeta: BugReportAttachmentMetaSchema.nullable().optional(),
});

export type CreateBugReportInput = z.infer<typeof CreateBugReportSchema>;

export const UpdateBugReportSchema = z.object({
  status: z.enum(BUG_REPORT_STATUSES),
  adminNotes: z
    .string()
    .trim()
    .max(2000, 'Catatan admin maksimal 2000 karakter')
    .nullable()
    .optional(),
});

export type UpdateBugReportInput = z.infer<typeof UpdateBugReportSchema>;

export const ListBugReportsQuerySchema = z.object({
  status: z.enum(['all', ...BUG_REPORT_STATUSES]).default('all'),
  sourceApp: z.enum(['all', ...BUG_REPORT_SOURCES]).default('all'),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListBugReportsQuery = z.infer<typeof ListBugReportsQuerySchema>;


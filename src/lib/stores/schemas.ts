import { z } from 'zod';
import { subdomainField } from '@lib/validators/subdomain';

export const CheckSubdomainInput = z.object({
  subdomain: subdomainField,
});

export const RegisterSubdomainInput = z.object({
  subdomain: subdomainField,
  googleMapsUrl: z.string().url('URL Google Maps tidak valid'),
  tenantId: z.string().optional(),
});

export const OnboardStoreInput = z.object({
  subdomain: subdomainField,
  name: z.string().min(3, 'Nama toko minimal 3 karakter').max(100, 'Nama toko maksimal 100 karakter'),
  categoryId: z.string().min(1, 'Kategori bisnis wajib dipilih'),
  waNumber: z.string().regex(/^628[0-9]{7,12}$/, 'Nomor WhatsApp tidak valid. Gunakan format 628...'),
  googleMapsUrl: z.string().url('URL Google Maps tidak valid'),
  address: z.string().min(5, 'Alamat lengkap wajib diisi'),
  regionData: z.record(z.any()).optional(),
  templateId: z.string().optional(),
  tenantId: z.string().optional(),
});

export const StoreSettingsInput = z.object({
  name: z.string().min(3, 'Nama toko minimal 3 karakter').max(100, 'Nama toko maksimal 100 karakter'),
  waNumber: z.string().regex(/^628[0-9]{7,12}$/, 'Nomor WhatsApp tidak valid. Gunakan format 628...'),
  googleMapsUrl: z.string().url('URL Google Maps tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  categoryId: z.string().optional(),
});

export const StoreStatusInput = z.object({
  isOpen: z.boolean(),
});

export type CheckSubdomainInput = z.infer<typeof CheckSubdomainInput>;
export type RegisterSubdomainInput = z.infer<typeof RegisterSubdomainInput>;
export type OnboardStoreInput = z.infer<typeof OnboardStoreInput>;
export type StoreSettingsInput = z.infer<typeof StoreSettingsInput>;
export type StoreStatusInput = z.infer<typeof StoreStatusInput>;

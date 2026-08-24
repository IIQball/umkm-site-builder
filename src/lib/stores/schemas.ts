import { z } from 'zod';

const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

const subdomainField = z
  .string()
  .min(3, 'Subdomain minimal 3 karakter')
  .max(63, 'Subdomain maksimal 63 karakter')
  .regex(SUBDOMAIN_PATTERN, 'Subdomain hanya boleh huruf kecil, angka, dan tanda hubung')
  .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
    message: 'Subdomain tidak boleh diawali atau diakhiri tanda hubung',
  });

export const CheckSubdomainInput = z.object({
  subdomain: subdomainField,
});

export const RegisterSubdomainInput = z.object({
  subdomain: subdomainField,
});

export const OnboardStoreInput = z.object({
  subdomain: subdomainField,
  name: z.string().min(3, 'Nama toko minimal 3 karakter').max(100, 'Nama toko maksimal 100 karakter'),
  waNumber: z.string().regex(/^628[0-9]{7,12}$/, 'Nomor WhatsApp tidak valid. Gunakan format 628...'),
  googleMapsUrl: z.string().url('URL Google Maps tidak valid').optional().or(z.literal('')),
});

export const StoreSettingsInput = z.object({
  name: z.string().min(3, 'Nama toko minimal 3 karakter').max(100, 'Nama toko maksimal 100 karakter'),
  waNumber: z.string().regex(/^628[0-9]{7,12}$/, 'Nomor WhatsApp tidak valid. Gunakan format 628...'),
  googleMapsUrl: z.string().url('URL Google Maps tidak valid').optional().or(z.literal('')),
});

export type CheckSubdomainInput = z.infer<typeof CheckSubdomainInput>;
export type RegisterSubdomainInput = z.infer<typeof RegisterSubdomainInput>;
export type OnboardStoreInput = z.infer<typeof OnboardStoreInput>;
export type StoreSettingsInput = z.infer<typeof StoreSettingsInput>;

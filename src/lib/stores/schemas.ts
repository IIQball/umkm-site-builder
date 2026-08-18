import { z } from 'zod';

const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export const CheckSubdomainInput = z.object({
  subdomain: z
    .string()
    .min(3, 'Subdomain minimal 3 karakter')
    .max(63, 'Subdomain maksimal 63 karakter')
    .regex(SUBDOMAIN_PATTERN, 'Subdomain hanya boleh huruf kecil, angka, dan tanda hubung')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: 'Subdomain tidak boleh diawali atau diakhiri tanda hubung',
    }),
});

export type CheckSubdomainInput = z.infer<typeof CheckSubdomainInput>;

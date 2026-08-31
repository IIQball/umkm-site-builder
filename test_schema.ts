import { z } from 'zod';

export const adminStatusUpdateSchema = z.object({
  status: z.enum(['active', 'suspended']),
  suspendReason: z.string().optional(),
}).refine(
  (data) => {
    if (data.status === 'suspended') {
      return typeof data.suspendReason === 'string' && data.suspendReason.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'Alasan penangguhan wajib diisi minimal 5 karakter',
    path: ['suspendReason'],
  }
);

try {
  adminStatusUpdateSchema.parse({ status: 'suspended', suspendReason: 'alasan valid' });
  console.log("Success with valid reason");
} catch(e) {
  console.error("Error with valid reason:", e);
}

try {
  adminStatusUpdateSchema.parse({ status: 'suspended', suspendReason: 'test' });
} catch(e) {
  console.error("Error with short reason:", e.issues[0].message);
}

import { adminStatusUpdateSchema } from './src/schemas/admin/admin.schema.ts';

const body = { status: 'suspended', suspendReason: '12345' };
const res = adminStatusUpdateSchema.safeParse(body);
console.log(res.success ? 'Success' : res.error.flatten());

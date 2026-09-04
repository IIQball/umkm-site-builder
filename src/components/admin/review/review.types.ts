export type AdminTemplateItem = {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: string;
  designerId: string;
  designerName: string | null;
  designerEmail: string | null;
};

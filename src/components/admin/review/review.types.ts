export type AdminTemplateItem = {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  revisionCount?: number;
  revisionNotes?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  designerId: string;
  designerName: string | null;
  designerEmail: string | null;
};

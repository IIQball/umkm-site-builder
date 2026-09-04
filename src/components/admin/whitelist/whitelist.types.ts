export type AdminEntry = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  createdAt: string;
};

export type ConfirmModalState = {
  isOpen: boolean;
  type: 'toggle' | 'remove';
  id: string;
  adminName: string;
  currentStatus?: 'active' | 'suspended';
};

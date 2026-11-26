export interface AdminInvitationItem {
  id: string;
  name: string;
  email: string;
  token: string;
  invitedBy: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  userId: string | null;
  userStatus: string | null;
  extensionCount?: number;
}


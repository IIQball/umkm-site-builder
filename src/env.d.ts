/// <reference types="astro/client" />

declare namespace App {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    role?: string | null;
    status?: string | null;
  }

  interface Session {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }

  interface Locals {
    user: User | null;
    session: Session | null;
  }
}

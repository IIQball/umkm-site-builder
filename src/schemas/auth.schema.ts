import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ error: issue => issue.input === undefined ? "Format email tidak valid atau belum diisi" : undefined })
    .min(1, "Format email tidak valid atau belum diisi")
    .email("Format email tidak valid atau belum diisi"),
  password: z
    .string({ error: issue => issue.input === undefined ? "Kata sandi minimal 8 karakter" : undefined })
    .min(8, "Kata sandi minimal 8 karakter"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({ error: issue => issue.input === undefined ? "Nama lengkap minimal 3 karakter" : undefined })
      .min(3, "Nama lengkap minimal 3 karakter"),
    email: z
      .string({ error: issue => issue.input === undefined ? "Format email tidak valid" : undefined })
      .min(1, "Format email tidak valid")
      .email("Format email tidak valid"),
    role: z.enum(["tenant", "designer"], {
      error: "Pilih salah satu peran yang valid",
    }),
    password: z
      .string({ error: issue => issue.input === undefined ? "Kata sandi minimal 8 karakter" : undefined })
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Kata sandi harus mengandung kombinasi huruf dan angka"),
    confirmPassword: z
      .string({ error: issue => issue.input === undefined ? "Konfirmasi kata sandi wajib diisi" : undefined })
      .min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });


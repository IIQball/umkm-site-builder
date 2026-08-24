import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Format email tidak valid atau belum diisi" })
    .min(1, "Format email tidak valid atau belum diisi")
    .email("Format email tidak valid atau belum diisi"),
  password: z
    .string({ required_error: "Kata sandi minimal 8 karakter" })
    .min(8, "Kata sandi minimal 8 karakter"),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Nama lengkap minimal 3 karakter" })
      .min(3, "Nama lengkap minimal 3 karakter"),
    email: z
      .string({ required_error: "Format email tidak valid" })
      .min(1, "Format email tidak valid")
      .email("Format email tidak valid"),
    role: z.enum(["tenant", "designer"], {
      errorMap: () => ({ message: "Pilih salah satu peran yang valid" }),
    }),
    password: z
      .string({ required_error: "Kata sandi minimal 8 karakter" })
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Kata sandi harus mengandung kombinasi huruf dan angka"),
    confirmPassword: z
      .string({ required_error: "Konfirmasi kata sandi wajib diisi" })
      .min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { z } from "zod";
  import Button from "@/components/ui/Button.svelte";
  import Input from "@/components/ui/Input.svelte";

  let email = "";
  let error = "";
  let successMessage = "";
  let loading = false;

  const emailSchema = z.string().email("Format email tidak valid");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error = "";
    successMessage = "";

    const validationResult = emailSchema.safeParse(email);
    if (!validationResult.success) {
      error = validationResult.error.errors[0].message;
      return;
    }

    loading = true;

    try {
      // Validasi apakah email ada di database
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const checkData = await checkRes.json();
      
      if (!checkData.exists) {
        error = "Email tidak terdaftar di sistem kami.";
        loading = false;
        return;
      }

      const { error: errResponse } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
      });

      if (errResponse) {
        error = JSON.stringify(errResponse);
      } else {
        successMessage = "Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk atau folder spam.";
        email = "";
      }
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    } finally {
      loading = false;
    }
  };
</script>

<form novalidate on:submit={handleSubmit} class="space-y-4 w-full">
  {#if error}
    <div class="p-4 rounded-2xl bg-error/10 text-error text-body-sm font-medium border border-error/20 text-center w-full animate-fade-in-up">
      {error}
    </div>
  {/if}

  {#if successMessage}
    <div class="p-4 rounded-2xl bg-success/10 text-success text-body-sm font-medium border border-success/20 text-center w-full animate-fade-in-up">
      {successMessage}
    </div>
  {/if}

  <Input
    type="email"
    bind:value={email}
    label="Email"
    placeholder="anda@contoh.com"
    required
    disabled={loading}
    size="md"
    fullWidth
  />

  <div class="pt-2 w-full">
    <Button type="submit" variant="primary" size="lg" fullWidth {loading} disabled={loading}>
      Kirim Link Reset Password
    </Button>
  </div>
  
  <div class="text-center pt-2">
    <a href="/auth/login" class="text-sm font-medium text-secondary hover:text-primary transition-colors">
      Kembali ke halaman Masuk
    </a>
  </div>
</form>

<script lang="ts">
  import { onMount } from "svelte";
  import { z } from "zod";
  import Button from "@/components/ui/Button.svelte";
  import { Eye, EyeOff } from "lucide-svelte";
  import { authClient } from "@/lib/auth-client";

  let token = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let successMessage = "";
  let loading = false;
  let isTokenValid = true;
  let showPassword = false;
  let showConfirmPassword = false;

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword = !showConfirmPassword;
  };

  onMount(() => {
    // Read the token from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (!tokenParam) {
      error = "Token verifikasi tidak ditemukan di URL. Silakan minta tautan reset password yang baru.";
      isTokenValid = false;
    } else {
      token = tokenParam;
    }
  });

  const passwordSchema = z.object({
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error = "";
    successMessage = "";

    if (!isTokenValid) return;

    const validationResult = passwordSchema.safeParse({ password, confirmPassword });
    if (!validationResult.success) {
      error = validationResult.error.errors[0].message;
      return;
    }

    loading = true;

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        error = data.error || "Gagal mengatur ulang kata sandi";
      } else {
        await authClient.signOut(); // Pastikan otomatis logout
        successMessage = "Kata sandi berhasil diatur ulang! Anda sekarang dapat masuk dengan sandi baru.";
        password = "";
        confirmPassword = "";
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
    <div class="p-3 rounded-xl bg-error/10 text-error text-sm font-medium border border-error/20 text-center w-full">
      {error}
    </div>
  {/if}

  {#if successMessage}
    <div class="p-3 rounded-xl bg-success/10 text-success text-sm font-medium border border-success/20 text-center w-full space-y-3">
      <p>{successMessage}</p>
      <Button href="/auth/login" variant="primary" size="sm" fullWidth>
        Menuju Halaman Masuk
      </Button>
    </div>
  {:else}
    <div class="form-control w-full">
      <label class="label pt-0 pb-0.5" for="password">
        <span class="label-text font-medium text-base-content/80 text-sm">Kata Sandi Baru</span>
      </label>
      <div class="relative">
        {#if showPassword}
          <input
            type="text"
            id="password"
            bind:value={password}
            placeholder="Minimal 8 karakter"
            class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10"
            disabled={loading || !isTokenValid}
          />
        {:else}
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="Minimal 8 karakter"
            class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10"
            disabled={loading || !isTokenValid}
          />
        {/if}
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center px-4 z-20 cursor-pointer text-base-content/60 hover:text-base-content transition-colors"
          on:click={togglePasswordVisibility}
          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          <span class="pointer-events-none flex">
            {#if showPassword}
              <EyeOff size={16} />
            {:else}
              <Eye size={16} />
            {/if}
          </span>
        </button>
      </div>
    </div>

    <div class="form-control w-full">
      <label class="label pt-0 pb-0.5" for="confirmPassword">
        <span class="label-text font-medium text-base-content/80 text-sm">Konfirmasi Kata Sandi</span>
      </label>
      <div class="relative">
        {#if showConfirmPassword}
          <input
            type="text"
            id="confirmPassword"
            bind:value={confirmPassword}
            placeholder="Ulangi kata sandi baru"
            class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10"
            disabled={loading || !isTokenValid}
          />
        {:else}
          <input
            type="password"
            id="confirmPassword"
            bind:value={confirmPassword}
            placeholder="Ulangi kata sandi baru"
            class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10"
            disabled={loading || !isTokenValid}
          />
        {/if}
        <button
          type="button"
          class="absolute inset-y-0 right-0 flex items-center px-4 z-20 cursor-pointer text-base-content/60 hover:text-base-content transition-colors"
          on:click={toggleConfirmPasswordVisibility}
          aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          <span class="pointer-events-none flex">
            {#if showConfirmPassword}
              <EyeOff size={16} />
            {:else}
              <Eye size={16} />
            {/if}
          </span>
        </button>
      </div>
    </div>

    <div class="pt-2 w-full flex justify-center">
      <button type="submit" class="btn btn-primary btn-sm h-10 rounded-full font-semibold w-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" disabled={!isTokenValid || loading}>
        {#if loading}
          <span class="loading loading-spinner loading-sm"></span>
        {/if}
        Simpan Kata Sandi Baru
      </button>
    </div>
  {/if}
</form>

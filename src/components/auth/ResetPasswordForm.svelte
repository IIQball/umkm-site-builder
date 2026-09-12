<script lang="ts">
  import { onMount } from "svelte";
  import { z } from "zod";
  import Button from "@/components/ui/Button.svelte";
  import Input from "@/components/ui/Input.svelte";
  import { Eye, EyeOff } from "lucide-svelte";
  import { authClient } from "@/lib/auth-client";
  import { toast } from "@/lib/toast";

  let token = "";
  let password = "";
  let confirmPassword = "";
  let name = "";
  let uid = "";
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
    // Read the token, uid, and name from URL search params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const nameParam = urlParams.get("name");
    const uidParam = urlParams.get("uid");
    
    if (nameParam) name = nameParam;
    if (uidParam) uid = uidParam;

    if (!tokenParam) {
      toast.error("Token verifikasi tidak ditemukan di URL. Silakan minta tautan reset password yang baru.");
      isTokenValid = false;
    } else {
      token = tokenParam;
    }
  });

  const passwordSchema = z.object({
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    confirmPassword: z.string(),
    name: z.string().min(3, "Nama minimal 3 karakter"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    successMessage = "";

    if (!isTokenValid) return;

    const validationResult = passwordSchema.safeParse({ password, confirmPassword, name });
    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
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
          uid,
          name
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Gagal mengatur ulang kata sandi");
      } else {
        await authClient.signOut(); // Pastikan otomatis logout
        toast.success("Kata sandi berhasil diatur ulang! Anda sekarang dapat masuk dengan sandi baru.");
        successMessage = "Kata sandi berhasil diatur ulang! Anda sekarang dapat masuk dengan sandi baru.";
        password = "";
        confirmPassword = "";
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      loading = false;
    }
  };
</script>

<form novalidate on:submit={handleSubmit} class="space-y-5 w-full">
  {#if successMessage}
    <div class="p-4 rounded-2xl bg-success/10 text-success text-body-sm font-medium border border-success/20 text-center w-full space-y-4 animate-fade-in-up">
      <p>{successMessage}</p>
      <Button href="/auth/login" variant="primary" size="md" fullWidth>
        Menuju Halaman Masuk
      </Button>
    </div>
  {:else}
    <div class="space-y-4">
      {#if uid}
      <Input
        label="Nama Lengkap"
        id="name"
        type="text"
        bind:value={name}
        placeholder="Nama Lengkap"
        disabled={loading || !isTokenValid}
        size="md"
      />
      {/if}

      <Input
        label="Kata Sandi Baru"
        id="password"
        type={showPassword ? "text" : "password"}
        bind:value={password}
        placeholder="Minimal 8 karakter"
        disabled={loading || !isTokenValid}
        size="md"
      >
        <button
          slot="suffix"
          type="button"
          class="flex items-center justify-center p-1 cursor-pointer text-muted hover:text-main transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
          on:click={togglePasswordVisibility}
          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          {#if showPassword}
            <EyeOff size={16} />
          {:else}
            <Eye size={16} />
          {/if}
        </button>
      </Input>

      <Input
        label="Konfirmasi Kata Sandi"
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        bind:value={confirmPassword}
        placeholder="Ulangi kata sandi baru"
        disabled={loading || !isTokenValid}
        size="md"
      >
        <button
          slot="suffix"
          type="button"
          class="flex items-center justify-center p-1 cursor-pointer text-muted hover:text-main transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
          on:click={toggleConfirmPasswordVisibility}
          aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        >
          {#if showConfirmPassword}
            <EyeOff size={16} />
          {:else}
            <Eye size={16} />
          {/if}
        </button>
      </Input>
    </div>

    <div class="pt-2 w-full">
      <Button type="submit" variant="primary" size="lg" fullWidth disabled={!isTokenValid || loading} {loading}>
        Simpan Kata Sandi Baru
      </Button>
    </div>
  {/if}
</form>

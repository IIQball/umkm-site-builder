<script lang="ts">
  import { onMount } from "svelte";
  import { z } from "zod";
  import Button from "@/components/ui/Button.svelte";
  import Input from "@/components/ui/Input.svelte";
  import { Eye, EyeOff } from "lucide-svelte";
  import { apiFetch } from "@/lib/api/parse-response";
  import { toast } from "@/lib/toast";

  export let isActivation = false;

  let token = "";
  let password = "";
  let confirmPassword = "";
  let name = "";
  let uid = "";
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
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");

    if (isActivation) {
      const nameParam = urlParams.get("name");
      const uidParam = urlParams.get("uid");
      if (nameParam) name = nameParam;
      if (uidParam) uid = uidParam;
    }

    if (!tokenParam) {
      toast.error("Token verifikasi tidak ditemukan di URL. Silakan minta tautan reset password yang baru.");
      isTokenValid = false;
    } else {
      token = tokenParam;
    }
  });

  const validateForm = () => {
    const schema = z
      .object({
        password: z.string().min(8, "Kata sandi minimal 8 karakter"),
        confirmPassword: z.string(),
        ...(isActivation
          ? { name: z.string().trim().min(3, "Nama minimal 3 karakter") }
          : {}),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Konfirmasi kata sandi tidak cocok",
        path: ["confirmPassword"],
      });

    return schema.safeParse({ password, confirmPassword, ...(isActivation ? { name } : {}) });
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!isTokenValid) return;

    const validationResult = validateForm();
    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    loading = true;

    try {
      const payload = isActivation
        ? { token, password, uid, name: name.trim() }
        : { token, password };

      const result = await apiFetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        fallbackError: "Gagal mengatur ulang kata sandi",
      });

      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(
          isActivation
            ? "Akun berhasil diaktifkan! Mengalihkan ke halaman masuk..."
            : "Kata sandi berhasil diperbarui! Mengalihkan ke halaman masuk..."
        );
        window.location.href = "/auth/login?success=activation_complete";
      }
    } finally {
      loading = false;
    }
  };
</script>

<form novalidate on:submit={handleSubmit} class="space-y-5 w-full">
  <div class="space-y-4">
    {#if isActivation}
      <Input
        label="Nama Lengkap"
        id="name"
        type="text"
        autocomplete="name"
        bind:value={name}
        placeholder="Nama Lengkap"
        disabled={loading || !isTokenValid}
        size="md"
      />
    {/if}

    <Input
      label={isActivation ? "Kata Sandi" : "Kata Sandi Baru"}
      id="password"
      type={showPassword ? "text" : "password"}
      autocomplete="new-password"
      bind:value={password}
      placeholder="Minimal 8 karakter"
      disabled={loading || !isTokenValid}
      size="md"
    >
      <Button
        variant="ghost"
        size="icon"
        slot="suffix"
        type="button"
        class="text-muted hover:text-main"
        ariaPressed={showPassword}
        on:click={togglePasswordVisibility}
        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {#if showPassword}
          <EyeOff size={16} />
        {:else}
          <Eye size={16} />
        {/if}
      </Button>
    </Input>

    <Input
      label="Konfirmasi Kata Sandi"
      id="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      autocomplete="new-password"
      bind:value={confirmPassword}
      placeholder="Ulangi kata sandi baru"
      disabled={loading || !isTokenValid}
      size="md"
    >
      <Button
        variant="ghost"
        size="icon"
        slot="suffix"
        type="button"
        class="text-muted hover:text-main"
        ariaPressed={showConfirmPassword}
        on:click={toggleConfirmPasswordVisibility}
        aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {#if showConfirmPassword}
          <EyeOff size={16} />
        {:else}
          <Eye size={16} />
        {/if}
      </Button>
    </Input>
  </div>

  <div class="pt-2 w-full">
    <Button type="submit" variant="primary" size="lg" fullWidth disabled={!isTokenValid || loading} {loading}>
      {isActivation ? "Aktifkan Akun & Simpan Sandi" : "Simpan Kata Sandi Baru"}
    </Button>
  </div>
</form>

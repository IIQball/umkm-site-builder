<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { RegisterSchema } from "@/schemas/auth.schema";
  import { Eye, EyeOff, AlertCircle } from "lucide-svelte";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";

  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let role: "tenant" | "designer" | "admin" = "tenant";
  let generalError = "";
  let errors: Record<string, string> = {};
  let loading = false;
  let showPassword = false;
  let showConfirmPassword = false;

  const handleInput = (field: string) => {
    if (errors[field]) {
      errors = { ...errors, [field]: "" };
    }
    if (generalError) {
      generalError = "";
    }
  };

  const validateForm = () => {
    const result = RegisterSchema.safeParse({
      name,
      email,
      role,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      errors = fieldErrors;
      return false;
    }
    errors = {};
    return true;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    generalError = "";

    if (!validateForm()) {
      return;
    }

    loading = true;

    try {
      const { error: errResponse } = await authClient.signUp.email({
        email,
        password,
        name,
        role,
      });

      if (errResponse) {
        generalError = errResponse.message || "Gagal membuat akun.";
        return;
      }

      window.location.href = "/auth/login";
    } catch (err: unknown) {
      generalError = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    } finally {
      loading = false;
    }
  };
</script>

<form novalidate on:submit={handleSubmit} class="space-y-4">
  {#if generalError}
    <div class="alert alert-error shadow-sm rounded-xl p-3 flex items-start gap-2.5 text-xs text-error-content">
      <AlertCircle size={16} class="shrink-0 mt-0.5" />
      <span>{generalError}</span>
    </div>
  {/if}

  <div class="form-control">
    <label class="label pt-0 pb-1" for="name">
      <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">Nama Lengkap</span>
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      on:input={() => handleInput("name")}
      placeholder="Nama lengkap Anda"
      class="input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11 {errors.name ? 'input-error border-error focus:ring-error/20' : ''}"
      autocomplete="name"
    />
    {#if errors.name}
      <span class="text-xs text-error mt-1.5 flex items-center gap-1.5 font-medium">
        <AlertCircle size={13} class="shrink-0" />
        {errors.name}
      </span>
    {/if}
  </div>

  <div class="form-control">
    <label class="label pt-0 pb-1" for="role">
      <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">Peran Akun</span>
    </label>
    <select
      id="role"
      bind:value={role}
      on:change={() => handleInput("role")}
      class="select select-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11 {errors.role ? 'select-error border-error focus:ring-error/20' : ''}"
    >
      <option value="tenant">Pemilik Toko (Tenant)</option>
      <option value="designer">Desainer Template (Designer)</option>
      <option value="admin">Administrator (Admin)</option>
    </select>
    {#if errors.role}
      <span class="text-xs text-error mt-1.5 flex items-center gap-1.5 font-medium">
        <AlertCircle size={13} class="shrink-0" />
        {errors.role}
      </span>
    {/if}
  </div>

  <div class="form-control">
    <label class="label pt-0 pb-1" for="email">
      <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">Email</span>
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      on:input={() => handleInput("email")}
      placeholder="anda@contoh.com"
      class="input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11 {errors.email ? 'input-error border-error focus:ring-error/20' : ''}"
      autocomplete="email"
    />
    {#if errors.email}
      <span class="text-xs text-error mt-1.5 flex items-center gap-1.5 font-medium">
        <AlertCircle size={13} class="shrink-0" />
        {errors.email}
      </span>
    {/if}
  </div>

  <div class="form-control">
    <label class="label pt-0 pb-1" for="password">
      <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">Kata Sandi</span>
    </label>
    <div class="relative">
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        value={password}
        on:input={(e) => {
          password = e.currentTarget.value;
          handleInput("password");
        }}
        placeholder="Minimal 8 karakter (huruf & angka)"
        class="input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11 pr-10 {errors.password ? 'input-error border-error focus:ring-error/20' : ''}"
        autocomplete="new-password"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/60 hover:text-base-content transition-colors"
        on:click={() => (showPassword = !showPassword)}
        aria-label="Tampilkan atau sembunyikan kata sandi"
      >
        {#if showPassword}
          <EyeOff size={18} />
        {:else}
          <Eye size={18} />
        {/if}
      </button>
    </div>
    {#if errors.password}
      <span class="text-xs text-error mt-1.5 flex items-center gap-1.5 font-medium">
        <AlertCircle size={13} class="shrink-0" />
        {errors.password}
      </span>
    {/if}
  </div>

  <div class="form-control">
    <label class="label pt-0 pb-1" for="confirmPassword">
      <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">Konfirmasi Kata Sandi</span>
    </label>
    <div class="relative">
      <input
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        value={confirmPassword}
        on:input={(e) => {
          confirmPassword = e.currentTarget.value;
          handleInput("confirmPassword");
        }}
        placeholder="Ketik ulang kata sandi"
        class="input input-bordered w-full rounded-xl bg-base-200/30 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 transition-all text-sm h-11 pr-10 {errors.confirmPassword ? 'input-error border-error focus:ring-error/20' : ''}"
        autocomplete="new-password"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/60 hover:text-base-content transition-colors"
        on:click={() => (showConfirmPassword = !showConfirmPassword)}
        aria-label="Tampilkan atau sembunyikan konfirmasi kata sandi"
      >
        {#if showConfirmPassword}
          <EyeOff size={18} />
        {:else}
          <Eye size={18} />
        {/if}
      </button>
    </div>
    {#if errors.confirmPassword}
      <span class="text-xs text-error mt-1.5 flex items-center gap-1.5 font-medium">
        <AlertCircle size={13} class="shrink-0" />
        {errors.confirmPassword}
      </span>
    {/if}
  </div>

  <div class="form-control pt-2">
    <button type="submit" class="btn btn-primary w-full rounded-xl h-11 text-sm font-semibold shadow-md hover:shadow-lg transition-all" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
        <span>Memproses...</span>
      {:else}
        <span>Buat Akun</span>
      {/if}
    </button>
  </div>
</form>

<div class="divider my-5 text-xs text-base-content/40 uppercase font-medium">Atau lanjutkan dengan</div>

<GoogleAuthButton />

<p class="text-xs text-center text-base-content/60 pt-3 leading-relaxed">
  Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="link link-primary font-medium">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="link link-primary font-medium">Kebijakan Privasi</a>.
</p>

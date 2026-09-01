<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { RegisterSchema } from "@/schemas/auth.schema";
  import { Eye, EyeOff } from "lucide-svelte";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";

  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let role: "tenant" | "designer" = "tenant";
  let generalError = "";
  let errors: Record<string, string> = {};
  let loading = false;
  let showPassword = false;
  let showConfirmPassword = false;

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword = !showConfirmPassword;
  };

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
        generalError = errResponse.message || "Gagal membuat akun";
        return;
      }

      if (role === 'designer') {
        window.location.href = '/designer/wallet';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      generalError = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    } finally {
      loading = false;
    }
  };
</script>

<form novalidate on:submit={handleSubmit} class="space-y-2 w-full">
  {#if generalError}
    <div class="p-2 rounded-lg bg-error/10 text-error text-sm font-medium border border-error/20 text-center w-full">
      {generalError}
    </div>
  {/if}

  <div class="form-control w-full">
    <label class="label pt-0 pb-0.5" for="name">
      <span class="label-text font-medium text-base-content/80 text-sm">Nama Lengkap</span>
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      on:input={() => handleInput("name")}
      placeholder="Nama lengkap Anda"
      class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors {errors.name ? 'input-error' : ''}"
      autocomplete="name"
    />
    {#if errors.name}
      <span class="text-xs text-error mt-0.5 px-1 flex items-center gap-1 font-medium">
        {errors.name}
      </span>
    {/if}
  </div>

  <div class="form-control w-full">
    <label class="label pt-0 pb-0.5" for="role">
      <span class="label-text font-medium text-base-content/80 text-sm">Peran Akun</span>
    </label>
    <select
      id="role"
      bind:value={role}
      on:change={() => handleInput("role")}
      class="select select-sm h-10 select-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors {errors.role ? 'select-error' : ''}"
    >
      <option value="tenant">Pemilik Toko (Tenant)</option>
      <option value="designer">Desainer Template (Designer)</option>
    </select>
    {#if errors.role}
      <span class="text-xs text-error mt-0.5 px-1 flex items-center gap-1 font-medium">
        {errors.role}
      </span>
    {/if}
  </div>

  <div class="form-control w-full">
    <label class="label pt-0 pb-0.5" for="email">
      <span class="label-text font-medium text-base-content/80 text-sm">Email</span>
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      on:input={() => handleInput("email")}
      placeholder="anda@contoh.com"
      class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors {errors.email ? 'input-error' : ''}"
      autocomplete="email"
    />
    {#if errors.email}
      <span class="text-xs text-error mt-0.5 px-1 flex items-center gap-1 font-medium">
        {errors.email}
      </span>
    {/if}
  </div> 

  <div class="form-control w-full">
    <label class="label pt-0 pb-0.5" for="password">
      <span class="label-text font-medium text-base-content/80 text-sm">Kata Sandi</span>
    </label>
    <div class="relative">
      {#if showPassword}
        <input
          type="text"
          id="password"
          bind:value={password}
          on:input={() => handleInput("password")}
          placeholder="Minimal 8 karakter"
          class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10 {errors.password ? 'input-error' : ''}"
          autocomplete="new-password"
        />
      {:else}
        <input
          type="password"
          id="password"
          bind:value={password}
          on:input={() => handleInput("password")}
          placeholder="Minimal 8 karakter"
          class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10 {errors.password ? 'input-error' : ''}"
          autocomplete="new-password"
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
    {#if errors.password}
      <span class="text-xs text-error mt-0.5 px-1 flex items-center gap-1 font-medium">
        {errors.password}
      </span>
    {/if}
  </div>

  <div class="form-control w-full">
    <label class="label pt-0 pb-0.5" for="confirmPassword">
      <span class="label-text font-medium text-base-content/80 text-sm">Konfirmasi Sandi</span>
    </label>
    <div class="relative">
      {#if showConfirmPassword}
        <input
          type="text"
          id="confirmPassword"
          bind:value={confirmPassword}
          on:input={() => handleInput("confirmPassword")}
          placeholder="Ketik ulang kata sandi"
          class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10 {errors.confirmPassword ? 'input-error' : ''}"
          autocomplete="new-password"
        />
      {:else}
        <input
          type="password"
          id="confirmPassword"
          bind:value={confirmPassword}
          on:input={() => handleInput("confirmPassword")}
          placeholder="Ketik ulang kata sandi"
          class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10 {errors.confirmPassword ? 'input-error' : ''}"
          autocomplete="new-password"
        />
      {/if}
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center px-4 z-20 cursor-pointer text-base-content/60 hover:text-base-content transition-colors"
        on:click={toggleConfirmPasswordVisibility}
        aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
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
    {#if errors.confirmPassword}
      <span class="text-xs text-error mt-0.5 px-1 flex items-center gap-1 font-medium">
        {errors.confirmPassword}
      </span>
    {/if}
  </div>

  <div class="pt-2 w-full flex justify-center">
    <button type="submit" class="btn btn-primary btn-sm h-10 rounded-full font-semibold w-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
      {/if}
      Buat Akun
    </button>
  </div>
</form>

<div class="divider text-[10px] text-base-content/40 uppercase font-medium my-3 w-full">Atau lanjutkan dengan</div>

<div class="w-full">
  <GoogleAuthButton />
</div>

<p class="text-xs text-center text-base-content/60 pt-2 leading-relaxed">
  Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="link link-primary font-medium">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="link link-primary font-medium">Kebijakan Privasi</a>.
</p>

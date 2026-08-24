<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { LoginSchema } from "@/schemas/auth.schema";
  import { Eye, EyeOff } from "lucide-svelte";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";

  let email = "";
  let password = "";
  let generalError = "";
  let errors: Record<string, string> = {};
  let loading = false;
  let showPassword = false;

  const handleInput = (field: string) => {
    if (errors[field]) {
      errors = { ...errors, [field]: "" };
    }
    if (generalError) {
      generalError = "";
    }
  };

  const validateForm = () => {
    const result = LoginSchema.safeParse({ email, password });
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
      const { data, error: errResponse } = await authClient.signIn.email({
        email,
        password,
      });

      if (errResponse) {
        generalError = errResponse.message || "Email atau kata sandi tidak valid";
        return;
      }

      const role = data?.user?.role;
      if (role === 'designer') {
        window.location.href = "/designer/wallet";
      } else {
        window.location.href = "/dashboard";
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
      <span class="text-xs text-error mt-0.5 px-1">{errors.email}</span>
    {/if}
  </div>

  <div class="form-control w-full">
    <label class="label pt-0 pb-0.5" for="password">
      <span class="label-text font-medium text-base-content/80 text-sm">Kata Sandi</span>
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
        placeholder="Masukkan kata sandi"
        class="input input-sm h-10 input-bordered w-full bg-base-200/30 focus:bg-base-100 transition-colors pr-10 {errors.password ? 'input-error' : ''}"
        autocomplete="current-password"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/60 hover:text-base-content transition-colors"
        on:click={() => (showPassword = !showPassword)}
        aria-label="Tampilkan atau sembunyikan kata sandi"
      >
        {#if showPassword}
          <EyeOff size={16} />
        {:else}
          <Eye size={16} />
        {/if}
      </button>
    </div>
    {#if errors.password}
      <span class="text-xs text-error mt-0.5 px-1">{errors.password}</span>
    {/if}
    <div class="flex justify-end mt-1 mb-1">
      <a href="/auth/forgot-password" class="text-xs font-medium text-primary hover:underline transition-all">Lupa Password?</a>
    </div>
  </div>

  <div class="pt-2 w-full flex justify-center">
    <button type="submit" class="btn btn-primary btn-sm h-10 rounded-full font-semibold w-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
      {/if}
      Masuk
    </button>
  </div>
</form>

<div class="divider text-[10px] text-base-content/40 uppercase font-medium my-3 w-full">Atau lanjutkan dengan</div>

<div class="w-full">
  <GoogleAuthButton />
</div>

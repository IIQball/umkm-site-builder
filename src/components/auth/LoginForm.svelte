<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { LoginSchema } from "@/schemas/auth.schema";
  import { Eye, EyeOff } from "lucide-svelte";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";
  import Input from "@/components/ui/Input.svelte";
  import Button from "@/components/ui/Button.svelte";

  let email = "";
  let password = "";
  let generalError = "";
  let errors: Record<string, string> = {};
  let loading = false;
  let showPassword = false;

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
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
        if (errResponse.message === "ACCOUNT_SUSPENDED") {
          generalError = "Akun Anda telah ditangguhkan. Silakan hubungi admin untuk bantuan lebih lanjut.";
        } else {
          generalError = errResponse.message || "Email atau kata sandi tidak valid";
        }
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

<form novalidate on:submit={handleSubmit} class="space-y-4 w-full">
  {#if generalError}
    <div class="p-4 rounded-2xl bg-error/10 text-error text-body-sm font-medium border border-error/20 text-center w-full animate-fade-in-up">
      {generalError}
    </div>
  {/if}

  <Input
    type="email"
    id="email"
    bind:value={email}
    label="Email"
    error={errors.email}
    on:input={() => handleInput("email")}
    placeholder="anda@contoh.com"
    autocomplete="email"
    size="md"
    fullWidth
  />

  <div class="space-y-1">
    <Input
      type={showPassword ? "text" : "password"}
      id="password"
      bind:value={password}
      label="Kata Sandi"
      error={errors.password}
      on:input={() => handleInput("password")}
      placeholder="Masukkan kata sandi"
      autocomplete="current-password"
      size="md"
      fullWidth
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
    <div class="flex justify-end pt-1">
      <a href="/auth/forgot-password" class="text-body-sm font-medium text-primary hover:underline transition-all">Lupa Password?</a>
    </div>
  </div>

  <div class="pt-2 w-full">
    <Button type="submit" variant="primary" size="lg" fullWidth {loading} disabled={loading}>
      Masuk
    </Button>
  </div>
</form>

<div class="flex items-center gap-4 my-6 w-full">
  <div class="flex-1 h-px bg-border-light"></div>
  <span class="text-label-caps text-muted">Atau lanjutkan dengan</span>
  <div class="flex-1 h-px bg-border-light"></div>
</div>

<div class="w-full">
  <GoogleAuthButton />
</div>

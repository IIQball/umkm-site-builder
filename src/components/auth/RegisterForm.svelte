<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { RegisterSchema } from "@/schemas/auth.schema";
  import { Eye, EyeOff, Store, PenTool, CheckCircle2, ArrowLeft } from "lucide-svelte";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";
  import Input from "@/components/ui/Input.svelte";
  import Button from "@/components/ui/Button.svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  let step = 1;
  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let role: "tenant" | "designer" | "" = "";
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

  const nextStep = () => {
    if (role === "") {
      generalError = "Silakan pilih peran akun Anda terlebih dahulu.";
      return;
    }
    generalError = "";
    step = 2;
  };

  const prevStep = () => {
    generalError = "";
    errors = {};
    step = 1;
  };

  const validateForm = () => {
    const result = RegisterSchema.safeParse({
      name,
      email,
      role: role as "tenant" | "designer",
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
        role: role as "tenant" | "designer",
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

<div class="w-full relative">
  {#if generalError}
    <div class="p-3 rounded-xl bg-error/10 text-error text-xs font-medium border border-error/20 text-center w-full animate-fade-in-up mb-4">
      {generalError}
    </div>
  {/if}

  {#if step === 1}
    <div 
      class="w-full space-y-4"
      in:fly={{ x: -20, duration: 400, delay: 400, easing: cubicOut }}
      out:fade={{ duration: 300 }}
    >
      <div class="grid grid-cols-1 gap-3 w-full">
        <!-- Tenant Card -->
        <button 
          type="button"
          class="relative p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group {role === 'tenant' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'border-light bg-card hover:border-muted hover:shadow-xs'}"
          on:click={() => { role = 'tenant'; generalError = ""; }}
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors {role === 'tenant' ? 'bg-primary text-white' : 'bg-nested text-muted group-hover:text-main'}">
              <Store size={18} strokeWidth={2.5} />
            </div>
            <div class="pr-6">
              <h3 class="font-medium text-main text-sm">Pemilik Toko (Tenant)</h3>
              <p class="text-xs text-secondary mt-0.5 leading-relaxed">Bangun website UMKM impian tanpa koding.</p>
            </div>
          </div>
          {#if role === 'tenant'}
            <div class="absolute top-1/2 -translate-y-1/2 right-4 text-primary animate-fade-in-up">
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </div>
          {/if}
        </button>
        
        <!-- Designer Card -->
        <button 
          type="button"
          class="relative p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group {role === 'designer' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'border-light bg-card hover:border-muted hover:shadow-xs'}"
          on:click={() => { role = 'designer'; generalError = ""; }}
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors {role === 'designer' ? 'bg-primary text-white' : 'bg-nested text-muted group-hover:text-main'}">
              <PenTool size={18} strokeWidth={2.5} />
            </div>
            <div class="pr-6">
              <h3 class="font-medium text-main text-sm">Desainer Template</h3>
              <p class="text-xs text-secondary mt-0.5 leading-relaxed">Buat dan jual template desain eksklusif.</p>
            </div>
          </div>
          {#if role === 'designer'}
            <div class="absolute top-1/2 -translate-y-1/2 right-4 text-primary animate-fade-in-up">
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </div>
          {/if}
        </button>
      </div>

      <div class="pt-2">
        <Button 
          type="button" 
          variant="primary" 
          size="md" 
          fullWidth 
          disabled={role === ""}
          on:click={nextStep}
        >
          Lanjutkan
        </Button>
      </div>
      
      <div class="flex items-center gap-4 my-5 w-full">
        <div class="flex-1 h-px bg-border-light"></div>
        <span class="text-label-caps text-muted">Atau lanjutkan dengan</span>
        <div class="flex-1 h-px bg-border-light"></div>
      </div>

      <div class="w-full">
        <GoogleAuthButton />
      </div>

      <p class="text-xs text-center text-secondary pt-1 leading-relaxed">
        Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="text-primary hover:underline font-medium">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="text-primary hover:underline font-medium">Kebijakan Privasi</a>.
      </p>
    </div>
  {:else if step === 2}
    <form 
      novalidate 
      on:submit={handleSubmit} 
      class="space-y-4 w-full"
      in:fly={{ x: 20, duration: 400, delay: 400, easing: cubicOut }}
      out:fade={{ duration: 300 }}
    >
      <Input
        type="text"
        id="name"
        bind:value={name}
        label="Nama Lengkap"
        error={errors.name}
        on:input={() => handleInput("name")}
        placeholder="Nama lengkap Anda"
        autocomplete="name"
        size="md"
        fullWidth
      />

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

      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        bind:value={password}
        label="Kata Sandi"
        error={errors.password}
        on:input={() => handleInput("password")}
        placeholder="Minimal 8 karakter"
        autocomplete="new-password"
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

      <Input
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        bind:value={confirmPassword}
        label="Konfirmasi Sandi"
        error={errors.confirmPassword}
        on:input={() => handleInput("confirmPassword")}
        placeholder="Ketik ulang kata sandi"
        autocomplete="new-password"
        size="md"
        fullWidth
      >
        <button
          slot="suffix"
          type="button"
          class="flex items-center justify-center p-1 cursor-pointer text-muted hover:text-main transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
          on:click={toggleConfirmPasswordVisibility}
          aria-label={showConfirmPassword ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
        >
          {#if showConfirmPassword}
            <EyeOff size={16} />
          {:else}
            <Eye size={16} />
          {/if}
        </button>
      </Input>

      <div class="pt-2 flex items-center gap-3 w-full">
        <Button 
          type="button" 
          variant="outline" 
          size="md" 
          disabled={loading}
          on:click={prevStep}
          class="px-4 shrink-0"
          aria-label="Kembali ke langkah sebelumnya"
        >
          <ArrowLeft size={18} />
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          class="flex-1"
          {loading} 
          disabled={loading}
        >
          Buat Akun Sekarang
        </Button>
      </div>
    </form>
  {/if}
</div>

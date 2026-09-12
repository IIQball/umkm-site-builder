<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { RegisterSchema } from "@/schemas/auth.schema";
  import { Eye, EyeOff, Store, PenTool, CheckCircle2, ArrowLeft, ArrowRight, KeyRound } from "lucide-svelte";
  import Input from "@/components/ui/Input.svelte";
  import Button from "@/components/ui/Button.svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { toast } from "@/lib/toast";

  let step = 1;
  let name = "";
  let email = "";
  let otp = "";
  let password = "";
  let confirmPassword = "";
  let role: "tenant" | "designer" | "" = "";
  
  let errors: Record<string, string> = {};
  let loading = false;
  let showPassword = false;
  let showConfirmPassword = false;

  const togglePasswordVisibility = () => showPassword = !showPassword;
  const toggleConfirmPasswordVisibility = () => showConfirmPassword = !showConfirmPassword;

  const handleInput = (field: string) => {
    if (errors[field]) {
      errors = { ...errors, [field]: "" };
    }
  };

  const nextToStep2 = () => {
    if (role === "") {
      toast.error("Silakan pilih peran akun Anda terlebih dahulu.");
      return;
    }
    step = 2;
  };

  const nextToStep3 = async () => {
    // Validate name and email
    if (name.length < 3) {
      errors.name = "Nama lengkap minimal 3 karakter";
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Format email tidak valid";
      return;
    }

    loading = true;
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok && data.ok) {
        toast.success("Kode OTP telah dikirim ke email Anda.");
        step = 3;
      } else {
        toast.error(data.error || "Gagal mengirim OTP.");
      }
    } catch (err: any) {
      toast.error(err.message || "Kesalahan sistem.");
    } finally {
      loading = false;
    }
  };

  const nextToStep4 = async () => {
    if (otp.length < 6) {
      toast.error("Kode OTP harus 6 digit");
      return;
    }

    loading = true;
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      
      if (res.ok && data.ok) {
        toast.success("Email berhasil diverifikasi!");
        step = 4;
      } else {
        toast.error(data.error || "Kode OTP tidak valid.");
      }
    } catch (err: any) {
      toast.error(err.message || "Kesalahan sistem.");
    } finally {
      loading = false;
    }
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
      
      // If error is related to password
      if (errors.password) toast.error(errors.password);
      else if (errors.confirmPassword) toast.error(errors.confirmPassword);
      
      return false;
    }
    errors = {};
    return true;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) return;

    loading = true;

    try {
      const { error: errResponse } = await authClient.signUp.email({
        email,
        password,
        name,
        role: role as "tenant" | "designer",
      });

      if (errResponse) {
        toast.error(errResponse.message || "Gagal membuat akun");
        return;
      }

      toast.success("Akun berhasil dibuat!");
      if (role === 'designer') {
        window.location.href = '/designer/wallet';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      loading = false;
    }
  };
</script>

<div class="w-full relative min-h-[300px]">
  <!-- Step 1: Role Selection -->
  {#if step === 1}
    <div 
      class="w-full space-y-4 absolute top-0 left-0"
      in:fly={{ x: -20, duration: 400, delay: 400, easing: cubicOut }}
      out:fade={{ duration: 300 }}
    >
      <div class="grid grid-cols-1 gap-3 w-full">
        <!-- Tenant Card -->
        <button 
          type="button"
          class="relative p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group {role === 'tenant' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'border-light bg-card hover:border-muted hover:shadow-xs'}"
          on:click={() => { role = 'tenant'; }}
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors {role === 'tenant' ? 'bg-primary text-white' : 'bg-nested text-muted group-hover:text-main'}">
              <Store size={18} strokeWidth={2.5} />
            </div>
            <div class="pr-6">
              <h3 class="font-medium text-main text-sm">Merchant / Pemilik Toko</h3>
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
          on:click={() => { role = 'designer'; }}
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
          on:click={nextToStep2}
        >
          Lanjutkan
        </Button>
      </div>
      
      <p class="text-xs text-center text-secondary pt-6 leading-relaxed">
        Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="text-primary hover:underline font-medium">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="text-primary hover:underline font-medium">Kebijakan Privasi</a>.
      </p>
    </div>
  
  <!-- Step 2: Name & Email -->
  {:else if step === 2}
    <div 
      class="w-full space-y-4 absolute top-0 left-0"
      in:fly={{ x: 20, duration: 400, delay: 400, easing: cubicOut }}
      out:fade={{ duration: 300 }}
    >
      <div class="text-center mb-4">
        <h3 class="text-main font-bold text-base">Informasi Dasar</h3>
        <p class="text-xs text-secondary mt-1">Masukkan nama dan email untuk akun {role === 'tenant' ? 'Merchant' : 'Designer'} Anda</p>
      </div>

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

      <div class="pt-2 flex items-center gap-3 w-full">
        <Button 
          type="button" 
          variant="outline" 
          size="md" 
          disabled={loading}
          on:click={() => step = 1}
          class="px-4 shrink-0"
          aria-label="Kembali ke langkah sebelumnya"
        >
          <ArrowLeft size={18} />
        </Button>
        <Button 
          type="button" 
          variant="primary" 
          size="md" 
          class="flex-1"
          {loading} 
          disabled={loading || !name || !email}
          on:click={nextToStep3}
        >
          Kirim OTP
        </Button>
      </div>
    </div>

  <!-- Step 3: OTP Verification -->
  {:else if step === 3}
    <div 
      class="w-full space-y-4 absolute top-0 left-0"
      in:fly={{ x: 20, duration: 400, delay: 400, easing: cubicOut }}
      out:fade={{ duration: 300 }}
    >
      <div class="text-center mb-4">
        <div class="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
          <KeyRound size={24} />
        </div>
        <h3 class="text-main font-bold text-base">Verifikasi Email</h3>
        <p class="text-xs text-secondary mt-1 px-4 leading-relaxed">
          Masukkan 6 digit kode OTP yang telah kami kirimkan ke email <strong>{email}</strong>
        </p>
      </div>

      <div class="flex justify-center my-6">
        <Input
          type="text"
          id="otp"
          bind:value={otp}
          placeholder="XXXXXX"
          size="lg"
          maxlength="6"
          class="text-center text-xl tracking-widest font-bold"
        />
      </div>

      <div class="pt-2 flex items-center gap-3 w-full">
        <Button 
          type="button" 
          variant="outline" 
          size="md" 
          disabled={loading}
          on:click={() => step = 2}
          class="px-4 shrink-0"
          aria-label="Kembali ke langkah sebelumnya"
        >
          <ArrowLeft size={18} />
        </Button>
        <Button 
          type="button" 
          variant="primary" 
          size="md" 
          class="flex-1"
          {loading} 
          disabled={loading || otp.length < 6}
          on:click={nextToStep4}
        >
          Verifikasi OTP
        </Button>
      </div>
      <div class="text-center mt-4">
        <button type="button" class="text-xs text-primary hover:underline font-medium" on:click={nextToStep3} disabled={loading}>
          Kirim ulang kode OTP
        </button>
      </div>
    </div>

  <!-- Step 4: Finalize Password -->
  {:else if step === 4}
    <form 
      novalidate 
      on:submit={handleSubmit} 
      class="space-y-4 w-full absolute top-0 left-0"
      in:fly={{ x: 20, duration: 400, delay: 400, easing: cubicOut }}
      out:fade={{ duration: 300 }}
    >
      <div class="text-center mb-4">
        <h3 class="text-main font-bold text-base">Buat Kata Sandi</h3>
        <p class="text-xs text-secondary mt-1">Langkah terakhir, amankan akun Anda</p>
      </div>

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
        <!-- Cannot go back, otherwise OTP validation is bypassed, or maybe we can allow going back but keep verified status. Better just hide back button or make it reset the flow -->
        <Button 
          type="submit" 
          variant="primary" 
          size="md" 
          fullWidth
          {loading} 
          disabled={loading || !password || !confirmPassword}
        >
          Selesaikan Registrasi
        </Button>
      </div>
    </form>
  {/if}
</div>

<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { RegisterSchema } from "@/schemas/auth.schema";
  import { ArrowLeft, KeyRound } from "lucide-svelte";
  import Input from "@/components/ui/Input.svelte";
  import OtpInput from "./OtpInput.svelte";
  import Button from "@/components/ui/Button.svelte";
  import RegisterRoleStep from "./RegisterRoleStep.svelte";
  import RegisterPasswordStep from "./RegisterPasswordStep.svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { toast } from "@/lib/toast";
  import { apiFetch } from "@/lib/api/parse-response";

  let step = 1;
  let name = "";
  let email = "";
  let otp = "";
  let password = "";
  let confirmPassword = "";
  let role: "tenant" | "designer" | "" = "";

  let errors: Record<string, string> = {};
  let loading = false;

  const handleInput = (field: string) => {
    if (errors[field]) errors = { ...errors, [field]: "" };
  };

  const nextToStep2 = () => {
    if (role === "") {
      toast.error("Silakan pilih peran akun Anda terlebih dahulu.");
      return;
    }
    step = 2;
  };

  const nextToStep3 = async () => {
    if (name.length < 3) {
      errors.name = "Nama lengkap minimal 3 karakter";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Format email tidak valid";
      return;
    }

    step = 3;
    loading = true;
    try {
      const result = await apiFetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        fallbackError: 'Gagal mengirim OTP.',
      });
      if (result.success) toast.success(result.message || "Kode OTP telah dikirim ke email Anda.");
      else { toast.error(result.message); step = 2; }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kesalahan sistem.");
      step = 2;
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
      const result = await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        fallbackError: 'Kode OTP tidak valid.',
      });
      if (result.success) {
        toast.success(result.message || "Email berhasil diverifikasi!");
        step = 4;
      } else {
        toast.error(result.message);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kesalahan sistem.");
    } finally {
      loading = false;
    }
  };

  const validateForm = () => {
    const result = RegisterSchema.safeParse({
      name, email, role: role as "tenant" | "designer", password, confirmPassword,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) fieldErrors[fieldName] = issue.message;
      }
      errors = fieldErrors;
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
        email, password, name, role: role as "tenant" | "designer",
      });
      if (errResponse) {
        toast.error(errResponse.message || "Gagal membuat akun");
        return;
      }
      toast.success("Akun berhasil dibuat! Silakan masuk dengan akun baru Anda.");
      await authClient.signOut();
      window.location.href = '/auth/login';
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      loading = false;
    }
  };
</script>

<div class="w-full relative min-h-[300px]">
  {#if step === 1}
    <RegisterRoleStep bind:role onNext={nextToStep2} />
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

      <Input type="text" id="name" bind:value={name} label="Nama Lengkap" error={errors.name} on:input={() => handleInput("name")} placeholder="Nama lengkap Anda" autocomplete="name" size="md" fullWidth />
      <Input type="email" id="email" bind:value={email} label="Email" error={errors.email} on:input={() => handleInput("email")} placeholder="anda@contoh.com" autocomplete="email" size="md" fullWidth />

      <div class="pt-2 flex items-center gap-3 w-full">
        <Button type="button" variant="outline" size="md" disabled={loading} on:click={() => { step = 1; }} class="px-4 shrink-0" aria-label="Kembali ke langkah sebelumnya">
          <ArrowLeft size={18} />
        </Button>
        <Button type="button" variant="primary" size="md" class="flex-1" {loading} disabled={loading || !name || !email} on:click={nextToStep3}>
          Kirim OTP
        </Button>
      </div>
    </div>
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
        <OtpInput bind:value={otp} disabled={loading} />
      </div>

      <div class="pt-2 flex items-center gap-3 w-full">
        <Button type="button" variant="outline" size="md" disabled={loading} on:click={() => { step = 2; }} class="px-4 shrink-0" aria-label="Kembali ke langkah sebelumnya">
          <ArrowLeft size={18} />
        </Button>
        <Button type="button" variant="primary" size="md" class="flex-1" {loading} disabled={loading || otp.length < 6} on:click={nextToStep4}>
          Verifikasi OTP
        </Button>
      </div>
      <div class="text-center mt-4">
        <button type="button" class="text-xs text-primary hover:underline font-medium" on:click={nextToStep3} disabled={loading}>
          Kirim ulang kode OTP
        </button>
      </div>
    </div>
  {:else if step === 4}
    <RegisterPasswordStep bind:password bind:confirmPassword {errors} {loading} onInput={handleInput} onSubmit={handleSubmit} />
  {/if}
</div>

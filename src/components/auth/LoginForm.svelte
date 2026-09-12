<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { Eye, EyeOff } from "lucide-svelte";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";
  import Input from "@/components/ui/Input.svelte";
  import Button from "@/components/ui/Button.svelte";
  import { toast } from "@/lib/toast";

  let email = "";
  let password = "";
  let loading = false;
  let showPassword = false;

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;
  };

  const handleInput = () => {
    // just for cleanup
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email dan kata sandi wajib diisi");
      return;
    }

    loading = true;

    try {
      const { data, error: errResponse } = await authClient.signIn.email({
        email,
        password,
      });

      if (errResponse) {
        toast.error(errResponse.message || "Gagal masuk. Periksa kembali email dan sandi Anda.");
        return;
      }
      
      toast.success("Berhasil masuk!");
      const role = data?.user?.role;
      if (role === 'designer') {
        window.location.href = '/designer/wallet';
      } else if (role === 'superadmin' || role === 'admin') {
        window.location.href = '/admin/users'; // or wherever they should go
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

<div class="w-full">
  <form novalidate on:submit={handleSubmit} class="space-y-4">
    <Input
      type="email"
      id="email"
      bind:value={email}
      label="Email"
      on:input={handleInput}
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
        on:input={handleInput}
        placeholder="Masukkan kata sandi Anda"
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
        <a href="/forgot-password" class="text-xs font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
          Lupa kata sandi?
        </a>
      </div>
    </div>

    <div class="pt-2">
      <Button 
        type="submit" 
        variant="primary" 
        size="md" 
        fullWidth 
        {loading} 
        disabled={loading}
      >
        Masuk
      </Button>
    </div>
  </form>
</div>

<div class="flex items-center gap-4 my-6 w-full">
  <div class="flex-1 h-px bg-border-light"></div>
  <span class="text-label-caps text-muted">Atau lanjutkan dengan</span>
  <div class="flex-1 h-px bg-border-light"></div>
</div>

<div class="w-full">
  <GoogleAuthButton />
</div>

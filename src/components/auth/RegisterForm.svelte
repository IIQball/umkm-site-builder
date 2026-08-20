<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import GoogleAuthButton from "./GoogleAuthButton.svelte";

  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let role = "tenant";
  let error = "";
  let loading = false;
  let showPassword = false;
  let showConfirmPassword = false;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error = "";

    if (password !== confirmPassword) {
      error = "Kata sandi tidak cocok";
      return;
    }

    if (password.length < 8) {
      error = "Kata sandi minimal 8 karakter";
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
        error = errResponse.message || "Gagal membuat akun.";
        return; 
      }

      // Jika benar-benar sukses, baru arahkan ke login
      window.location.href = "/auth/login";
      
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    } finally {
      loading = false;
    }
  };
</script>

<form on:submit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="alert alert-error shadow-sm">
      <span>{error}</span>
    </div>
  {/if}

  <div class="form-control">
    <label class="label" for="name">
      <span class="label-text font-medium">Nama Lengkap</span>
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      placeholder="Nama lengkap Anda"
      class="input input-bordered w-full focus:input-primary"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="role">
      <span class="label-text font-medium">Peran (Role)</span>
    </label>
    <select
      id="role"
      bind:value={role}
      class="select select-bordered w-full focus:select-primary"
      required
    >
      <option value="tenant">Pemilik Toko (Tenant)</option>
      <option value="designer">Desainer (Designer)</option>
      <option value="admin">Administrator (Admin)</option>
    </select>
  </div>

  <div class="form-control">
    <label class="label" for="email">
      <span class="label-text font-medium">Email</span>
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      placeholder="anda@contoh.com"
      class="input input-bordered w-full focus:input-primary"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="password">
      <span class="label-text font-medium">Kata Sandi</span>
    </label>
    <div class="relative">
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        value={password}
        on:input={(e) => password = e.currentTarget.value}
        placeholder="Minimal 8 karakter"
        class="input input-bordered w-full focus:input-primary pr-10"
        required
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        on:click={() => (showPassword = !showPassword)}
        aria-label="Toggle password visibility"
      >
        {#if showPassword}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-base-content/60 hover:text-base-content">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-base-content/60 hover:text-base-content">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <div class="form-control">
    <label class="label" for="confirmPassword">
      <span class="label-text font-medium">Konfirmasi Kata Sandi</span>
    </label>
    <div class="relative">
      <input
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        value={confirmPassword}
        on:input={(e) => confirmPassword = e.currentTarget.value}
        placeholder="Konfirmasi kata sandi"
        class="input input-bordered w-full focus:input-primary pr-10"
        required
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        on:click={() => (showConfirmPassword = !showConfirmPassword)}
        aria-label="Toggle confirm password visibility"
      >
        {#if showConfirmPassword}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-base-content/60 hover:text-base-content">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-base-content/60 hover:text-base-content">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <div class="form-control pt-2">
    <button type="submit" class="btn btn-primary w-full" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
        Memproses...
      {:else}
        Buat Akun
      {/if}
    </button>
  </div>

  <div class="divider my-6">ATAU</div>

  <GoogleAuthButton />

  <p class="text-xs text-center text-base-content/70 pt-2">
    Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="link link-primary">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="link link-primary">Kebijakan Privasi</a> kami.
  </p>
</form>

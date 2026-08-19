<script lang="ts">
  import { authClient } from "@/lib/auth-client";

  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let loading = false;

  async function handleSubmit(e: Event) {
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
      });

      if (errResponse) {
        error = errResponse.message || "Gagal membuat akun.";
        return; 
      }

      // Jika benar-benar sukses, baru arahkan ke beranda
      window.location.href = "/";
      
    } catch (err: any) {
      error = err.message || "Terjadi kesalahan sistem";
    } finally {
      loading = false;
    }
  }
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
    <input
      type="password"
      id="password"
      bind:value={password}
      placeholder="Minimal 8 karakter"
      class="input input-bordered w-full focus:input-primary"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="confirmPassword">
      <span class="label-text font-medium">Konfirmasi Kata Sandi</span>
    </label>
    <input
      type="password"
      id="confirmPassword"
      bind:value={confirmPassword}
      placeholder="Konfirmasi kata sandi"
      class="input input-bordered w-full focus:input-primary"
      required
    />
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

  <p class="text-xs text-center text-base-content/70 pt-2">
    Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="link link-primary">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="link link-primary">Kebijakan Privasi</a> kami.
  </p>
</form>

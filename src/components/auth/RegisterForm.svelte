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
      await authClient.signUp.email({
        email,
        password,
        name,
      });

      window.location.href = "/";
    } catch (err: any) {
      error = err.message || "Gagal membuat akun";
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="alert alert-error">
      <span>{error}</span>
    </div>
  {/if}

  <div class="form-control">
    <label class="label" for="name">
      <span class="label-text">Nama Lengkap</span>
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      placeholder="Nama lengkap Anda"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="email">
      <span class="label-text">Email</span>
    </label>
    <input
      type="email"
      id="email"
      bind:value={email}
      placeholder="anda@contoh.com"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="password">
      <span class="label-text">Kata Sandi</span>
    </label>
    <input
      type="password"
      id="password"
      bind:value={password}
      placeholder="Minimal 8 karakter"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="confirmPassword">
      <span class="label-text">Konfirmasi Kata Sandi</span>
    </label>
    <input
      type="password"
      id="confirmPassword"
      bind:value={confirmPassword}
      placeholder="Konfirmasi kata sandi"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control mt-6">
    <button type="submit" class="btn btn-primary" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner"></span>
        Membuat akun...
      {:else}
        Buat Akun
      {/if}
    </button>
  </div>

  <p class="text-xs text-center text-base-content/70">
    Dengan membuat akun, Anda menyetujui Syarat Layanan dan Kebijakan Privasi kami.
  </p>
</form>

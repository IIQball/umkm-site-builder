<script lang="ts">
  import { authClient } from "@/lib/auth-client";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    loading = true;

    try {
      await authClient.signIn.email({
        email,
        password,
      });

      window.location.href = "/";
    } catch (err: any) {
      error = err.message || "Gagal masuk";
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
      placeholder="Masukkan kata sandi"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control mt-6">
    <button type="submit" class="btn btn-primary" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner"></span>
        Masuk...
      {:else}
        Masuk
      {/if}
    </button>
  </div>

  <div class="text-center">
    <a href="#" class="link link-hover text-sm">Lupa kata sandi?</a>
  </div>
</form>

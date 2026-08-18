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
      error = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      error = "Password must be at least 8 characters";
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
      error = err.message || "Failed to create account";
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
      <span class="label-text">Full Name</span>
    </label>
    <input
      type="text"
      id="name"
      bind:value={name}
      placeholder="Your full name"
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
      placeholder="you@example.com"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="password">
      <span class="label-text">Password</span>
    </label>
    <input
      type="password"
      id="password"
      bind:value={password}
      placeholder="Minimum 8 characters"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control">
    <label class="label" for="confirmPassword">
      <span class="label-text">Confirm Password</span>
    </label>
    <input
      type="password"
      id="confirmPassword"
      bind:value={confirmPassword}
      placeholder="Confirm your password"
      class="input input-bordered w-full"
      required
    />
  </div>

  <div class="form-control mt-6">
    <button type="submit" class="btn btn-primary" disabled={loading}>
      {#if loading}
        <span class="loading loading-spinner"></span>
        Creating account...
      {:else}
        Create Account
      {/if}
    </button>
  </div>

  <p class="text-xs text-center text-base-content/70">
    By creating an account, you agree to our Terms of Service and Privacy Policy.
  </p>
</form>

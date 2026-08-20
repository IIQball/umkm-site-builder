<script lang="ts">
  import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-svelte';

  type ValidationStatus = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
  type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

  let value = '';
  let status: ValidationStatus = 'idle';
  let message = '';
  let submitStatus: SubmitStatus = 'idle';
  let submitError = '';
  let debounceTimer: ReturnType<typeof setTimeout>;

  const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 63;
  const DEBOUNCE_MS = 300;

  $: isSubmittable = status === 'available' && submitStatus !== 'submitting';

  const validateLocally = (input: string): string | null => {
    if (input.length < MIN_LENGTH) return `Minimal ${MIN_LENGTH} karakter`;
    if (input.length > MAX_LENGTH) return `Maksimal ${MAX_LENGTH} karakter`;
    if (!SUBDOMAIN_PATTERN.test(input)) return 'Hanya huruf kecil, angka, dan tanda hubung';
    if (input.startsWith('-') || input.endsWith('-')) return 'Tidak boleh diawali/diakhiri tanda hubung';
    return null;
  };

  const checkAvailability = async (subdomain: string) => {
    status = 'checking';
    message = '';

    try {
      const res = await fetch('/api/stores/check-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain }),
      });

      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await res.json();

      if (!data.ok) {
        status = 'invalid';
        message = data.error?.message ?? 'Validasi gagal';
        return;
      }

      if (data.data.available) {
        status = 'available';
        message = 'Subdomain tersedia';
      } else {
        status = 'taken';
        message = 'Subdomain sudah digunakan';
      }
    } catch {
      status = 'error';
      message = 'Gagal memeriksa ketersediaan';
    }
  };

  const onInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    value = raw;
    submitStatus = 'idle';
    submitError = '';

    clearTimeout(debounceTimer);

    if (!value) {
      status = 'idle';
      message = '';
      return;
    }

    const localError = validateLocally(value);
    if (localError) {
      status = 'invalid';
      message = localError;
      return;
    }

    status = 'typing';
    message = '';
    debounceTimer = setTimeout(() => checkAvailability(value), DEBOUNCE_MS);
  };

  const registerSubdomain = async () => {
    if (!isSubmittable) return;

    submitStatus = 'submitting';
    submitError = '';

    try {
      const res = await fetch('/api/stores/register-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: value }),
      });

      if (res.status === 401) {
        window.location.href = '/auth/login';
        return;
      }

      const data = await res.json();

      if (!data.ok) {
        submitStatus = 'error';
        submitError = data.error?.message ?? 'Gagal mendaftarkan subdomain';

        if (data.error?.code === 'DUPLICATE_KEY') {
          status = 'taken';
          message = 'Subdomain sudah digunakan';
        }
        return;
      }

      submitStatus = 'success';
      window.location.href = '/onboarding/store-setup';
    } catch {
      submitStatus = 'error';
      submitError = 'Terjadi kesalahan. Silakan coba lagi.';
    }
  }
</script>

<div class="flex flex-col gap-6">
  <div class="form-control w-full">
    <label class="label" for="subdomain-input">
      <span class="label-text font-medium">Subdomain Toko</span>
    </label>

    <div class="join w-full">
      <input
        id="subdomain-input"
        type="text"
        class="input input-bordered join-item w-full"
        class:input-success={status === 'available'}
        class:input-error={status === 'taken' || status === 'invalid' || status === 'error'}
        placeholder="nama-toko"
        maxlength={MAX_LENGTH}
        autocomplete="off"
        spellcheck="false"
        disabled={submitStatus === 'submitting'}
        {value}
        on:input={onInput}
      />
      <span class="join-item flex items-center bg-base-200 px-3 text-sm text-base-content/60">
        .umkm.site
      </span>
    </div>

    <label class="label" for="subdomain-input">
      {#if status === 'checking'}
        <span class="label-text-alt flex items-center gap-1 text-info">
          <Loader2 size={14} class="animate-spin" />
          Memeriksa ketersediaan...
        </span>
      {:else if status === 'available'}
        <span class="label-text-alt flex items-center gap-1 text-success">
          <CheckCircle size={14} />
          {message}
        </span>
      {:else if status === 'taken'}
        <span class="label-text-alt flex items-center gap-1 text-error">
          <XCircle size={14} />
          {message}
        </span>
      {:else if status === 'invalid'}
        <span class="label-text-alt flex items-center gap-1 text-warning">
          <AlertCircle size={14} />
          {message}
        </span>
      {:else if status === 'error'}
        <span class="label-text-alt flex items-center gap-1 text-error">
          <AlertCircle size={14} />
          {message}
        </span>
      {:else if status === 'typing'}
        <span class="label-text-alt text-base-content/40">
          Mengetik...
        </span>
      {:else}
        <span class="label-text-alt text-base-content/40">
          Contoh: kopi-budi, toko-sari
        </span>
      {/if}
    </label>
  </div>

  {#if submitError}
    <div class="alert alert-error text-sm">
      <AlertCircle size={16} />
      <span>{submitError}</span>
    </div>
  {/if}

  <div class="flex flex-col gap-2">
    <button
      type="button"
      class="btn btn-primary w-full"
      disabled={!isSubmittable}
      on:click={registerSubdomain}
    >
      {#if submitStatus === 'submitting'}
        <Loader2 size={18} class="animate-spin" />
        Mendaftarkan...
      {:else}
        Lanjutkan
      {/if}
    </button>
    <a href="/" class="btn btn-ghost w-full">Kembali</a>
  </div>
</div>

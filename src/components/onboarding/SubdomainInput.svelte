<script lang="ts">
  import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-svelte';

  export let value = '';
  export let onValid: ((subdomain: string) => void) | undefined = undefined;

  type Status = 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';

  let status: Status = 'idle';
  let message = '';
  let debounceTimer: ReturnType<typeof setTimeout>;

  const SUBDOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 63;
  const DEBOUNCE_MS = 300;

  function validateLocally(input: string): string | null {
    if (input.length < MIN_LENGTH) return `Minimal ${MIN_LENGTH} karakter`;
    if (input.length > MAX_LENGTH) return `Maksimal ${MAX_LENGTH} karakter`;
    if (!SUBDOMAIN_PATTERN.test(input)) return 'Hanya huruf kecil, angka, dan tanda hubung';
    if (input.startsWith('-') || input.endsWith('-')) return 'Tidak boleh diawali/diakhiri tanda hubung';
    return null;
  }

  async function checkAvailability(subdomain: string) {
    status = 'checking';
    message = '';

    try {
      const res = await fetch('/api/stores/check-subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain }),
      });

      const data = await res.json();

      if (!data.ok) {
        status = 'invalid';
        message = data.error?.message ?? 'Validasi gagal';
        return;
      }

      if (data.data.available) {
        status = 'available';
        message = 'Subdomain tersedia';
        onValid?.(subdomain);
      } else {
        status = 'taken';
        message = 'Subdomain sudah digunakan';
      }
    } catch {
      status = 'error';
      message = 'Gagal memeriksa ketersediaan';
    }
  }

  function onInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    value = raw;

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
  }
</script>

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

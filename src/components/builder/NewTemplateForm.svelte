<script lang="ts">
  import { Sparkles, ArrowLeft, ArrowRight, Loader2, FileText, Tag } from 'lucide-svelte';

  export let backHref = '/designer/templates';

  let name = '';
  let description = '';
  let priceDisplay = '50.000';
  let numericPriceState = 50000;
  let loading = false;
  let error: string | null = null;

  $: pricePreview = numericPriceState > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(numericPriceState)}` : 'Gratis';

  /** Auto-format visual masking while typing */
  const handlePriceInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const rawDigits = target.value.replace(/\D/g, '');
    // Format visual untuk ditampilkan ke user
    target.value = rawDigits ? new Intl.NumberFormat('id-ID').format(Number(rawDigits)) : '';
    priceDisplay = target.value;
    // Simpan raw integer murni ke variabel state payload
    numericPriceState = Number(rawDigits) || 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name.trim()) {
      error = 'Nama template wajib diisi';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch('/api/designer/templates/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          price: numericPriceState,
        }),
      });

      // 401 → sesi habis / belum login
      if (response.status === 401) {
        window.location.href = '/auth/login?redirect=/builder/new';
        return;
      }

      const result = await response.json();

      if (!response.ok || !result.ok || !result.data?.id) {
        throw new Error(result.error?.message || 'Gagal membuat draft template');
      }

      window.location.href = `/builder/${result.data.id}`;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.';
      loading = false;
    }
  };
</script>

<div
  class="w-full max-w-lg bg-base-100 border border-base-200 rounded-2xl shadow-sm
         text-base-content transition-colors"
>
  <!-- Card Header -->
  <div class="flex items-center gap-4 p-6 pb-5 border-b border-base-200">
    <div
      class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60
             text-blue-600 dark:text-blue-400
             flex items-center justify-center
             border border-blue-100 dark:border-blue-900/40 flex-shrink-0"
    >
      <Sparkles size={20} />
    </div>
    <div class="min-w-0">
      <h1 class="text-base font-bold text-base-content tracking-tight leading-tight">
        Buat Template Baru
      </h1>
      <p class="text-xs text-base-content/50 mt-0.5 leading-snug">
        Isi metadata awal — kamu bisa ubah kapan saja di editor
      </p>
    </div>
  </div>

  <!-- Form body -->
  <form on:submit={handleSubmit} class="p-6 space-y-5" novalidate>
    <!-- Error alert -->
    {#if error}
      <div
        class="flex items-start gap-2.5 p-3.5 rounded-xl
               bg-rose-500/8 border border-rose-500/20 text-rose-600 dark:text-rose-400"
      >
        <span class="material-symbols-outlined text-[18px] flex-shrink-0 mt-px">error</span>
        <p class="text-xs leading-relaxed">{error}</p>
      </div>
    {/if}

    <!-- Name -->
    <div class="space-y-1.5">
      <label for="tmpl-name" class="flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
        <Tag size={12} class="text-blue-500" />
        Nama Template
        <span class="text-rose-500">*</span>
      </label>
      <input
        id="tmpl-name"
        type="text"
        bind:value={name}
        required
        autocomplete="off"
        placeholder="Contoh: Template Resto dan Kuliner Nusantara"
        class="w-full px-3.5 py-2.5 bg-base-200/50 border border-base-300
               rounded-xl text-sm text-base-content placeholder-base-content/30
               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
               transition-all"
      />
    </div>

    <!-- Description -->
    <div class="space-y-1.5">
      <label for="tmpl-desc" class="flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
        <FileText size={12} class="text-blue-500" />
        Deskripsi
        <span class="text-base-content/40 font-normal">(Opsional)</span>
      </label>
      <textarea
        id="tmpl-desc"
        bind:value={description}
        rows="3"
        placeholder="Jelaskan jenis usaha yang cocok dan fitur utama template ini..."
        class="w-full px-3.5 py-2.5 bg-base-200/50 border border-base-300
               rounded-xl text-sm text-base-content placeholder-base-content/30
               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
               transition-all resize-y"
      ></textarea>
    </div>

    <!-- Price IDR -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label for="tmpl-price" class="text-xs font-semibold text-base-content/80">
          Harga Jual (IDR)
        </label>
        <span
          class="text-xs font-bold font-mono
                 {numericPriceState > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-base-content/40'}"
        >
          {pricePreview}
        </span>
      </div>
      <div class="relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/40 pointer-events-none select-none">
          Rp
        </span>
        <input
          id="tmpl-price"
          type="text"
          inputmode="numeric"
          value={priceDisplay}
          on:input={handlePriceInput}
          placeholder="50.000"
          class="w-full pl-9 pr-3.5 py-2.5 bg-base-200/50 border border-base-300
                 rounded-xl text-sm text-base-content placeholder-base-content/30 font-mono
                 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
                 transition-all"
        />
      </div>
      <p class="text-[11px] text-base-content/40 leading-snug">
        Masukkan 0 untuk mempublikasikan template secara gratis.
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between gap-3 pt-2 border-t border-base-200">
      <a
        href={backHref}
        class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold
               text-base-content/60 hover:text-base-content
               bg-base-200 hover:bg-base-300 rounded-xl transition-colors"
      >
        <ArrowLeft size={13} />
        Kembali
      </a>

      <button
        type="submit"
        disabled={loading}
        class="flex items-center gap-2 px-5 py-2.5
               bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
               disabled:opacity-50 disabled:cursor-not-allowed
               text-white rounded-xl text-xs font-semibold
               shadow-sm shadow-blue-600/20 transition-all"
      >
        {#if loading}
          <Loader2 size={13} class="animate-spin" />
          <span>Menyiapkan Editor...</span>
        {:else}
          <span>Lanjut ke Visual Editor</span>
          <ArrowRight size={13} />
        {/if}
      </button>
    </div>
  </form>
</div>

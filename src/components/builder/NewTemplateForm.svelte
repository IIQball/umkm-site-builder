<script lang="ts">
  import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    Loader2,
    DollarSign,
    FileText,
    Tag,
  } from 'lucide-svelte';

  let name = '';
  let description = '';
  let priceInput = '50000';
  let loading = false;
  let error: string | null = null;

  $: priceNumber = Math.max(0, parseInt(priceInput.replace(/\D/g, ''), 10) || 0);
  $: formattedPrice = priceNumber > 0 ? `Rp ${priceNumber.toLocaleString('id-ID')}` : 'Gratis (Rp 0)';

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name.trim()) {
      error = 'Nama template wajib diisi';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch('/api/templates/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok || !result.data?.id) {
        throw new Error(result.error?.message || 'Gagal membuat draft template');
      }

      window.location.href = `/builder/${result.data.id}`;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat template';
      loading = false;
    }
  };
</script>

<div class="w-full max-w-xl bg-base-100 border border-base-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-base-content transition-colors">
  <!-- Header -->
  <div class="flex items-center gap-3.5 mb-6 pb-6 border-b border-base-200 dark:border-slate-800">
    <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 shadow-sm flex-shrink-0">
      <Sparkles size={22} />
    </div>
    <div>
      <h1 class="text-lg sm:text-xl font-bold text-base-content tracking-tight">Buat Template Baru</h1>
      <p class="text-xs text-base-content/65 mt-0.5">Isi metadata awal untuk memulai mendesain di Visual Editor</p>
    </div>
  </div>

  <!-- Error Alert -->
  {#if error}
    <div class="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5">
      <span class="text-sm font-bold">!</span>
      <p class="leading-relaxed">{error}</p>
    </div>
  {/if}

  <!-- Form -->
  <form on:submit={handleSubmit} class="space-y-5">
    <!-- Template Name -->
    <div>
      <label for="template-name" class="flex items-center gap-1.5 text-xs font-semibold text-base-content/80 mb-1.5">
        <Tag size={13} class="text-blue-600 dark:text-blue-400" />
        <span>Nama Template <span class="text-rose-500">*</span></span>
      </label>
      <input
        id="template-name"
        type="text"
        bind:value={name}
        required
        placeholder="Contoh: Template Resto dan Kuliner Nusantara"
        class="w-full px-3.5 py-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      />
    </div>

    <!-- Description -->
    <div>
      <label for="template-desc" class="flex items-center gap-1.5 text-xs font-semibold text-base-content/80 mb-1.5">
        <FileText size={13} class="text-blue-600 dark:text-blue-400" />
        <span>Deskripsi Template (Opsional)</span>
      </label>
      <textarea
        id="template-desc"
        bind:value={description}
        rows="3"
        placeholder="Jelaskan jenis usaha yang cocok dan fitur utama dari template ini..."
        class="w-full px-3.5 py-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
      />
    </div>

    <!-- Price -->
    <div>
      <div class="flex items-center justify-between mb-1.5">
        <label for="template-price" class="flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
          <DollarSign size={13} class="text-blue-600 dark:text-blue-400" />
          <span>Harga Jual Template (IDR)</span>
        </label>
        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
          {formattedPrice}
        </span>
      </div>
      <div class="relative">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-base-content/40">
          Rp
        </span>
        <input
          id="template-price"
          type="number"
          min="0"
          step="1000"
          bind:value={priceInput}
          placeholder="50000"
          class="w-full pl-10 pr-3.5 py-2.5 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
        />
      </div>
      <p class="text-[11px] text-base-content/50 mt-1">Masukkan 0 jika ingin membuat template gratis untuk UMKM.</p>
    </div>

    <!-- Actions -->
    <div class="pt-4 flex items-center justify-between gap-3 border-t border-base-200 dark:border-slate-800">
      <a
        href="/"
        class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-base-content/70 hover:text-base-content bg-base-200 hover:bg-base-300 rounded-xl transition-colors"
      >
        <ArrowLeft size={13} />
        <span>Kembali</span>
      </a>

      <button
        type="submit"
        disabled={loading}
        class="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer"
      >
        {#if loading}
          <Loader2 size={14} class="animate-spin" />
          <span>Menyiapkan Editor...</span>
        {:else}
          <span>Lanjut ke Visual Editor</span>
          <ArrowRight size={14} />
        {/if}
      </button>
    </div>
  </form>
</div>

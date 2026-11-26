<script lang="ts">
  import { Badge } from '@/components/ui';
  import { HEX_COLOR_REGEX } from '@/lib/validators/ai-logo';

  export let hasBackground: boolean = true;
  export let backgroundColor: string = '#FFFFFF';

  const QUICK_BG_OPTIONS = [
    { label: 'Putih', hex: '#FFFFFF', isLight: true },
    { label: 'Hitam', hex: '#000000', isLight: false },
    { label: 'Krem Hangat', hex: '#F7F4EE', isLight: true },
    { label: 'Abu Lembut', hex: '#F3F4F6', isLight: true },
    { label: 'Gelap Navy', hex: '#0F172A', isLight: false },
  ];

  function setBgColor(hex: string) {
    backgroundColor = hex.toUpperCase();
    hasBackground = true;
  }

  function handleCustomColorInput(val: string) {
    const trimmed = val.trim().toUpperCase();
    if (HEX_COLOR_REGEX.test(trimmed)) {
      backgroundColor = trimmed;
    }
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">
    <span class="block text-label-caps text-muted">
      Latar Belakang Logo (Background) <span class="text-error">*</span>
    </span>
    <Badge variant={hasBackground ? 'primary' : 'slate'} size="sm" dot={false}>
      {hasBackground ? 'Background 1 Warna' : 'Tanpa Background'}
    </Badge>
  </div>

  <!-- Pilihan Mode Background -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- Opsi 1: Pakai Background -->
    <div
      role="button"
      tabindex="0"
      class="p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between {hasBackground
        ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
        : 'border-light bg-nested hover:bg-card'}"
      on:click={() => (hasBackground = true)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (hasBackground = true)}
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
          <div
            class="w-6 h-6 rounded-lg border border-light/80 shadow-xs flex items-center justify-center"
            style="background-color: {backgroundColor};"
          >
            {#if backgroundColor === '#FFFFFF'}
              <span class="w-2 h-2 rounded-full bg-slate-300"></span>
            {/if}
          </div>
          <span class="font-heading font-semibold text-xs text-main">Pakai Background</span>
        </div>
        {#if hasBackground}
          <div class="w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center text-micro font-bold shadow-xs">
            ✓
          </div>
        {/if}
      </div>
      <p class="text-2xs text-secondary leading-snug">
        Latar belakang 1 warna solid. Default putih, bebas disesuaikan.
      </p>
    </div>

    <!-- Opsi 2: Tanpa Background (Transparan) -->
    <div
      role="button"
      tabindex="0"
      class="p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between {!hasBackground
        ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-xs'
        : 'border-light bg-nested hover:bg-card'}"
      on:click={() => (hasBackground = false)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (hasBackground = false)}
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
          <!-- Checkerboard Pattern Mockup -->
          <div
            class="w-6 h-6 rounded-lg border border-light/80 shadow-xs flex items-center justify-center bg-[conic-gradient(#cbd5e1_90deg,#ffffff_90deg_180deg,#cbd5e1_180deg_270deg,#ffffff_270deg)] bg-[size:8px_8px]"
          ></div>
          <span class="font-heading font-semibold text-xs text-main">Tanpa Background</span>
        </div>
        {#if !hasBackground}
          <div class="w-4 h-4 rounded-full bg-primary text-primary-content flex items-center justify-center text-micro font-bold shadow-xs">
            ✓
          </div>
        {/if}
      </div>
      <p class="text-2xs text-secondary leading-snug">
        Transparan tanpa warna latar. Ikon logo langsung terisolasi bersih.
      </p>
    </div>
  </div>

  <!-- Pemilih Warna Background (Tampil jika Pakai Background) -->
  {#if hasBackground}
    <div class="p-3 bg-nested rounded-2xl border border-light space-y-3">
      <div class="flex items-center justify-between text-2xs text-secondary font-medium">
        <span>Atur Warna Background:</span>
        <span class="font-mono font-bold text-main">{backgroundColor}</span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        {#each QUICK_BG_OPTIONS as opt}
          {@const isSelected = backgroundColor === opt.hex}
          <button
            type="button"
            class="px-2.5 py-1 text-2xs rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer {isSelected
              ? 'border-primary ring-2 ring-primary/30 font-bold bg-card shadow-2xs text-main'
              : 'border-light bg-card hover:bg-nested text-secondary'}"
            on:click={() => setBgColor(opt.hex)}
          >
            <span
              class="w-3.5 h-3.5 rounded-full border border-light shadow-2xs"
              style="background-color: {opt.hex};"
            ></span>
            <span>{opt.label}</span>
          </button>
        {/each}

        <!-- Custom Color Picker -->
        <div class="flex items-center gap-1.5 ml-auto">
          <input
            type="color"
            value={backgroundColor}
            on:input={(e) => setBgColor(e.currentTarget.value)}
            class="w-7 h-7 rounded-lg cursor-pointer border border-light p-0.5 bg-card"
            title="Pilih warna latar bebas"
          />
          <input
            type="text"
            value={backgroundColor}
            on:change={(e) => handleCustomColorInput(e.currentTarget.value)}
            maxlength="7"
            class="w-20 px-2 py-1 text-2xs font-mono font-bold rounded-lg border border-light bg-card text-main uppercase"
          />
        </div>
      </div>
    </div>
  {/if}
</div>

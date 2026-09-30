<script lang="ts">
  export let preset: string = '';
  export let stickerText: string = 'PROMO TERBATAS!';
  export let contrastCardBg: string = 'slate-950';
  export let contrastBadgeText: string = 'Pendaftaran Terbatas';
  export let contrastTitleText: string = 'Kuota Tersisa 4 Peserta';
  export let contrastDescText: string = 'Mendapatkan modul lengkap, sertifikat kelulusan, dan sesi praktik langsung bersama mentor berpengalaman.';
  export let founderRole: string = 'Pendiri & Artisan';
  export let founderTitle: string = 'Pengrajin Resep Asli';
  export let stats: Array<{ value: string; label: string }> = [];
  export let onPropChange: (key: string, value: unknown) => void;

  $: currentStats =
    Array.isArray(stats) && stats.length === 3
      ? stats
      : [
          { value: '25.000+', label: 'Porsi Terkirim' },
          { value: '4.9 / 5.0', label: 'Kepuasan Konsumen' },
          { value: '100%', label: 'Higienis & Halal' },
        ];

  function updateStat(index: number, field: 'value' | 'label', val: string) {
    const next = currentStats.map((s, i) => (i === index ? { ...s, [field]: val } : s));
    onPropChange('stats', next);
  }
</script>

{#if preset === 'sticker_badge_playful'}
  <div class="space-y-2 pt-3 border-t border-base-300">
    <label for="sticker-text" class="block font-semibold text-xs text-base-content/80 mb-0.5">
      Teks Stiker Promo Melayang
    </label>
    <input
      id="sticker-text"
      type="text"
      value={stickerText}
      on:input={(e) => onPropChange('stickerText', e.currentTarget.value)}
      class="input input-bordered input-xs w-full font-bold"
      placeholder="PROMO TERBATAS!"
    />
  </div>
{:else if preset === 'dual_contrast_split'}
  <div class="space-y-3 pt-3 border-t border-base-300">
    <span class="block font-semibold text-xs text-base-content/80">
      Kustomisasi Kartu Pendaftaran Kuota
    </span>

    <div>
      <label for="contrast-bg" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Warna Latar Sisi Kontras
      </label>
      <select
        id="contrast-bg"
        value={contrastCardBg || 'slate-950'}
        on:change={(e) => onPropChange('contrastCardBg', e.currentTarget.value)}
        class="select select-bordered select-xs w-full"
      >
        <option value="slate-950">Hitam Pekat (Slate 950)</option>
        <option value="primary">Warna Utama Brand (Primary)</option>
        <option value="secondary">Warna Sekunder (Secondary)</option>
        <option value="emerald-950">Hijau Gelap (Emerald 950)</option>
        <option value="blue-950">Biru Gelap (Blue 950)</option>
        <option value="amber-950">Amber Gelap (Amber 950)</option>
        <option value="purple-950">Ungu Gelap (Purple 950)</option>
        <option value="zinc-900">Abu Abu Gelap (Zinc 900)</option>
      </select>
    </div>

    <div>
      <label for="contrast-badge" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Lencana Kuota
      </label>
      <input
        id="contrast-badge"
        type="text"
        value={contrastBadgeText}
        on:input={(e) => onPropChange('contrastBadgeText', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Pendaftaran Terbatas"
      />
    </div>

    <div>
      <label for="contrast-title" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Judul Kuota
      </label>
      <input
        id="contrast-title"
        type="text"
        value={contrastTitleText}
        on:input={(e) => onPropChange('contrastTitleText', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-bold"
        placeholder="Kuota Tersisa 4 Peserta"
      />
    </div>

    <div>
      <label for="contrast-desc" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Deskripsi / Fasilitas Kuota
      </label>
      <textarea
        id="contrast-desc"
        rows="2"
        value={contrastDescText}
        on:input={(e) => onPropChange('contrastDescText', e.currentTarget.value)}
        class="textarea textarea-bordered textarea-xs w-full"
        placeholder="Mendapatkan modul lengkap..."
      ></textarea>
    </div>
  </div>
{:else if preset === 'brand_story_founder'}
  <div class="space-y-2.5 pt-3 border-t border-base-300">
    <span class="block font-semibold text-xs text-base-content/80">
      Kustomisasi Label Pendiri & Artisan
    </span>

    <div>
      <label for="founder-role" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Nama Peran / Posisi
      </label>
      <input
        id="founder-role"
        type="text"
        value={founderRole}
        on:input={(e) => onPropChange('founderRole', e.currentTarget.value)}
        class="input input-bordered input-xs w-full font-bold"
        placeholder="Pendiri & Artisan"
      />
    </div>

    <div>
      <label for="founder-title" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Keterangan / Keahlian
      </label>
      <input
        id="founder-title"
        type="text"
        value={founderTitle}
        on:input={(e) => onPropChange('founderTitle', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Pengrajin Resep Asli"
      />
    </div>
  </div>
{:else if preset === 'split_stat_counter'}
  <div class="space-y-3 pt-3 border-t border-base-300">
    <span class="block font-semibold text-xs text-base-content/80">
      Kustomisasi Metrik Statistik Angka (3 Item)
    </span>

    <div class="space-y-2">
      {#each currentStats as stat, i (i)}
        <div class="grid grid-cols-2 gap-2 p-2 rounded-xl bg-base-200/50 border border-base-300">
          <div>
            <label for="stat-val-{i}" class="block text-[10px] text-base-content/60 mb-0.5">Angka / Nilai #{i + 1}</label>
            <input
              id="stat-val-{i}"
              type="text"
              value={stat.value}
              on:input={(e) => updateStat(i, 'value', e.currentTarget.value)}
              class="input input-bordered input-xs w-full font-bold"
              placeholder="25.000+"
            />
          </div>
          <div>
            <label for="stat-lbl-{i}" class="block text-[10px] text-base-content/60 mb-0.5">Label Keterangan #{i + 1}</label>
            <input
              id="stat-lbl-{i}"
              type="text"
              value={stat.label}
              on:input={(e) => updateStat(i, 'label', e.currentTarget.value)}
              class="input input-bordered input-xs w-full"
              placeholder="Porsi Terkirim"
            />
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

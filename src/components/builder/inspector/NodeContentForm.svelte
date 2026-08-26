<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import NodeTitleInspector from './nodes/NodeTitleInspector.svelte';
  import NodeLogoInspector from './nodes/NodeLogoInspector.svelte';
  import NodeNavLinksInspector from './nodes/NodeNavLinksInspector.svelte';
  import NodeImageInspector from './nodes/NodeImageInspector.svelte';
  import NodeCtaInspector from './nodes/NodeCtaInspector.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
  $: subtitle = (section.props?.subtitle as string) ?? '';
</script>

<div class="space-y-4 text-xs">
  {#if nodeId === 'announcement'}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-base-content/80">Tampilkan Baris Pengumuman</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showAnnouncement}
            on:change={(e) => onPropChange('showAnnouncement', e.currentTarget.checked)}
            class="sr-only peer"
          />
          <div class="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div>
        <label for="node-announcement-text" class="block font-semibold text-base-content/80 mb-1">Teks Pengumuman</label>
        <input
          id="node-announcement-text"
          type="text"
          value={section.props?.announcementText ?? ''}
          on:input={(e) => onPropChange('announcementText', e.currentTarget.value)}
          class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500"
          placeholder="Diskon 20% khusus hari ini"
        />
      </div>
    </div>

  {:else if nodeId === 'logo'}
    <NodeLogoInspector {section} {onPropChange} />

  {:else if nodeId === 'nav_links' || nodeId.startsWith('nav_')}
    <NodeNavLinksInspector {section} {onPropChange} {onSectionUpdate} />

  {:else if nodeId === 'badge'}
    <div class="space-y-2">
      <label for="node-badge-text" class="block font-semibold text-base-content/80">Teks Badge Promo</label>
      <input
        id="node-badge-text"
        type="text"
        value={section.props?.badgeText ?? ''}
        on:input={(e) => onPropChange('badgeText', e.currentTarget.value)}
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content placeholder-base-content/40 focus:outline-none focus:border-blue-500"
        placeholder="Promo Spesial UMKM"
      />
    </div>

  {:else if nodeId === 'title'}
    <NodeTitleInspector {section} {onPropChange} />

  {:else if nodeId === 'subtitle'}
    <div class="space-y-2">
      <label for="node-hero-subtitle" class="block font-semibold text-base-content/80">Subjudul Deskripsi</label>
      <textarea
        id="node-hero-subtitle"
        value={subtitle}
        on:input={(e) => onPropChange('subtitle', e.currentTarget.value)}
        rows="3"
        class="w-full px-3 py-2 bg-base-200/50 dark:bg-slate-950 border border-base-300 dark:border-slate-800 rounded-lg text-base-content focus:outline-none focus:border-blue-500 resize-y"
        placeholder="Deskripsi singkat pendukung brand Anda"
      />
    </div>

  {:else if nodeId === 'image'}
    <NodeImageInspector {section} {onPropChange} />

  {:else if nodeId === 'cta'}
    <NodeCtaInspector {section} {onPropChange} />

  {:else if nodeId.startsWith('item_') || nodeId.startsWith('feat_') || nodeId.startsWith('prod_') || nodeId.startsWith('testi_') || nodeId.startsWith('faq_')}
    <div class="p-3 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-xl space-y-2">
      <span class="font-bold text-base-content/90">Edit Konten Item ({nodeId})</span>
      <p class="text-base-content/60 text-[11px] leading-relaxed">
        Gunakan tab <strong>Konten</strong> di panel samping untuk mengedit, menambah, atau menyusun urutan daftar item ini secara visual.
      </p>
    </div>

  {:else}
    <div class="p-4 text-center text-base-content/50 border border-dashed border-base-300 dark:border-slate-800 rounded-xl">
      Pilih elemen visual pada kanvas untuk menyesuaikan kontennya.
    </div>
  {/if}
</div>
<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import {
    nodeTextColorOptions,
    nodeBgColorOptions,
  } from '../nodeContent.constants';

  export let section: TemplateSection;
  export let onPropChange: (key: string, value: unknown) => void = () => {};

  $: showAnnouncement = (section.props?.showAnnouncement as boolean) ?? true;
  $: announcementText = (section.props?.announcementText as string) || '';
  $: announcementBg = (section.props?.announcementBg as string) || '';
  $: announcementTextColor = (section.props?.announcementTextColor as string) || '';
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between p-2 bg-base-200/50 dark:bg-slate-900 rounded-lg">
    <span class="font-semibold text-base-content">Tampilkan Bar</span>
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={showAnnouncement}
        on:change={(e) => onPropChange('showAnnouncement', e.currentTarget.checked)}
        class="sr-only peer"
      />
      <div class="w-9 h-5 bg-base-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
    </label>
  </div>

  <div class="space-y-1">
    <label class="font-semibold text-base-content" for="announcement-text">Teks Pengumuman</label>
    <input
      id="announcement-text"
      type="text"
      value={announcementText}
      on:input={(e) => onPropChange('announcementText', e.currentTarget.value)}
      class="w-full px-3 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-xs"
      placeholder="Gratis Ongkir se-Indonesia!"
    />
  </div>

  <div class="grid grid-cols-2 gap-2">
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="announcement-bg">Warna Background</label>
      <select
        id="announcement-bg"
        value={announcementBg}
        on:change={(e) => onPropChange('announcementBg', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      >
        <option value="">Default Brand</option>
        {#each nodeBgColorOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="space-y-1">
      <label class="font-semibold text-base-content" for="announcement-color">Warna Teks</label>
      <select
        id="announcement-color"
        value={announcementTextColor}
        on:change={(e) => onPropChange('announcementTextColor', e.currentTarget.value)}
        class="w-full px-2 py-1.5 bg-base-200/50 dark:bg-slate-900 border border-base-300 dark:border-slate-800 rounded-lg text-xs"
      >
        {#each nodeTextColorOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

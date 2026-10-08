<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import { Button } from '@/components/ui';
  import SearchableIconDropdown from '../../inspector/SearchableIconDropdown.svelte';
  import { HERO_BADGE_ICON_OPTIONS } from '../../sections/hero/heroIcons';

  export let trustBadges: Array<{ text: string; icon?: string }> = [];
  export let onPropChange: (key: string, value: unknown) => void;

  $: items =
    Array.isArray(trustBadges) && trustBadges.length > 0
      ? trustBadges
      : [
          { text: 'Kualitas Asli', icon: 'CheckCircle2' },
          { text: 'Siap Kirim', icon: 'CheckCircle2' },
          { text: 'Garansi Aman', icon: 'CheckCircle2' },
        ];

  function updateItem(index: number, field: 'text' | 'icon', val: string) {
    const next = items.map((it, i) => (i === index ? { ...it, [field]: val } : it));
    onPropChange('trustBadges', next);
  }

  function addItem() {
    if (items.length >= 4) return;
    const next = [...items, { text: 'Jaminan Mutu', icon: 'CheckCircle2' }];
    onPropChange('trustBadges', next);
  }

  function removeItem(index: number) {
    if (items.length <= 1) return;
    const next = items.filter((_, i) => i !== index);
    onPropChange('trustBadges', next);
  }
</script>

<div class="space-y-3 pt-3 border-t border-base-300">
  <div class="flex items-center justify-between">
    <span class="block font-semibold text-xs text-base-content/80">
      Lencana Sertifikasi / Jaminan ({items.length}/4)
    </span>
    {#if items.length < 4}
      <Button
        type="button"
        variant="ghost"
        size="xs"
        on:click={addItem}
        class="!h-auto !min-h-0 !py-1 !px-2 text-primary gap-1"
      >
        <Plus size={13} />
        Tambah
      </Button>
    {/if}
  </div>

  <div class="space-y-2.5">
    {#each items as badge, i (i)}
      <div class="p-2.5 rounded-xl bg-base-200/50 border border-base-300 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-semibold text-base-content/60">Lencana #{i + 1}</span>
          {#if items.length > 1}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              on:click={() => removeItem(i)}
              class="!w-6 !h-6 !min-h-0 !p-0 text-error hover:text-error/80"
              title="Hapus Lencana"
            >
              <Trash2 size={13} />
            </Button>
          {/if}
        </div>

        <input
          type="text"
          value={badge.text}
          on:input={(e) => updateItem(i, 'text', e.currentTarget.value)}
          class="input input-bordered input-xs w-full"
          placeholder="Nama Lencana (cth: Halal MUI)"
        />

        <SearchableIconDropdown
          label="Ikon Lencana"
          selectedIcon={badge.icon || 'CheckCircle2'}
          options={HERO_BADGE_ICON_OPTIONS}
          onSelect={(val) => updateItem(i, 'icon', val)}
        />
      </div>
    {/each}
  </div>
</div>

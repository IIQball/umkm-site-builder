<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import { Sparkles, Heading, FileText, Image, MapPin, Navigation, Clock, Flag, ListFilter } from 'lucide-svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: nodeStyles = ((section.props?.nodeStyles || section.styles?.nodeStyles || {}) as unknown) as Record<string, Record<string, string>>;
  $: currentStyle = nodeStyles[nodeId] || {};

  function getNodeStyleVal(id: string, prop: string): string {
    return nodeStyles[id]?.[prop] || '';
  }

  function setNodeStyleVal(id: string, prop: string, value: string) {
    const currentProps = section.props || {};
    const updated = {
      ...nodeStyles,
      [id]: {
        ...(nodeStyles[id] || {}),
        [prop]: value,
      },
    };
    onPropChange('nodeStyles', updated);
    if (onSectionUpdate) {
      onSectionUpdate({
        ...section,
        props: {
          ...currentProps,
          nodeStyles: updated,
        },
      });
    }
  }

  function updateStyle(field: string, val: string) {
    setNodeStyleVal(nodeId, field, val);
  }

  $: isBadge = nodeId === 'badge' || nodeId === 'maps_badge';
  $: isTitle = nodeId === 'title' || nodeId === 'maps_title' || nodeId === 'maps_header' || nodeId === 'header';
  $: isSubtitle = nodeId === 'subtitle' || nodeId === 'maps_subtitle';
  $: isIframe = nodeId === 'maps_iframe' || nodeId === 'map_view';
  $: isInfoCard = nodeId === 'maps_info_card';
  $: isCta = nodeId === 'maps_cta_button';
  $: isBranchSelector = nodeId === 'maps_branch_selector' || nodeId === 'maps_branch_tabs';
  $: isHoursCard = nodeId === 'maps_hours_card' || nodeId === 'maps_hours_badge';
  $: isDirectionsCard = nodeId === 'maps_directions_card';
</script>

<div class="space-y-4 text-left">
  {#if isBadge}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Sparkles size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Lencana & Tagline</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks lencana lokasi gerai</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('badge', 'color')}
      marginTop={getNodeStyleVal('badge', 'marginTop')}
      marginBottom={getNodeStyleVal('badge', 'marginBottom')}
      colorLabel="Warna Teks Lencana (Token)"
      onColorChange={(val) => setNodeStyleVal('badge', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('badge', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('badge', 'marginBottom', val)}
    />

  {:else if isTitle}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Heading size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Judul Utama Lokasi (H2)</h4>
        <p class="text-[10px] text-base-content/60">Gaya headline utama bagian peta</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('title', 'color')}
      marginTop={getNodeStyleVal('title', 'marginTop')}
      marginBottom={getNodeStyleVal('title', 'marginBottom')}
      colorLabel="Warna Judul (Token)"
      onColorChange={(val) => setNodeStyleVal('title', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('title', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('title', 'marginBottom', val)}
    />

  {:else if isSubtitle}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <FileText size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Deskripsi Subjudul</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks penjelasan lokasi toko</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('subtitle', 'color')}
      marginTop={getNodeStyleVal('subtitle', 'marginTop')}
      marginBottom={getNodeStyleVal('subtitle', 'marginBottom')}
      colorLabel="Warna Subjudul (Token)"
      onColorChange={(val) => setNodeStyleVal('subtitle', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('subtitle', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('subtitle', 'marginBottom', val)}
    />

  {:else if isIframe}
    <div class="p-3 bg-base-200/50 rounded-xl space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-xs text-base-content/80">
        <Image size={14} class="text-primary" />
        <span>Gaya Bingkai Peta (Iframe)</span>
      </div>
      <div>
        <label for="maps-frame-radius" class="block text-[11px] font-semibold text-base-content/60 mb-1">Sudut Melengkung (Radius)</label>
        <select
          id="maps-frame-radius"
          value={currentStyle.borderRadius || '1rem'}
          on:change={(e) => updateStyle('borderRadius', e.currentTarget.value)}
          class="w-full px-2 py-1.5 text-xs bg-base-100 border border-base-300 rounded"
        >
          <option value="0px">Kotak Tanpa Lengkung (0px)</option>
          <option value="0.5rem">Lengkung Halus (8px)</option>
          <option value="1rem">Lengkung Standar (16px)</option>
          <option value="1.5rem">Lengkung Modern (24px)</option>
        </select>
      </div>
    </div>

  {:else if isInfoCard}
    <div class="p-3 bg-base-200/50 rounded-xl space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-xs text-base-content/80">
        <MapPin size={14} class="text-primary" />
        <span>Gaya Kartu Informasi Gerai</span>
      </div>
      <div>
        <label for="maps-card-bg" class="block text-[11px] font-semibold text-base-content/60 mb-1">Warna Background Kartu</label>
        <div class="flex items-center gap-2">
          <input id="maps-card-bg" type="color" value={currentStyle.backgroundColor || '#ffffff'} on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="w-8 h-8 rounded border border-base-300 cursor-pointer" />
          <input type="text" value={currentStyle.backgroundColor || ''} placeholder="#ffffff" on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="flex-1 px-2 py-1 text-xs bg-base-100 border border-base-300 rounded font-mono" />
        </div>
      </div>
      <div>
        <label for="maps-card-radius" class="block text-[11px] font-semibold text-base-content/60 mb-1">Sudut Melengkung Kartu</label>
        <select
          id="maps-card-radius"
          value={currentStyle.borderRadius || '1rem'}
          on:change={(e) => updateStyle('borderRadius', e.currentTarget.value)}
          class="w-full px-2 py-1.5 text-xs bg-base-100 border border-base-300 rounded"
        >
          <option value="0.5rem">8px (Kecil)</option>
          <option value="1rem">16px (Standar)</option>
          <option value="1.5rem">24px (Modern)</option>
        </select>
      </div>
    </div>

  {:else if isCta}
    <div class="p-3 bg-base-200/50 rounded-xl space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-xs text-base-content/80">
        <Navigation size={14} class="text-primary" />
        <span>Gaya Tombol Petunjuk Arah (CTA)</span>
      </div>
      <div>
        <label for="maps-btn-bg" class="block text-[11px] font-semibold text-base-content/60 mb-1">Warna Tombol (Background)</label>
        <div class="flex items-center gap-2">
          <input id="maps-btn-bg" type="color" value={currentStyle.backgroundColor || '#2563eb'} on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="w-8 h-8 rounded border border-base-300 cursor-pointer" />
          <input type="text" value={currentStyle.backgroundColor || ''} placeholder="#2563eb" on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="flex-1 px-2 py-1 text-xs bg-base-100 border border-base-300 rounded font-mono" />
        </div>
      </div>
      <div>
        <label for="maps-btn-radius" class="block text-[11px] font-semibold text-base-content/60 mb-1">Bentuk Sudut Tombol</label>
        <select
          id="maps-btn-radius"
          value={currentStyle.borderRadius || '16px'}
          on:change={(e) => updateStyle('borderRadius', e.currentTarget.value)}
          class="w-full px-2 py-1.5 text-xs bg-base-100 border border-base-300 rounded"
        >
          <option value="4px">Kotak Ramping (4px)</option>
          <option value="8px">Halus (8px)</option>
          <option value="16px">Standar (16px)</option>
          <option value="9999px">Kapsul Bulat Penuh (Pill)</option>
        </select>
      </div>
    </div>

  {:else if isBranchSelector}
    <div class="p-3 bg-base-200/50 rounded-xl space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-xs text-base-content/80">
        <ListFilter size={14} class="text-primary" />
        <span>Gaya Bilah Tab Cabang</span>
      </div>
      <div>
        <label for="maps-branch-radius" class="block text-[11px] font-semibold text-base-content/60 mb-1">Sudut Tab Cabang</label>
        <select
          id="maps-branch-radius"
          value={currentStyle.borderRadius || '12px'}
          on:change={(e) => updateStyle('borderRadius', e.currentTarget.value)}
          class="w-full px-2 py-1.5 text-xs bg-base-100 border border-base-300 rounded"
        >
          <option value="8px">8px (Kecil)</option>
          <option value="12px">12px (Standar)</option>
          <option value="9999px">Kapsul (Pill)</option>
        </select>
      </div>
    </div>

  {:else if isHoursCard}
    <div class="p-3 bg-base-200/50 rounded-xl space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-xs text-base-content/80">
        <Clock size={14} class="text-primary" />
        <span>Gaya Kartu Jam Operasional</span>
      </div>
      <div>
        <label for="maps-hours-bg" class="block text-[11px] font-semibold text-base-content/60 mb-1">Background Kartu Jam Buka</label>
        <div class="flex items-center gap-2">
          <input id="maps-hours-bg" type="color" value={currentStyle.backgroundColor || '#ffffff'} on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="w-8 h-8 rounded border border-base-300 cursor-pointer" />
          <input type="text" value={currentStyle.backgroundColor || ''} placeholder="#ffffff" on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="flex-1 px-2 py-1 text-xs bg-base-100 border border-base-300 rounded font-mono" />
        </div>
      </div>
    </div>

  {:else if isDirectionsCard}
    <div class="p-3 bg-base-200/50 rounded-xl space-y-3">
      <div class="flex items-center gap-1.5 font-bold text-xs text-base-content/80">
        <Flag size={14} class="text-primary" />
        <span>Gaya Kartu Panduan Rute & Parkir</span>
      </div>
      <div>
        <label for="maps-dir-bg" class="block text-[11px] font-semibold text-base-content/60 mb-1">Background Kartu</label>
        <div class="flex items-center gap-2">
          <input id="maps-dir-bg" type="color" value={currentStyle.backgroundColor || '#ffffff'} on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="w-8 h-8 rounded border border-base-300 cursor-pointer" />
          <input type="text" value={currentStyle.backgroundColor || ''} placeholder="#ffffff" on:input={(e) => updateStyle('backgroundColor', e.currentTarget.value)} class="flex-1 px-2 py-1 text-xs bg-base-100 border border-base-300 rounded font-mono" />
        </div>
      </div>
    </div>
  {:else}
    <div class="space-y-3">
      <div class="flex items-center gap-2 pb-2 border-b border-base-200">
        <Sparkles size={16} class="text-primary shrink-0" />
        <div>
          <h4 class="font-bold text-xs text-base-content">Elemen Peta</h4>
          <p class="text-[10px] text-base-content/60">Atur warna token dan margin elemen</p>
        </div>
      </div>
      <NodeStyleControls
        color={getNodeStyleVal(nodeId, 'color')}
        marginTop={getNodeStyleVal(nodeId, 'marginTop')}
        marginBottom={getNodeStyleVal(nodeId, 'marginBottom')}
        onColorChange={(val) => setNodeStyleVal(nodeId, 'color', val)}
        onMarginTopChange={(val) => setNodeStyleVal(nodeId, 'marginTop', val)}
        onMarginBottomChange={(val) => setNodeStyleVal(nodeId, 'marginBottom', val)}
      />
    </div>
  {/if}
</div>

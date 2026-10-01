<script lang="ts">
  import type { TemplateSection } from '@/schemas';
  import {
    Sparkles,
    MessageSquare,
    ListFilter,
    FileText,
    Send,
    Clock,
    MapPin,
    Share2,
  } from 'lucide-svelte';
  import NodeStyleControls from '../NodeStyleControls.svelte';

  export let section: TemplateSection;
  export let nodeId: string;
  export let onPropChange: (key: string, value: unknown) => void = () => {};
  export let onSectionUpdate: (section: TemplateSection) => void = () => {};

  $: nodeStyles = ((section.props?.nodeStyles || section.styles?.nodeStyles || {}) as unknown) as Record<string, Record<string, string>>;

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

  $: isBrand = nodeId === 'footer_brand' || nodeId === 'brand_bio';
  $: isContact = nodeId === 'footer_contact' || nodeId === 'contact_info';
  $: isNav = nodeId === 'footer_navigation' || nodeId === 'navigation_links';
  $: isCopyright = nodeId === 'footer_copyright' || nodeId === 'copyright';
  $: isFloatingCta = nodeId === 'footer_floating_cta';
  $: isNewsletter = nodeId === 'footer_newsletter';
  $: isStatusBadge = nodeId === 'footer_status_badge';
  $: isMiniMap = nodeId === 'footer_mini_map';
  $: isSocials = nodeId === 'footer_socials';
</script>

<div class="space-y-4 text-left">
  {#if isBrand}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Sparkles size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Profil & Identitas Toko</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks deskripsi dan profil brand</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_brand', 'color')}
      marginTop={getNodeStyleVal('footer_brand', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_brand', 'marginBottom')}
      colorLabel="Warna Teks Brand (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_brand', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_brand', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_brand', 'marginBottom', val)}
    />

  {:else if isContact}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <MessageSquare size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Kontak & Jam Operasional</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks info kontak dan jam buka</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_contact', 'color')}
      marginTop={getNodeStyleVal('footer_contact', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_contact', 'marginBottom')}
      colorLabel="Warna Teks Kontak (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_contact', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_contact', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_contact', 'marginBottom', val)}
    />

  {:else if isNav}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <ListFilter size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Menu Navigasi Footer</h4>
        <p class="text-[10px] text-base-content/60">Gaya tautan navigasi halaman</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_navigation', 'color')}
      marginTop={getNodeStyleVal('footer_navigation', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_navigation', 'marginBottom')}
      colorLabel="Warna Tautan Menu (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_navigation', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_navigation', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_navigation', 'marginBottom', val)}
    />

  {:else if isFloatingCta}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Sparkles size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Banner Floating CTA</h4>
        <p class="text-[10px] text-base-content/60">Gaya kartu banner promosi melayang</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_floating_cta', 'color')}
      marginTop={getNodeStyleVal('footer_floating_cta', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_floating_cta', 'marginBottom')}
      colorLabel="Warna Teks Banner (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_floating_cta', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_floating_cta', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_floating_cta', 'marginBottom', val)}
    />

  {:else if isNewsletter}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Send size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Form Langganan Promo WA</h4>
        <p class="text-[10px] text-base-content/60">Gaya area langganan promosi</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_newsletter', 'color')}
      marginTop={getNodeStyleVal('footer_newsletter', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_newsletter', 'marginBottom')}
      colorLabel="Warna Teks Form (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_newsletter', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_newsletter', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_newsletter', 'marginBottom', val)}
    />

  {:else if isStatusBadge}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Clock size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Bilah Status Operasional</h4>
        <p class="text-[10px] text-base-content/60">Gaya badge status toko buka/tutup</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_status_badge', 'color')}
      marginTop={getNodeStyleVal('footer_status_badge', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_status_badge', 'marginBottom')}
      colorLabel="Warna Teks Status (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_status_badge', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_status_badge', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_status_badge', 'marginBottom', val)}
    />

  {:else if isMiniMap}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <MapPin size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Bingkai Peta Mini Lokasi</h4>
        <p class="text-[10px] text-base-content/60">Gaya frame peta lokasi gerai</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_mini_map', 'color')}
      marginTop={getNodeStyleVal('footer_mini_map', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_mini_map', 'marginBottom')}
      showTextColor={false}
      onMarginTopChange={(val) => setNodeStyleVal('footer_mini_map', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_mini_map', 'marginBottom', val)}
    />

  {:else if isSocials}
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <Share2 size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Ubin Media Sosial</h4>
        <p class="text-[10px] text-base-content/60">Gaya grid tautan sosial media</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_socials', 'color')}
      marginTop={getNodeStyleVal('footer_socials', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_socials', 'marginBottom')}
      colorLabel="Warna Teks Judul Sosmed"
      onColorChange={(val) => setNodeStyleVal('footer_socials', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_socials', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_socials', 'marginBottom', val)}
    />

  {:else if isCopyright}
    <!-- Hak Cipta & Baris Bawah -->
    <div class="flex items-center gap-2 pb-2 border-b border-base-200">
      <FileText size={16} class="text-primary shrink-0" />
      <div>
        <h4 class="font-bold text-xs text-base-content">Hak Cipta & Attribution</h4>
        <p class="text-[10px] text-base-content/60">Gaya teks hak cipta & Powered by Pinoka</p>
      </div>
    </div>
    <NodeStyleControls
      color={getNodeStyleVal('footer_copyright', 'color')}
      marginTop={getNodeStyleVal('footer_copyright', 'marginTop')}
      marginBottom={getNodeStyleVal('footer_copyright', 'marginBottom')}
      colorLabel="Warna Teks Hak Cipta (Token)"
      onColorChange={(val) => setNodeStyleVal('footer_copyright', 'color', val)}
      onMarginTopChange={(val) => setNodeStyleVal('footer_copyright', 'marginTop', val)}
      onMarginBottomChange={(val) => setNodeStyleVal('footer_copyright', 'marginBottom', val)}
    />
  {/if}
</div>

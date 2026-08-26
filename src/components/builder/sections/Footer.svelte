<script lang="ts">
  import type { FooterProps, SectionStyles } from '@/types';
  import FooterMultiColumnPreset from './footer/FooterMultiColumnPreset.svelte';
  import FooterSpecialPreset from './footer/FooterSpecialPreset.svelte';

  export let props: FooterProps = {};
  export let styles: SectionStyles = {};
  export let layoutPreset: string = 'multi_column';

  $: activePreset = layoutPreset || (props?.layoutPreset as string) || (styles?.layoutPreset as string) || 'multi_column';
  $: whatsappNumber = (props?.whatsappNumber as string) || (props?.waNumber as string) || '628123456789';
  $: address = props?.address || 'Jl. Raya Jember No.KM 13, Labanasem, Kab. Banyuwangi, Jawa Timur 68461';
  $: copyrightText = props?.copyrightText || '© 2026 Toko Kami. Semua hak dilindungi.';
  $: tagline = props?.tagline || 'Pusat belanja produk UMKM terpercaya berkualitas tinggi.';
  $: logoText = props?.logoText || 'TOKO KAMI';
</script>

<footer
  class="w-full box-border pt-12 pb-6 select-none border-t border-base-200 dark:border-slate-800"
  style:background-color="var(--theme-bg)"
>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    {#if activePreset === 'newsletter_footer' || activePreset === 'cta_focused' || activePreset === 'floating_bottom_bar' || activePreset === 'app_store_style_footer'}
      <FooterSpecialPreset
        {activePreset}
        {logoText}
        {tagline}
        {whatsappNumber}
        {copyrightText}
      />
    {:else}
      <FooterMultiColumnPreset
        {activePreset}
        {logoText}
        {tagline}
        {address}
        {whatsappNumber}
        {copyrightText}
      />
    {/if}
  </div>
</footer>

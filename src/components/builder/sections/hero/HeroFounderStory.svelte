<script lang="ts">
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Kisah di Balik Dapur Kami';
  export let tagName: string = 'h1';
  export let title: string = '"Kami Memasak Seperti Menyajikan Makanan untuk Ibu Sendiri"';
  export let subtitle: string = 'Bermula dari warung kecil tahun 2012, kami mempertahankan racikan bumbu ulek tradisional tanpa MSG berlebih demi menjaga kemurnian rasa.';
  export let ctaText: string = 'Coba Menu Kami';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let imageUrl: string = 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;

  $: isPhotoActive = activeNodeId === 'hero_founder_photo' || activeNodeId === 'hero_image' || activeNodeId === 'image';
</script>

<div class="py-10">
  <div class="cq-grid-split items-center gap-8">
    <!-- Founder Portrait Card (Sub-node hero_founder_photo) -->
    <div
      data-node="hero_founder_photo"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_founder_photo')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_founder_photo')}
      class={`relative w-full aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer ${
        isPhotoActive
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
          : 'hover:outline-dashed hover:outline-1 hover:outline-blue-400/50'
      }`}
    >
      <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
      <div class="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-left">
        <p class="font-bold text-sm font-heading">Pendiri & Artisan</p>
        <p class="text-[11px] text-slate-300 font-sans">Pengrajin Resep Asli</p>
      </div>
    </div>

    <!-- Story Narrative Text -->
    <div class="text-left">
      <HeroHeaderContent
        {badgeText}
        {tagName}
        {title}
        {subtitle}
        {ctaText}
        {ctaLink}
        {secondaryCtaText}
        {secondaryCtaLink}
        {waNumber}
        {activeNodeId}
        {selectNode}
        {selectNodeKey}
        align="left"
      />
    </div>
  </div>
</div>

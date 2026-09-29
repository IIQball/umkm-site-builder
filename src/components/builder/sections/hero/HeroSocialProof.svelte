<script lang="ts">
  import { Star } from 'lucide-svelte';
  import HeroHeaderContent from './HeroHeaderContent.svelte';

  export let badgeText: string = 'Koleksi Spesial UMKM';
  export let tagName: string = 'h1';
  export let title: string = 'Solusi Kualitas Terbaik untuk Kebutuhan Anda';
  export let subtitle: string = 'Dibuat dengan bahan organik pilihan dan formulasi teruji untuk kenyamanan Anda sehari-hari.';
  export let ctaText: string = 'Konsultasi Sekarang';
  export let ctaLink: string = '#';
  export let secondaryCtaText: string = '';
  export let secondaryCtaLink: string = '#';
  export let waNumber: string = '';
  export let activeNodeId: string | null = null;
  export let selectNode: ((e: MouseEvent, key: string) => void) | undefined = undefined;
  export let selectNodeKey: ((e: KeyboardEvent, key: string) => void) | undefined = undefined;
  export let elementOrder: string[] = ['social_proof', 'badge', 'title', 'subtitle', 'cta'];

  $: hasSocialProof = elementOrder.includes('social_proof');
  $: isSocialProofActive = activeNodeId === 'hero_social_proof' || activeNodeId === 'social_proof';
</script>

{#snippet proofBlock()}
  <!-- Avatar Wall & Social Proof Rating (Sub-node hero_social_proof) -->
  {#if hasSocialProof}
    <div
      data-node="hero_social_proof"
      role="button"
      tabindex="0"
      on:click={(e) => selectNode && selectNode(e, 'hero_social_proof')}
      on:keydown={(e) => selectNodeKey && selectNodeKey(e, 'hero_social_proof')}
      class={`flex items-center justify-center gap-3 my-2 p-2 rounded-2xl transition-all cursor-pointer ${
        isSocialProofActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 bg-primary/10'
          : 'hover:outline-dashed hover:outline-1 hover:outline-primary/50'
      }`}
    >
      <div class="avatar-group -space-x-3 rtl:space-x-reverse">
        <div class="avatar">
          <div class="w-8 h-8">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-8 h-8">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-8 h-8">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-8 h-8">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Avatar" />
          </div>
        </div>
      </div>
      <div class="text-left text-xs">
        <div class="flex text-amber-400 gap-0.5">
          {#each Array(5) as _}
            <Star size={12} class="fill-current text-amber-400" />
          {/each}
        </div>
        <span class="text-[var(--color-text-secondary)] font-medium font-mono text-[11px]">Dipercaya oleh <strong>2.500+</strong> Pembeli</span>
      </div>
    </div>
  {/if}
{/snippet}

<div class="py-12 md:py-16 text-center max-w-2xl mx-auto w-full">
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
    {elementOrder}
    align="center"
    customBlocks={{ social_proof: proofBlock }}
  />
</div>

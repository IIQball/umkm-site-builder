<script lang="ts">
  import { canvasStore } from '../../stores/editorStore';
  import { DEFAULT_CLIENT_LOGOS, type ClientLogoItem } from './testimonials.helpers';

  export let sectionId: string = '';
  export let logos: ClientLogoItem[] = DEFAULT_CLIENT_LOGOS;

  function selectLogo(e: Event, idx: number) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `testi_logo_${idx}`);
    }
  }
</script>

<div class="text-center">
  <p class="text-xs font-heading font-bold uppercase tracking-widest text-secondary/70 mb-6">
    Telah Dipercaya Oleh Berbagai Instansi & Komunitas
  </p>

  <div class="cq-logo-grid items-center">
    {#each logos as logo, index (logo.id || logo.name + index)}
      {@const isLogoActive = $canvasStore.selectedNodeId === `testi_logo_${index}`}

      <div
        role="button"
        tabindex="0"
        on:click={(e) => selectLogo(e, index)}
        on:keydown={(e) => { if (e.key === 'Enter') selectLogo(e, index); }}
        class={`h-12 px-3 rounded-xl bg-card border border-light/80 flex items-center justify-center text-xs font-black text-secondary grayscale hover:grayscale-0 hover:text-main hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer ${
          isLogoActive
            ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-md grayscale-0 text-main'
            : ''
        }`}
      >
        {#if logo.logoUrl}
          <img src={logo.logoUrl} alt={logo.name} class="h-6 object-contain" />
        {:else}
          <span>{logo.name}</span>
        {/if}
      </div>
    {/each}
  </div>
</div>

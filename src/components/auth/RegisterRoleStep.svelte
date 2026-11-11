<script lang="ts">
  import { Store, PenTool, CheckCircle2 } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import Button from "@/components/ui/Button.svelte";

  export let role: "tenant" | "designer" | "" = "";
  export let onNext: () => void;
</script>

<div
  class="w-full space-y-4 absolute top-0 left-0"
  in:fly={{ x: -20, duration: 400, delay: 400, easing: cubicOut }}
  out:fade={{ duration: 300 }}
>
  <div class="grid grid-cols-1 gap-3 w-full">
    <button
      type="button"
      class="relative p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group {role === 'tenant' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'border-light bg-card hover:border-muted hover:shadow-xs'}"
      on:click={() => { role = 'tenant'; }}
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors {role === 'tenant' ? 'bg-primary text-slate-950' : 'bg-nested text-muted group-hover:text-main'}">
          <Store size={18} strokeWidth={2.5} />
        </div>
        <div class="pr-6">
          <span class="font-medium text-main text-sm block">Merchant / Pemilik Toko</span>
          <p class="text-xs text-secondary mt-0.5 leading-relaxed">Bangun website UMKM impian tanpa koding.</p>
        </div>
      </div>
      {#if role === 'tenant'}
        <div class="absolute top-1/2 -translate-y-1/2 right-4 text-primary animate-fade-in-up">
          <CheckCircle2 size={18} strokeWidth={2.5} />
        </div>
      {/if}
    </button>

    <button
      type="button"
      class="relative p-4 rounded-xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group {role === 'designer' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'border-light bg-card hover:border-muted hover:shadow-xs'}"
      on:click={() => { role = 'designer'; }}
    >
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-colors {role === 'designer' ? 'bg-primary text-slate-950' : 'bg-nested text-muted group-hover:text-main'}">
          <PenTool size={18} strokeWidth={2.5} />
        </div>
        <div class="pr-6">
          <span class="font-medium text-main text-sm block">Desainer Template</span>
          <p class="text-xs text-secondary mt-0.5 leading-relaxed">Buat dan jual template desain eksklusif.</p>
        </div>
      </div>
      {#if role === 'designer'}
        <div class="absolute top-1/2 -translate-y-1/2 right-4 text-primary animate-fade-in-up">
          <CheckCircle2 size={18} strokeWidth={2.5} />
        </div>
      {/if}
    </button>
  </div>

  <div class="pt-2">
    <Button type="button" variant="primary" size="md" fullWidth disabled={role === ""} on:click={onNext}>
      Lanjutkan
    </Button>
  </div>

  <p class="text-xs text-center text-secondary pt-6 leading-relaxed">
    Dengan membuat akun, Anda menyetujui <a href="/syarat-layanan" class="text-primary hover:underline font-medium">Syarat Layanan</a> dan <a href="/kebijakan-privasi" class="text-primary hover:underline font-medium">Kebijakan Privasi</a>.
  </p>
</div>


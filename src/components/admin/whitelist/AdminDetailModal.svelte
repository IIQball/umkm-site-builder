<script lang="ts">
  import { ShieldCheck, CheckCircle, Ban, X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { AdminEntry } from './whitelist.types';
  import { Button } from '@/components/ui';

  export let admin: AdminEntry | null = null;

  const dispatch = createEventDispatcher<{ close: void }>();

  const close = () => dispatch('close');
</script>

{#if admin}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-nested/80 backdrop-blur-sm" on:click={close} on:keydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="0"></div>
    <div class="relative bg-card w-full max-w-md rounded-3xl shadow-2xl border border-light overflow-hidden animate-scale-up">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-light flex justify-between items-center bg-nested/30">
        <h3 class="font-bold text-main text-base flex items-center gap-2">
          <ShieldCheck size={18} class="text-primary" />
          Detail Profil Admin
        </h3>
        <Button variant="secondary" size="icon" on:click={close} title="Tutup">
          <X size={18} class="text-secondary" />
        </Button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xl flex-shrink-0">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 class="font-black text-xl text-main leading-none">{admin.name}</h4>
            <p class="text-sm text-secondary font-medium mt-1.5">{admin.email}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-nested/40 rounded-2xl p-4 border border-light/50">
            <span class="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">Status Akses</span>
            {#if admin.status === 'active'}
              <div class="inline-flex items-center gap-1.5 text-success font-bold text-sm">
                <CheckCircle size={14} strokeWidth={3} /> Aktif
              </div>
            {:else}
              <div class="inline-flex items-center gap-1.5 text-error font-bold text-sm">
                <Ban size={14} strokeWidth={3} /> Diblokir
              </div>
            {/if}
          </div>
          
          <div class="bg-nested/40 rounded-2xl p-4 border border-light/50">
            <span class="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">Terdaftar Sejak</span>
            <div class="text-main font-bold text-sm">
              {new Date(admin.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-light bg-nested/20 flex justify-end">
        <Button variant="secondary" size="sm" on:click={close} className="px-6">
          Tutup
        </Button>
      </div>
    </div>
  </div>
{/if}

<script lang="ts">
  import { ShieldCheck, CheckCircle, Ban } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { AdminEntry } from './whitelist.types';
  import { Button, Modal } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';

  export let admin: AdminEntry | null = null;

  const dispatch = createEventDispatcher<{ close: void }>();

  const close = () => dispatch('close');
</script>

<Modal open={!!admin} on:close={close} size="md">
  <svelte:fragment slot="header">
    <h3 class="font-bold text-main text-base flex items-center gap-2">
      <ShieldCheck size={18} class="text-primary" />
      <span>Detail Profil Admin</span>
    </h3>
  </svelte:fragment>

  {#if admin}
    <div class="space-y-6 py-1">
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
            {formatDate(admin.createdAt)}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    <Button variant="secondary" size="sm" on:click={close} className="px-6">
      Tutup
    </Button>
  </svelte:fragment>
</Modal>

<script lang="ts">
  import { ShieldCheck, CheckCircle, Ban, Info, CheckCircle2, Trash2 } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { AdminEntry } from './whitelist.types';
  import { Badge } from '@/components/ui';

  export let admins: AdminEntry[] = [];
  export let isFetching = true;
  export let isActionLoading = false;

  const dispatch = createEventDispatcher<{
    view: AdminEntry;
    toggleStatus: AdminEntry;
    remove: AdminEntry;
  }>();
</script>

<div class="bg-card rounded-2xl border border-light shadow-sm overflow-hidden mt-8">
  <div class="px-6 py-5 border-b border-light flex justify-between items-center bg-nested/20">
    <h3 class="font-bold text-main text-sm leading-none pt-2.5">Daftar Administrator Aktif</h3>
    <span class="badge badge-sm badge-outline text-xs font-semibold">{admins.length} Pengguna</span>
  </div>
  
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm whitespace-nowrap">
      <thead class="bg-nested/60 border-b border-light text-label-caps text-muted">
        <tr>
          <th class="px-6 py-4">Profil Admin</th>
          <th class="px-6 py-4">Status Akses</th>
          <th class="px-6 py-4 hidden md:table-cell">Waktu Didaftarkan</th>
          <th class="px-6 py-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[var(--color-border-light)]">
        {#if isFetching}
          <tr>
            <td colspan="4" class="px-6 py-12 text-center text-muted">
              <span class="loading loading-spinner loading-md text-primary/50"></span>
            </td>
          </tr>
        {:else if admins.length === 0}
          <tr>
            <td colspan="4" class="px-6 py-16 text-center text-muted">
              <div class="flex flex-col items-center justify-center gap-3">
                <div class="w-12 h-12 rounded-full bg-nested flex items-center justify-center text-muted">
                  <ShieldCheck size={24} />
                </div>
                <p class="font-medium text-sm">Belum ada administrator yang terdaftar.</p>
              </div>
            </td>
          </tr>
        {:else}
          {#each admins as admin (admin.id)}
            <tr class="hover:bg-nested/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div class="pt-1.5">
                    <div class="font-bold text-main leading-none mb-1">{admin.name}</div>
                    <div class="text-xs text-secondary leading-none">{admin.email}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                {#if admin.status === 'active'}
                  <Badge variant="emerald" size="sm">
                    <CheckCircle size={12} strokeWidth={3} class="mr-1 inline" />
                    Aktif
                  </Badge>
                {:else}
                  <Badge variant="rose" size="sm">
                    <Ban size={12} strokeWidth={3} class="mr-1 inline" />
                    Diblokir
                  </Badge>
                {/if}
              </td>
              <td class="px-6 py-4 hidden md:table-cell text-secondary text-xs font-medium">
                {new Date(admin.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    on:click={() => dispatch('view', admin)}
                    title="Lihat Detail Admin"
                    class="btn btn-sm btn-square border border-light bg-card text-secondary hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
                  >
                    <Info size={16} />
                  </button>

                  <button
                    type="button"
                    disabled={isActionLoading}
                    on:click={() => dispatch('toggleStatus', admin)}
                    title={admin.status === 'active' ? 'Blokir Admin' : 'Aktifkan Admin'}
                    class="btn btn-sm px-3 border border-light bg-card text-xs font-semibold {admin.status === 'active' ? 'hover:bg-warning/10 hover:text-warning hover:border-warning/30' : 'hover:bg-success/10 hover:text-success hover:border-success/30'} transition-all"
                  >
                    {#if admin.status === 'active'}
                      <Ban size={14} class="mr-1" /> Blokir
                    {:else}
                      <CheckCircle2 size={14} class="mr-1" /> Aktifkan
                    {/if}
                  </button>
                  
                  <button
                    type="button"
                    disabled={isActionLoading}
                    on:click={() => dispatch('remove', admin)}
                    title="Hapus Permanen"
                    class="btn btn-sm btn-square border border-light bg-card text-muted hover:text-error hover:bg-error/10 hover:border-error/30 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

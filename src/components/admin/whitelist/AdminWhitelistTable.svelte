<script lang="ts">
  import { ShieldCheck, CheckCircle, Ban, Info, CheckCircle2, Trash2 } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { AdminEntry } from './whitelist.types';
  import { Badge, Button, Table } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';

  export let admins: AdminEntry[] = [];
  export let isFetching = true;
  export let isActionLoading = false;

  const dispatch = createEventDispatcher<{
    view: AdminEntry;
    toggleStatus: AdminEntry;
    remove: AdminEntry;
  }>();

  const tableHeaders = [
    { label: 'Profil Admin' },
    { label: 'Status Akses', width: '150px' },
    { label: 'Waktu Didaftarkan', width: '180px' },
    { label: 'Aksi', align: 'right' as const, width: '180px' },
  ];
</script>

<div class="bg-card rounded-2xl border border-light shadow-sm overflow-hidden mt-8">
  <div class="px-6 py-5 border-b border-light flex justify-between items-center bg-nested/20">
    <h3 class="font-bold text-main text-sm leading-none pt-2.5">Daftar Administrator Aktif</h3>
    <span class="badge badge-sm badge-outline text-xs font-semibold">{admins.length} Pengguna</span>
  </div>
  
  <Table headers={tableHeaders} minWidth="min-w-[650px]">
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
          <td class="px-6 py-4 text-secondary text-xs font-medium">
            {formatDate(admin.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
          </td>
          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <Button
                variant="secondary"
                size="icon"
                on:click={() => dispatch('view', admin)}
                title="Lihat Detail Admin"
              >
                <Info size={14} />
              </Button>

              <Button
                variant={admin.status === 'active' ? 'orange' : 'primary'}
                size="xs"
                disabled={isActionLoading}
                className="font-bold {admin.status !== 'active' ? '!bg-emerald-600 hover:!bg-emerald-700' : ''}"
                on:click={() => dispatch('toggleStatus', admin)}
                title={admin.status === 'active' ? 'Blokir Admin' : 'Aktifkan Admin'}
              >
                {#if admin.status === 'active'}
                  <Ban size={12} class="mr-1" />
                  <span>Blokir</span>
                {:else}
                  <CheckCircle2 size={12} class="mr-1" />
                  <span>Aktifkan</span>
                {/if}
              </Button>
              
              <Button
                variant="destructive"
                size="icon"
                className="!bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                disabled={isActionLoading}
                on:click={() => dispatch('remove', admin)}
                title="Hapus Permanen"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </td>
        </tr>
      {/each}
    {/if}
  </Table>
</div>

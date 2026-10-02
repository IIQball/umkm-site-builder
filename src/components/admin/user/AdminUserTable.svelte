<script lang="ts">
  import { UserX, AlertCircle, FileText, CheckCircle, Ban, CheckCircle2 } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Badge, Button } from '@/components/ui';
  import { formatDate } from '@/lib/utils/format';

  export let users: AdminUserItem[] = [];
  export let onSuspend: (user: AdminUserItem) => void;
  export let onUnsuspend: (user: AdminUserItem) => void;
  export let onShowDetail: (user: AdminUserItem) => void;

  // Table headers removed since we're using cards
</script>

{#if users.length === 0}
  <div class="py-16 px-8 flex flex-col items-center text-center">
    <div class="w-14 h-14 rounded-2xl bg-nested flex items-center justify-center mb-4 text-muted">
      <UserX size={28} />
    </div>
    <h4 class="text-sm font-bold text-main mb-1.5">Tidak Ada Pengguna</h4>
    <p class="text-xs text-secondary max-w-xs leading-relaxed">
      Belum ada pengguna yang sesuai dengan pencarian atau filter Anda.
    </p>
  </div>
{:else}
  <div class="flex flex-col gap-3 p-4 sm:p-5 bg-card-base/50">
    {#each users as item (item.id)}
      <div class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-card-base rounded-2xl border border-light/60 shadow-xs hover:shadow-sm hover:border-light transition-all duration-300">
        
        <!-- Left: User Info -->
        <div class="flex-1 min-w-0 flex items-start gap-4">
          <!-- Avatar Placeholder -->
          <div class="w-11 h-11 rounded-2xl bg-nested/80 text-secondary flex items-center justify-center shrink-0 border border-light/50 shadow-xs">
            <span class="font-bold text-main uppercase">{item.name.charAt(0)}</span>
          </div>

          <!-- Info Details -->
          <div class="flex flex-col gap-1 w-full">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-bold text-main font-heading text-[15px] group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-xs">
                {item.name}
              </span>
              <span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-nested border border-light uppercase tracking-wider text-secondary">
                {item.role === 'designer' ? 'Desainer' : item.role === 'tenant' ? 'Merchant' : item.role === 'admin' ? 'Admin' : item.role}
              </span>
            </div>
            
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[11px] text-secondary font-medium">
                {item.email}
              </span>
              <span class="text-[10px] text-muted">•</span>
              <span class="text-[11px] text-muted">
                {item.createdAt ? formatDate(item.createdAt, { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Status & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
          
          <!-- Status Badge -->
          <div class="shrink-0 w-32">
            {#if item.status === 'active'}
              <Badge variant="emerald" size="sm" class="w-full justify-center shadow-xs">
                <CheckCircle size={12} strokeWidth={3} class="mr-1 inline" />
                Aktif
              </Badge>
            {:else if item.status === 'pending'}
              <Badge variant="amber" size="sm" class="w-full justify-center shadow-xs">
                <AlertCircle size={12} strokeWidth={3} class="mr-1 inline" />
                Menunggu
              </Badge>
            {:else}
              <Badge variant="rose" size="sm" class="w-full justify-center shadow-xs">
                <Ban size={12} strokeWidth={3} class="mr-1 inline" />
                Ditangguhkan
              </Badge>
            {/if}
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-1.5 border-t sm:border-t-0 sm:border-l border-light/60 pt-3 sm:pt-0 sm:pl-6 shrink-0">
            {#if item.status === 'active'}
              <Button 
                size="sm"
                variant="destructive"
                on:click={() => onSuspend(item)}
                title="Tangguhkan Pengguna"
                className="h-8 px-3 rounded-xl font-bold text-xs hover:scale-105 transition-all"
              >
                <AlertCircle size={13} class="mr-1" />
                <span>Suspend</span>
              </Button>
            {:else if item.status === 'suspended'}
              {#if item.suspendReason}
                <Button 
                  size="sm"
                  variant="ghost"
                  title="Lihat Alasan"
                  on:click={() => onShowDetail(item)}
                  className="h-8 w-8 p-0 rounded-xl text-secondary hover:bg-nested hover:scale-105 transition-all"
                >
                  <FileText size={14} />
                </Button>
              {/if}
              <Button 
                size="sm"
                variant="primary"
                on:click={() => onUnsuspend(item)}
                title="Aktifkan Pengguna"
                className="h-8 px-3 rounded-xl font-bold text-xs hover:scale-105 transition-all"
              >
                <CheckCircle2 size={13} class="mr-1" />
                <span>Unsuspend</span>
              </Button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}

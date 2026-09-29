<script lang="ts">
  import { Card, Button, Input } from '@/components/ui';
  import { UserPlus, Mail, Clock, CheckCircle, RefreshCcw, Link2, Search, XCircle, FileText } from 'lucide-svelte';
  import AdminInviteModal from './AdminInviteModal.svelte';
  import { toast } from '@/lib/toast';

  export let invitations: Array<{
    id: string;
    name: string;
    email: string;
    token: string;
    invitedBy: string;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
  }> = [];
  export let currentUser: { id: string; role?: string } | null = null;

  let searchQuery = '';
  let isAddModalOpen = false;
  let isExtending: string | null = null;

  $: filteredInvitations = invitations.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
  });

  const handleExtend = async (id: string) => {
    isExtending = id;
    try {
      const res = await fetch('/api/admin/invitations/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      
      if (res.ok && result.ok) {
        toast.success(result.data?.message || 'Waktu undangan berhasil diperpanjang');
        window.location.reload();
      } else {
        toast.error(result.error?.message || 'Gagal memperpanjang undangan');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isExtending = null;
    }
  };

  const getStatus = (inv: typeof invitations[0]) => {
    if (inv.acceptedAt) return { label: 'Terdaftar', color: 'badge-success', icon: CheckCircle };
    if (new Date(inv.expiresAt) < new Date()) return { label: 'Kedaluwarsa', color: 'badge-error', icon: XCircle };
    return { label: 'Menunggu', color: 'badge-warning', icon: Clock };
  };
</script>

<div class="space-y-4">
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden">
    <!-- Header -->
    <div class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Link2 size={20} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Daftar Undangan Tenant
            </h3>
            <span class="badge badge-primary badge-outline font-bold text-xs">
              {invitations.length} Undangan
            </span>
          </div>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Kelola link registrasi untuk calon tenant binaan Anda.
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
        {#if invitations.length > 0}
          <div class="w-full sm:w-64">
            <Input
              id="search-invites"
              placeholder="Cari nama / email..."
              bind:value={searchQuery}
              className="text-xs"
            >
              <span slot="prefix" class="text-muted">
                <Search size={14} />
              </span>
            </Input>
          </div>
        {/if}
        <Button
          variant="primary"
          size="md"
          on:click={() => isAddModalOpen = true}
          class="font-bold whitespace-nowrap w-full sm:w-auto"
        >
          <span class="material-symbols-outlined text-white text-base">person_add</span>
          <span>Buat Undangan</span>
        </Button>
      </div>
    </div>

    <!-- Content -->
    {#if invitations.length === 0}
      <div class="p-12 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto shadow-2xs">
          <FileText size={28} />
        </div>
        <div class="max-w-md mx-auto">
          <h4 class="text-heading-sm font-bold text-main font-heading">Belum Ada Undangan</h4>
          <p class="text-body-xs text-secondary mt-1">
            Anda belum pernah membuat undangan registrasi. Klik "Buat Undangan" untuk mengirim link pendaftaran ke calon tenant.
          </p>
        </div>
      </div>
    {:else if filteredInvitations.length === 0}
      <div class="p-8 text-center text-secondary text-sm">
        Tidak ditemukan undangan yang sesuai dengan kata kunci pencarian "{searchQuery}".
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="table table-sm w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-light/80 bg-nested/50 text-3xs uppercase tracking-wider font-bold text-secondary">
              <th class="py-3 px-5 sm:px-6">Nama & Email</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Kedaluwarsa</th>
              <th class="py-3 px-5 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-light/60 text-xs">
            {#each filteredInvitations as inv (inv.id)}
              {@const status = getStatus(inv)}
              <tr class="hover:bg-nested/30 transition-colors group">
                <!-- Info -->
                <td class="py-4 px-5 sm:px-6">
                  <div class="font-bold text-main font-heading text-sm group-hover:text-primary transition-colors">
                    {inv.name}
                  </div>
                  <div class="inline-flex items-center gap-1 text-3xs text-secondary mt-0.5">
                    <Mail size={10} />
                    <span>{inv.email}</span>
                  </div>
                </td>

                <!-- Status -->
                <td class="py-4 px-4">
                  <span class="badge {status.color} badge-outline badge-sm text-3xs font-bold gap-1">
                    <svelte:component this={status.icon} size={12} />
                    <span>{status.label}</span>
                  </span>
                </td>

                <!-- Expired At -->
                <td class="py-4 px-4">
                  <div class="text-xs text-main">
                    {new Date(inv.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div class="text-3xs text-secondary">
                    {new Date(inv.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>

                <!-- Actions -->
                <td class="py-4 px-5 sm:px-6 text-right">
                  {#if !inv.acceptedAt}
                    <Button
                      variant="ghost"
                      size="xs"
                      className="rounded-xl font-bold gap-1 text-primary hover:bg-primary/10"
                      title="Perpanjang Masa Aktif Undangan"
                      on:click={() => handleExtend(inv.id)}
                      disabled={isExtending === inv.id}
                      loading={isExtending === inv.id}
                    >
                      <RefreshCcw size={12} />
                      <span class="hidden lg:inline">Perpanjang Link</span>
                    </Button>
                  {:else}
                    <span class="text-3xs text-secondary italic">Sudah terdaftar</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </Card>
</div>

<AdminInviteModal 
  isOpen={isAddModalOpen} 
  currentUser={currentUser}
  on:close={() => isAddModalOpen = false} 
  on:success={() => {
    isAddModalOpen = false;
    window.location.reload();
  }} 
/>

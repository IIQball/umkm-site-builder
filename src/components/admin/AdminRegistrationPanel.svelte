<script lang="ts">
  import { Card, Button, Input, Modal, StatCard } from '@/components/ui';
  import { FileText, Search, Trash2, UserPlus } from 'lucide-svelte';
  import AdminUserAddModal from '@/components/superadmin/user-management/AdminUserAddModal.svelte';
  import AdminInvitationTable from './AdminInvitationTable.svelte';
  import type { AdminInvitationItem } from './adminInvitation.types';
  import { toast } from '@/lib/toast';
  import { apiFetch } from '@/lib/api/parse-response';

  export let invitations: AdminInvitationItem[] = [];
  export let currentUser: { id: string; role?: string } | null = null;
  export let title = 'Link Registrasi';
  export let description = 'Kelola undangan registrasi.';

  $: targetRoleName = currentUser?.role === 'superadmin' ? 'Admin' : 'Merchant';

  let searchQuery = '';
  let isAddModalOpen = false;
  let isExtending: string | null = null;
  let isDeleting: string | null = null;
  let statusFilter = 'all';
  let currentPage = 1;
  const pageSize = 10;

  $: uniqueInvitations = Object.values(
    invitations.reduce((acc, current) => {
      if (!acc[current.email] || new Date(current.createdAt) > new Date(acc[current.email].createdAt)) {
        acc[current.email] = current;
      }
      return acc;
    }, {} as Record<string, AdminInvitationItem>)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  $: stats = {
    total: uniqueInvitations.length,
    pending: uniqueInvitations.filter((i) => !i.acceptedAt && new Date(i.expiresAt) >= new Date()).length,
    expired: uniqueInvitations.filter((i) => !i.acceptedAt && new Date(i.expiresAt) < new Date()).length,
  };

  $: filteredInvitations = uniqueInvitations.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery.trim() || i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
    let matchesStatus = true;
    if (statusFilter === 'pending') matchesStatus = !i.acceptedAt && new Date(i.expiresAt) >= new Date();
    else if (statusFilter === 'expired') matchesStatus = !i.acceptedAt && new Date(i.expiresAt) < new Date();
    return matchesSearch && matchesStatus;
  });

  const handleExtend = async (id: string) => {
    isExtending = id;
    try {
      const result = await apiFetch<{ message?: string }>('/api/admin/invitations/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
        fallbackError: 'Gagal memperpanjang undangan',
      });
      if (result.success) {
        toast.success(result.message || result.data?.message || 'Waktu undangan berhasil diperpanjang');
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isExtending = null;
    }
  };

  let isDeleteModalOpen = false;
  let deleteTarget: { id: string; message: string; subMessage?: string } | null = null;

  const openDeleteModal = (id: string) => {
    deleteTarget = {
      id,
      message: 'Apakah Anda yakin ingin menghapus undangan ini?',
      subMessage: 'Pengguna yang belum aktivasi tidak akan dapat mendaftar dengan link ini, dan akun sementaranya akan dibersihkan.',
    };
    isDeleteModalOpen = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen = false;
    deleteTarget = null;
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    isDeleting = id;
    try {
      const result = await apiFetch<{ message?: string }>(`/api/admin/invitations/delete?id=${id}`, {
        method: 'DELETE',
        fallbackError: 'Gagal menghapus undangan',
      });
      if (result.success) {
        toast.success(result.message || result.data?.message || 'Undangan berhasil dihapus');
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isDeleting = null;
      closeDeleteModal();
    }
  };
</script>

<div class="space-y-8 md:space-y-10 min-w-0">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 animate-fade-in-up">
    <div class="min-w-0">
      <h1 class="text-heading-lg text-main font-bold tracking-tight flex items-center gap-2.5"><span>{title}</span></h1>
      <p class="text-body-base text-secondary mt-1 max-w-2xl leading-relaxed">{description}</p>
    </div>
    <div class="flex items-center justify-start md:justify-end">
      <Button id="btn-create-invitation" variant="primary" size="md" on:click={() => (isAddModalOpen = true)} class="font-bold whitespace-nowrap shadow-md hover:shadow-lg transition-shadow">
        <UserPlus size={18} class="mr-1.5" />
        <span>Buat Undangan Baru</span>
      </Button>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up">
    <StatCard label="Total Undangan" value={stats.total} badge="Semua" cardTheme="dark" icon="mail" delayClass="delay-100" />
    <StatCard label="Menunggu Aktivasi" value={stats.pending} badge="Pending" cardTheme="default" icon="schedule" delayClass="delay-150" />
    <StatCard label="Kedaluwarsa" value={stats.expired} badge="Hangus" cardTheme="blue" icon="link_off" delayClass="delay-200" />
  </div>

  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden animate-fade-in-up delay-75">
    <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">link</span>
        </div>
        <div class="min-w-0">
          <h3 class="text-heading-md text-main font-bold font-heading leading-tight">Daftar Undangan {targetRoleName}</h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">Kelola link registrasi untuk calon {targetRoleName.toLowerCase()} binaan Anda.</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 max-w-full">
        <Input
          type="search"
          size="sm"
          bind:value={searchQuery}
          placeholder="Cari nama / email..."
          fullWidth={false}
          class="w-44 sm:w-52 !rounded-full !bg-nested/80"
        >
          <Search size={14} slot="prefix" />
        </Input>

        <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto max-w-full">
          <Button
            size="xs"
            variant={statusFilter === 'all' ? 'dark' : 'ghost'}
            class="!rounded-full !px-3.5 font-bold {statusFilter === 'all' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
            on:click={() => (statusFilter = 'all')}
          >
            Semua ({stats.total})
          </Button>
          <Button
            size="xs"
            variant={statusFilter === 'pending' ? 'dark' : 'ghost'}
            class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {statusFilter === 'pending' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
            on:click={() => (statusFilter = 'pending')}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-warning"></span> Menunggu ({stats.pending})
          </Button>
          <Button
            size="xs"
            variant={statusFilter === 'expired' ? 'dark' : 'ghost'}
            class="!rounded-full !px-3.5 font-bold flex items-center gap-1.5 {statusFilter === 'expired' ? 'shadow-2xs' : 'text-muted hover:text-main'}"
            on:click={() => (statusFilter = 'expired')}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-error"></span> Kedaluwarsa ({stats.expired})
          </Button>
        </div>
      </div>
    </div>

    {#if invitations.length === 0}
      <div class="p-12 text-center space-y-4">
        <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center text-muted mx-auto shadow-2xs">
          <FileText size={28} />
        </div>
        <div class="max-w-md mx-auto">
          <h4 class="text-heading-sm font-bold text-main font-heading">Belum Ada Undangan</h4>
          <p class="text-xs text-secondary mt-1">
            Anda belum pernah membuat undangan registrasi. Klik "Buat Undangan" untuk mengirim link pendaftaran ke calon {targetRoleName.toLowerCase()}.
          </p>
        </div>
      </div>
    {:else if filteredInvitations.length === 0}
      <div class="p-8 text-center text-secondary text-sm">
        Tidak ditemukan undangan yang sesuai dengan kata kunci pencarian "{searchQuery}".
      </div>
    {:else}
      <AdminInvitationTable invitations={filteredInvitations} bind:currentPage {pageSize} {isExtending} {isDeleting} onExtend={handleExtend} onDelete={openDeleteModal} />
    {/if}
  </Card>
</div>

<AdminUserAddModal isOpen={isAddModalOpen} {currentUser} on:close={() => (isAddModalOpen = false)} on:success={() => { isAddModalOpen = false; window.location.reload(); }} />

<Modal open={isDeleteModalOpen} on:close={closeDeleteModal} size="sm">
  <svelte:fragment slot="header">
    <h3 class="font-bold text-main text-base flex items-center gap-2 leading-none">
      <Trash2 size={18} class="text-error" />
      <span>Hapus Undangan</span>
    </h3>
  </svelte:fragment>
  <div class="py-2">
    <p class="text-[13px] text-main font-semibold mb-2">{deleteTarget?.message}</p>
    {#if deleteTarget?.subMessage}
      <p class="text-xs text-secondary leading-relaxed p-3 bg-error/5 rounded-xl border border-error/10">
        <span class="text-error font-bold mr-1">Perhatian:</span> {deleteTarget.subMessage}
      </p>
    {/if}
  </div>
  <svelte:fragment slot="footer">
    <div class="w-full flex justify-between items-center">
      <Button variant="secondary" size="sm" on:click={closeDeleteModal} disabled={isDeleting !== null}><span>Batal</span></Button>
      <Button variant="destructive" size="sm" on:click={executeDelete} loading={isDeleting !== null} disabled={isDeleting !== null} className="font-bold px-5">
        <Trash2 size={16} class="mr-1" /> <span>Ya, Hapus</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>

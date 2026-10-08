<script lang="ts">
  import { Card, Button, Badge, Modal, Table, Pagination } from '@/components/ui';
  import { Clock, CheckCircle, XCircle, FileText, UserPlus, Trash2 } from 'lucide-svelte';
  import AdminUserAddModal from './AdminUserAddModal.svelte';
  import AdminUserSuspendModal from './AdminUserSuspendModal.svelte';
  import { toast } from '@/lib/toast';
  import { formatDate } from '@/lib/utils/format';

  export let invitations: Array<{
    id: string;
    name: string;
    email: string;
    token: string;
    invitedBy: string;
    expiresAt: string;
    acceptedAt: string | null;
    createdAt: string;
    userId: string | null;
    userStatus: string | null;
  }> = [];
  export let currentUser: { id: string; role?: string } | null = null;
  export let title: string = 'Link Registrasi';
  export let description: string = 'Kelola undangan registrasi.';

  $: targetRoleName = currentUser?.role === 'superadmin' ? 'Admin' : 'Merchant';

  let searchQuery = '';
  let isAddModalOpen = false;
  let isExtending: string | null = null;
  let isDeleting: string | null = null;
  let isUpdatingUser: string | null = null;

  let isSuspendModalOpen = false;
  let isUnsuspendMode = false;
  let suspendReason = '';
  let suspendTarget: { id: string; name: string } | null = null;
  let actionLoading = false;

  let statusFilter = 'all';

  $: stats = {
    total: invitations.length,
    registered: invitations.filter((i) => i.acceptedAt && i.userStatus === 'active').length,
    pending: invitations.filter((i) => !i.acceptedAt && new Date(i.expiresAt) >= new Date()).length,
  };

  // Deduplicate invitations by email (keep newest by createdAt)
  $: uniqueInvitations = Object.values(invitations.reduce((acc, current) => {
    if (!acc[current.email] || new Date(current.createdAt) > new Date(acc[current.email].createdAt)) {
      acc[current.email] = current;
    }
    return acc;
  }, {} as Record<string, typeof invitations[0]>)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  $: filteredInvitations = uniqueInvitations.filter((i) => {
    // Text search
    const matchesSearch = !searchQuery.trim() || 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') matchesStatus = !!(i.acceptedAt && i.userStatus === 'active');
      else if (statusFilter === 'suspended') matchesStatus = !!(i.acceptedAt && i.userStatus === 'suspended');
      else if (statusFilter === 'pending') matchesStatus = !i.acceptedAt && new Date(i.expiresAt) >= new Date();
      else if (statusFilter === 'expired') matchesStatus = !i.acceptedAt && new Date(i.expiresAt) < new Date();
    }
    
    return matchesSearch && matchesStatus;
  });

  let currentPage = 1;
  const pageSize = 10;
  $: paginatedInvitations = filteredInvitations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  let isDeleteModalOpen = false;
  let deleteTarget: { id: string; type: 'invitation' | 'user'; message: string; subMessage?: string } | null = null;

  const openDeleteModal = (id: string, type: 'invitation' | 'user') => {
    if (type === 'invitation') {
      deleteTarget = {
        id,
        type,
        message: 'Apakah Anda yakin ingin menghapus undangan ini?',
        subMessage: 'Jika pengguna belum aktivasi, akunnya juga akan ikut terhapus.'
      };
    } else {
      deleteTarget = {
        id,
        type,
        message: 'Apakah Anda yakin ingin menghapus pengguna ini?',
        subMessage: 'Seluruh data pengguna beserta tokonya akan terhapus secara permanen.'
      };
    }
    isDeleteModalOpen = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen = false;
    deleteTarget = null;
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    
    if (type === 'invitation') {
      isDeleting = id;
      try {
        const res = await fetch(`/api/admin/invitations/delete?id=${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        
        if (res.ok && result.ok) {
          toast.success(result.data?.message || 'Undangan berhasil dihapus');
          window.location.reload();
        } else {
          toast.error(result.error?.message || 'Gagal menghapus undangan');
        }
      } catch {
        toast.error('Terjadi kesalahan jaringan');
      } finally {
        isDeleting = null;
        closeDeleteModal();
      }
    } else {
      isUpdatingUser = id;
      try {
        const res = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        });
        const result = await res.json();
        
        if (res.ok && result.ok) {
          toast.success('Pengguna berhasil dihapus');
          window.location.reload();
        } else {
          toast.error(result.error?.message || 'Gagal menghapus pengguna');
        }
      } catch {
        toast.error('Terjadi kesalahan jaringan');
      } finally {
        isUpdatingUser = null;
        closeDeleteModal();
      }
    }
  };

  const openSuspendModal = (userId: string, userName: string, isUnsuspend: boolean) => {
    suspendTarget = { id: userId, name: userName };
    isUnsuspendMode = isUnsuspend;
    suspendReason = '';
    isSuspendModalOpen = true;
  };

  const closeSuspendModal = () => {
    isSuspendModalOpen = false;
    suspendTarget = null;
    suspendReason = '';
  };

  const handleUserStatusSubmit = async (status: 'active' | 'suspended', reason?: string) => {
    if (!suspendTarget) return;
    
    actionLoading = true;
    isUpdatingUser = suspendTarget.id;
    try {
      const res = await fetch(`/api/admin/users/${suspendTarget.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, suspendReason: reason }),
      });
      const result = await res.json();
      
      if (res.ok && result.ok) {
        toast.success(`Pengguna berhasil di${status === 'active' ? 'aktifkan' : 'tangguhkan'}`);
        window.location.reload();
      } else {
        toast.error(result.error?.message || 'Gagal mengubah status pengguna');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      actionLoading = false;
      isUpdatingUser = null;
      closeSuspendModal();
    }
  };

  // Deleted handleUserDelete and moved logic to executeDelete

  const getStatus = (inv: typeof invitations[0]) => {
    if (inv.acceptedAt) return { label: 'Terdaftar', color: 'badge-success', icon: CheckCircle };
    if (new Date(inv.expiresAt) < new Date()) return { label: 'Kedaluwarsa', color: 'badge-error', icon: XCircle };
    return { label: 'Menunggu', color: 'badge-warning', icon: Clock };
  };
</script>

<div class="space-y-8 md:space-y-10">
  
  <!-- Page Header Aligned with Button -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 animate-fade-in-up">
    <div>
      <h1 class="text-heading-lg text-main font-bold tracking-tight flex items-center gap-2.5">
        <span>{title}</span>
      </h1>
      <p class="text-body-base text-secondary mt-1 max-w-2xl leading-relaxed">
        {description}
      </p>
    </div>
    
    <div class="flex items-center justify-start md:justify-end">
      <Button
        variant="primary"
        size="md"
        on:click={() => isAddModalOpen = true}
        class="font-bold whitespace-nowrap shadow-md hover:shadow-lg transition-shadow"
      >
        <UserPlus size={18} class="mr-1.5" />
        <span>Buat Undangan Baru</span>
      </Button>
    </div>
  </div>

  <!-- Main Table Panel -->
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden animate-fade-in-up delay-75">
    <!-- Header & Controls -->
    <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">link</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Daftar Undangan {targetRoleName}
            </h3>
          </div>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Kelola link registrasi untuk calon {targetRoleName.toLowerCase()} binaan Anda.
          </p>
        </div>
      </div>

      <!-- Actions & Filter Pills -->
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">search</span>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari nama / email..."
            class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-44 sm:w-52"
          />
        </div>

        <!-- Segmented Status Filter -->
        <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
          <button
            type="button"
            on:click={() => (statusFilter = "all")}
            class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {statusFilter === 'all' ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
          >
            Semua ({stats.total})
          </button>
          <button
            type="button"
            on:click={() => (statusFilter = "active")}
            class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {statusFilter === 'active' ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
            Aktif ({stats.registered})
          </button>
          <button
            type="button"
            on:click={() => (statusFilter = "pending")}
            class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {statusFilter === 'pending' ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-warning"></span>
            Menunggu ({stats.pending})
          </button>
          <button
            type="button"
            on:click={() => (statusFilter = "suspended")}
            class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] flex items-center gap-1.5 {statusFilter === 'suspended' ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-error"></span>
            Ditangguhkan
          </button>
        </div>
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
            Anda belum pernah membuat undangan registrasi. Klik "Buat Undangan" untuk mengirim link pendaftaran ke calon {targetRoleName.toLowerCase()}.
          </p>
        </div>
      </div>
    {:else if filteredInvitations.length === 0}
      <div class="p-8 text-center text-secondary text-sm">
        Tidak ditemukan undangan yang sesuai dengan kata kunci pencarian "{searchQuery}".
      </div>
    {:else}
      <Table 
        headers={[
          { label: '#', align: 'center' as const, width: '40px' },
          { label: 'Nama & Email', align: 'left' as const },
          { label: 'Status', align: 'left' as const, width: 'w-36' },
          { label: 'Tanggal Kedaluwarsa', align: 'left' as const, width: 'w-48' },
          { label: 'Aksi', align: 'right' as const, width: 'w-64' }
        ]} 
        minWidth="min-w-[760px]"
      >
        {#each paginatedInvitations as inv, i (inv.id)}
          {@const status = getStatus(inv)}
          <tr class="hover:bg-nested/40 transition-colors group">
            <!-- Sequence Number (#) -->
            <td class="px-3 py-4 text-center font-mono text-2xs text-secondary font-bold">
              {(currentPage - 1) * pageSize + i + 1}
            </td>
            
            <!-- Nama & Email -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-nested border border-light flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <span class="material-symbols-outlined text-lg text-primary">mail</span>
                </div>
                <div class="min-w-0 max-w-[280px]">
                  <div class="font-bold text-xs text-main truncate block leading-tight font-heading">
                    {inv.name}
                  </div>
                  <div class="text-xs text-secondary mt-0.5 truncate max-w-[200px] font-sans">
                    {inv.email}
                  </div>
                </div>
              </div>
            </td>
            
            <!-- Status Badge -->
            <td class="px-4 py-4 whitespace-nowrap">
              {#if inv.userStatus === 'active'}
                <Badge variant="success" dot={true} size="sm">
                  Aktif
                </Badge>
              {:else if inv.userStatus === 'suspended'}
                <Badge variant="error" dot={true} size="sm">
                  Ditangguhkan
                </Badge>
              {:else}
                <Badge variant={status.color === 'badge-success' ? 'success' : status.color === 'badge-error' ? 'error' : 'warning'} dot={true} size="sm">
                  {status.label}
                </Badge>
              {/if}
            </td>

            <!-- Tanggal -->
            <td class="px-4 py-4 text-2xs text-secondary font-mono whitespace-nowrap">
              {#if inv.acceptedAt}
                -
              {:else}
                {formatDate(inv.expiresAt, { day: 'numeric', month: 'short', year: 'numeric' })}
              {/if}
            </td>

            <!-- Aksi Buttons -->
            <td class="px-6 py-4 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-2">
                {#if !inv.acceptedAt}
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-xl font-bold text-xs"
                    title="Perpanjang Masa Aktif"
                    on:click={() => handleExtend(inv.id)}
                    disabled={isExtending === inv.id || isDeleting === inv.id}
                    loading={isExtending === inv.id}
                  >
                    <span class="material-symbols-outlined text-xs">refresh</span>
                    <span>Perpanjang</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl font-bold text-xs !bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                    title="Hapus Undangan"
                    on:click={() => openDeleteModal(inv.id, 'invitation')}
                    disabled={isExtending === inv.id || isDeleting === inv.id}
                    loading={isDeleting === inv.id}
                  >
                    <span class="material-symbols-outlined text-xs">delete</span>
                    <span>Hapus</span>
                  </Button>
                {:else if inv.userId}
                  {#if inv.userStatus === 'active'}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-xl font-bold text-xs !bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs"
                      title="Tangguhkan"
                      on:click={() => inv.userId && openSuspendModal(inv.userId, inv.name, false)}
                      disabled={isUpdatingUser === inv.userId}
                    >
                      <span class="material-symbols-outlined text-xs">block</span>
                      <span>Suspend</span>
                    </Button>
                  {:else if inv.userStatus === 'suspended'}
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-xl font-bold text-xs"
                      title="Aktifkan"
                      on:click={() => inv.userId && openSuspendModal(inv.userId, inv.name, true)}
                      disabled={isUpdatingUser === inv.userId}
                    >
                      <span class="material-symbols-outlined text-xs">check_circle</span>
                      <span>Aktifkan</span>
                    </Button>
                  {/if}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl font-bold text-xs !bg-nested hover:!bg-rose-500/10 !border-light hover:!border-rose-500/20 !text-secondary hover:!text-rose-600 shadow-2xs ml-1"
                    title="Hapus Pengguna Permanen"
                    on:click={() => inv.userId && openDeleteModal(inv.userId, 'user')}
                    disabled={isUpdatingUser === inv.userId}
                  >
                    <span class="material-symbols-outlined text-xs">delete_forever</span>
                    <span>Hapus Akun</span>
                  </Button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </Table>
      {#if filteredInvitations.length > 0}
        <Pagination
          bind:currentPage={currentPage}
          totalItems={filteredInvitations.length}
          pageSize={pageSize}
        />
      {/if}
    {/if}
  </Card>
</div>

<AdminUserAddModal 
  isOpen={isAddModalOpen} 
  currentUser={currentUser}
  on:close={() => isAddModalOpen = false} 
  on:success={() => {
    isAddModalOpen = false;
    window.location.reload();
  }} 
/>

<AdminUserSuspendModal
  isOpen={isSuspendModalOpen}
  isUnsuspend={isUnsuspendMode}
  selectedUser={suspendTarget}
  bind:suspendReason={suspendReason}
  actionLoading={actionLoading}
  onSubmit={handleUserStatusSubmit}
  onClose={closeSuspendModal}
/>

<Modal open={isDeleteModalOpen} on:close={closeDeleteModal} size="sm">
  <svelte:fragment slot="header">
    <h3 class="font-bold text-main text-base flex items-center gap-2 leading-none">
      <Trash2 size={18} class="text-rose-500" />
      <span>Hapus {deleteTarget?.type === 'invitation' ? 'Undangan' : 'Pengguna'}</span>
    </h3>
  </svelte:fragment>

  <div class="py-2">
    <p class="text-[13px] text-main font-semibold mb-2">
      {deleteTarget?.message}
    </p>
    {#if deleteTarget?.subMessage}
      <p class="text-xs text-secondary leading-relaxed p-3 bg-error/5 rounded-xl border border-error/10">
        <span class="text-error font-bold mr-1">Perhatian:</span>
        {deleteTarget.subMessage}
      </p>
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <div class="w-full flex justify-between items-center">
      <Button variant="secondary" size="sm" on:click={closeDeleteModal} disabled={isDeleting !== null || isUpdatingUser !== null}>
        <span>Batal</span>
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        on:click={executeDelete} 
        loading={isDeleting !== null || isUpdatingUser !== null}
        disabled={isDeleting !== null || isUpdatingUser !== null}
        className="font-bold px-5"
      >
        <Trash2 size={16} class="mr-1" />
        <span>Ya, Hapus</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>

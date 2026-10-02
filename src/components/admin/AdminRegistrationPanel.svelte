<script lang="ts">
  import { Card, Button, Input, StatCard, Select, Badge, Modal, Table } from '@/components/ui';
  import { Mail, Clock, CheckCircle, RefreshCcw, Link2, Search, XCircle, FileText, UserPlus, AlertCircle, CheckCircle2, Trash2, CalendarDays } from 'lucide-svelte';
  import AdminUserAddModal from './AdminUserAddModal.svelte';
  import AdminUserSuspendModal from './AdminUserSuspendModal.svelte';
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
  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif / Terdaftar' },
    { value: 'suspended', label: 'Ditangguhkan' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'expired', label: 'Kedaluwarsa' }
  ];

  $: stats = {
    total: invitations.length,
    registered: invitations.filter((i) => i.acceptedAt && i.userStatus === 'active').length,
    pending: invitations.filter((i) => !i.acceptedAt && new Date(i.expiresAt) >= new Date()).length,
  };

  $: filteredInvitations = invitations.filter((i) => {
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

  <!-- Stat Cards with Premium Look -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
    <StatCard 
      label="Total Undangan" 
      value={stats.total} 
      icon="mail" 
      cardTheme="default" 
      description="Keseluruhan link yang dibuat" 
      delayClass="delay-75" 
    />
    <StatCard 
      label="Aktif" 
      value={stats.registered} 
      icon="check_circle" 
      cardTheme="blue" 
      description="Akun yang telah berhasil daftar" 
      delayClass="delay-100" 
      badge="Verified" 
      badgeCls="border-white/20 text-white" 
    />
    <StatCard 
      label="Menunggu" 
      value={stats.pending} 
      icon="pending_actions" 
      cardTheme="orange" 
      description="Menunggu aktivasi link" 
      delayClass="delay-125" 
    />
  </div>

  <!-- Main Table Panel -->
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden animate-fade-in-up delay-150">
    <!-- Header -->
    <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Link2 size={20} />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Daftar Undangan {targetRoleName}
            </h3>
            <span class="badge badge-primary badge-outline font-bold text-xs hidden sm:inline-flex">
              {invitations.length} Undangan
            </span>
          </div>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Kelola link registrasi untuk calon {targetRoleName.toLowerCase()} binaan Anda.
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
        {#if invitations.length > 0}
          <div class="w-full sm:w-48 shrink-0">
            <Select 
              bind:value={statusFilter}
              options={statusOptions}
            />
          </div>
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
          { label: 'NAMA & EMAIL' },
          { label: 'STATUS' },
          { label: 'TANGGAL KEDALUWARSA' },
          { label: 'AKSI', align: 'right' }
        ]} 
        minWidth="min-w-[800px]"
      >
        {#each filteredInvitations as inv (inv.id)}
          {@const status = getStatus(inv)}
          <tr>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-nested/50 text-secondary flex items-center justify-center shrink-0 border border-light/50">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <div class="flex flex-col">
                  <div class="font-bold text-main font-heading text-sm">{inv.name}</div>
                  <div class="text-xs text-secondary mt-0.5">{inv.email}</div>
                </div>
              </div>
            </td>
            
            <td class="px-6 py-4">
              {#if inv.userStatus === 'active'}
                <Badge variant="emerald" size="sm" class="shadow-xs">
                  <CheckCircle2 size={12} strokeWidth={3} class="mr-1" />
                  Aktif
                </Badge>
              {:else if inv.userStatus === 'suspended'}
                <Badge variant="rose" size="sm" class="shadow-xs">
                  <AlertCircle size={12} strokeWidth={3} class="mr-1" />
                  Ditangguhkan
                </Badge>
              {:else}
                <span class="badge {status.color} badge-outline badge-sm text-[10px] uppercase font-bold tracking-wider shadow-xs">
                  <svelte:component this={status.icon} size={12} class="mr-1" />
                  <span>{status.label}</span>
                </span>
              {/if}
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5 text-secondary text-sm">
                <CalendarDays size={14} />
                <span>{new Date(inv.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                {#if !inv.acceptedAt}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary/10 transition-all"
                    title="Perpanjang Masa Aktif"
                    on:click={() => handleExtend(inv.id)}
                    disabled={isExtending === inv.id || isDeleting === inv.id}
                    loading={isExtending === inv.id}
                  >
                    <RefreshCcw size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"
                    title="Hapus Undangan"
                    on:click={() => openDeleteModal(inv.id, 'invitation')}
                    disabled={isExtending === inv.id || isDeleting === inv.id}
                    loading={isDeleting === inv.id}
                  >
                    <Trash2 size={15} />
                  </Button>
                {:else if inv.userId}
                  {#if inv.userStatus === 'active'}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 px-3 rounded-lg font-bold text-xs hover:scale-105 transition-all"
                      title="Tangguhkan"
                      on:click={() => inv.userId && openSuspendModal(inv.userId, inv.name, false)}
                      disabled={isUpdatingUser === inv.userId}
                    >
                      <AlertCircle size={14} class="mr-1" />
                      Suspend
                    </Button>
                  {:else if inv.userStatus === 'suspended'}
                    <Button
                      size="sm"
                      variant="primary"
                      className="h-8 px-3 rounded-lg font-bold text-xs hover:scale-105 transition-all"
                      title="Aktifkan"
                      on:click={() => inv.userId && openSuspendModal(inv.userId, inv.name, true)}
                      disabled={isUpdatingUser === inv.userId}
                    >
                      <CheckCircle2 size={14} class="mr-1" />
                      Unsuspend
                    </Button>
                  {/if}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all ml-1"
                    title="Hapus Pengguna Permanen"
                    on:click={() => inv.userId && openDeleteModal(inv.userId, 'user')}
                    disabled={isUpdatingUser === inv.userId}
                  >
                    <Trash2 size={15} />
                  </Button>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </Table>
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
      <p class="text-xs text-secondary leading-relaxed p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
        <span class="text-rose-500 font-bold mr-1">Perhatian:</span>
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

<script lang="ts">
  import { onMount } from 'svelte';
  import { Search } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Card, Input, StatCard } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import AdminUserSuspendModal from './AdminUserSuspendModal.svelte';
  import AdminUserDetailModal from './AdminUserDetailModal.svelte';
  import AdminUserTable from './user/AdminUserTable.svelte';

  export let initialUsersJson: string = '[]';
  export let currentUser: any = null;
  let users: AdminUserItem[] = [];
  
  // Try to parse initial JSON if provided
  try {
    if (initialUsersJson !== '[]') {
      users = JSON.parse(initialUsersJson);
    }
  } catch (e) {
    users = [];
  }

  let isLoading = false;
  let selectedUser: AdminUserItem | null = null;
  let suspendModalOpen = false;
  let unsuspendModalOpen = false;
  let detailModalOpen = false;
  let suspendReason = '';
  let actionLoading = false;
  
  // Basic filtering state
  let searchQuery = '';
  let roleFilter: 'all' | 'tenant' | 'designer' = 'all';
  let statusFilter: 'all' | 'active' | 'suspended' = 'all';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  };

  const fetchUsers = async () => {
    isLoading = true;
    try {
      const res = await fetch('/api/admin/users');
      const result = await res.json();
      if (result.ok && Array.isArray(result.data)) {
        users = result.data;
      } else if (result.error) {
        showToast(result.error.message || 'Gagal memuat pengguna', 'error');
      }
    } catch {
      showToast('Gagal memuat daftar pengguna', 'error');
    } finally {
      isLoading = false;
    }
  };

  onMount(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  });

  const openSuspendModal = (user: AdminUserItem) => {
    selectedUser = user;
    suspendReason = '';
    suspendModalOpen = true;
  };

  const openUnsuspendModal = (user: AdminUserItem) => {
    selectedUser = user;
    suspendReason = '';
    unsuspendModalOpen = true;
  };

  const openDetailModal = (user: AdminUserItem) => {
    selectedUser = user;
    detailModalOpen = true;
  };

  const closeModal = () => { 
    suspendModalOpen = false; 
    unsuspendModalOpen = false;
    detailModalOpen = false;
    selectedUser = null; 
    suspendReason = ''; 
  };

  const submitStatusUpdate = async (newStatus: 'active' | 'suspended', reason?: string) => {
    if (!selectedUser) return;
    
    const finalReason = newStatus === 'suspended' ? (reason || suspendReason) : undefined;

    if (newStatus === 'suspended' && (!finalReason || finalReason.trim().length < 5)) {
      showToast('Alasan penangguhan minimal 5 karakter', 'error');
      return;
    }
    
    actionLoading = true;
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus, 
          suspendReason: finalReason
        }),
      });
      const result = await res.json();
      
      if (res.ok && (result.ok || result.success)) {
        showToast(newStatus === 'active' ? 'Akun berhasil diaktifkan' : 'Akun berhasil ditangguhkan', 'success');
        closeModal();
        await fetchUsers();
      } else {
        let errorMsg = result.error?.message || 'Gagal memperbarui status akun';
        if (result.error?.details) {
          const detailVals = Object.values(result.error.details).flat().filter(Boolean);
          if (detailVals.length > 0) {
            errorMsg = detailVals[0] as string;
          }
        }
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan koneksi', 'error');
    } finally {
      actionLoading = false;
    }
  };

  $: filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleOptions = [
    { value: 'all', label: 'Semua Peran' },
    { value: 'tenant', label: 'Merchant' },
    { value: 'designer', label: 'Desainer' },
    ...(currentUser?.role === 'superadmin' ? [{ value: 'admin', label: 'Admin' }] : [])
  ];

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
    { value: 'pending', label: 'Menunggu Aktivasi' },
    { value: 'suspended', label: 'Ditangguhkan' }
  ];
</script>

<div class="space-y-6 md:space-y-8 animate-fade-in-up">
  <!-- Page Header -->
  <div class="flex flex-col gap-6 pb-2">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-heading-lg text-main font-bold tracking-tight flex items-center gap-2.5">
          <span>Manajemen Pengguna</span>
        </h1>
        <p class="text-body-base text-secondary mt-1 max-w-2xl leading-relaxed">
          Kelola dan tinjau status akun pengguna di platform.
        </p>
      </div>

    </div>
    

  </div>


  <!-- User Stats Summary -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard label="Ditangguhkan" value={users.filter(u => u.status === 'suspended').length} badge="Perhatian" cardTheme="dark" icon="block" delayClass="delay-100" />
    <StatCard label="Total Pengguna" value={users.length} badge="Semua" cardTheme="default" icon="group" delayClass="delay-150" />
    <StatCard label="Pengguna Aktif" value={users.filter(u => u.status === 'active').length} badge="Sehat" cardTheme="blue" icon="check_circle" delayClass="delay-175" />
    <StatCard label="Menunggu Aktivasi" value={users.filter(u => u.status === 'pending').length} badge="Baru" cardTheme="orange" icon="pending_actions" delayClass="delay-200" />
  </div>

  <div class="flex flex-col gap-4">
    <!-- Search Bar -->
    <div class="relative w-full md:w-96">
      <Input 
        bind:value={searchQuery}
        placeholder="Cari nama atau email..." 
        size="md"
      >
        <div slot="prefix"><Search size={18} class="text-muted" /></div>
      </Input>
    </div>
    
    <!-- Filter Pills -->
    <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
      {#if currentUser?.role === 'superadmin'}
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        {#each roleOptions as opt}
          <button 
            type="button"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap {roleFilter === opt.value ? 'bg-main text-canvas shadow-xs' : 'bg-card-base text-secondary hover:bg-nested border border-light/50 hover:text-main'}"
            on:click={() => roleFilter = opt.value as any}
          >
            {opt.label}
          </button>
        {/each}
      </div>
      
      <div class="hidden sm:block w-px h-6 bg-light"></div>
      {/if}

      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
        {#each statusOptions as opt}
          <button 
            type="button"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap {statusFilter === opt.value ? 'bg-main text-canvas shadow-xs' : 'bg-card-base text-secondary hover:bg-nested border border-light/50 hover:text-main'}"
            on:click={() => statusFilter = opt.value as any}
          >
            {opt.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <Card variant="bordered" padding="none" radius="2xl" class="overflow-hidden shadow-xs">
    {#if isLoading && users.length === 0}
      <div class="flex justify-center items-center py-16">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    {:else}
      <AdminUserTable
        users={filteredUsers}
        onSuspend={openSuspendModal}
        onUnsuspend={openUnsuspendModal}
        onShowDetail={openDetailModal}
      />
    {/if}
  </Card>
</div>

<!-- Modals -->
<AdminUserSuspendModal
  isOpen={suspendModalOpen || unsuspendModalOpen}
  isUnsuspend={unsuspendModalOpen}
  {selectedUser}
  bind:suspendReason
  {actionLoading}
  onSubmit={submitStatusUpdate}
  onClose={closeModal}
/>

<AdminUserDetailModal
  isOpen={detailModalOpen}
  selectedUser={selectedUser}
  onClose={closeModal}
/>




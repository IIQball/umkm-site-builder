<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, CheckCircle2, AlertCircle } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Card, Button, Input, Select } from '@/components/ui';
  import AdminUserSuspendModal from './AdminUserSuspendModal.svelte';
  import AdminUserDetailModal from './AdminUserDetailModal.svelte';
  import AdminUserAddModal from './AdminUserAddModal.svelte';
  import AdminUserTable from './user/AdminUserTable.svelte';

  export let initialUsersJson: string = '[]';
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
  let isAddModalOpen = false;
  let suspendReason = '';
  let actionLoading = false;
  let toast: { message: string; type: 'success' | 'error' } | null = null;
  
  // Basic filtering state
  let searchQuery = '';
  let roleFilter: 'all' | 'tenant' | 'designer' = 'all';
  let statusFilter: 'all' | 'active' | 'suspended' = 'all';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast = { message, type };
    setTimeout(() => { if (toast?.message === message) toast = null; }, 4000);
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
    { value: 'tenant', label: 'Tenant' },
    { value: 'designer', label: 'Desainer' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'active', label: 'Aktif' },
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

      <div class="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="secondary"
          size="md"
          on:click={() => isAddModalOpen = true}
          class="font-bold"
        >
          <span class="material-symbols-outlined text-primary text-base">person_add</span>
          <span>Tambah Pengguna</span>
        </Button>
      </div>
    </div>
    
    <div class="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
        <div class="w-full sm:w-64 xl:w-72 relative">
          <Input 
            bind:value={searchQuery}
            placeholder="Cari nama atau email..." 
            size="md"
          >
            <div slot="prefix"><Search size={18} class="text-muted" /></div>
          </Input>
        </div>
        
        <div class="flex gap-3 w-full sm:w-auto">
          <div class="w-full sm:w-40">
            <Select 
              bind:value={roleFilter}
              options={roleOptions}
              size="md"
            />
          </div>
          <div class="w-full sm:w-40">
            <Select 
              bind:value={statusFilter}
              options={statusOptions}
              size="md"
            />
          </div>
        </div>
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

<AdminUserAddModal 
  isOpen={isAddModalOpen} 
  on:close={() => isAddModalOpen = false} 
  on:success={() => { isAddModalOpen = false; fetchUsers(); }} 
/>

{#if toast}
  <div class="fixed bottom-4 right-4 z-[9999] transition-all animate-fade-in-up">
    <div 
      class="alert text-xs rounded-xl flex items-center gap-2 px-4 py-3 shadow-lg {toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}"
    >
      {#if toast.type === 'success'}
        <CheckCircle2 size={16} class="flex-shrink-0" />
      {:else}
        <AlertCircle size={16} class="flex-shrink-0" />
      {/if}
      <span class="font-bold">{toast.message}</span>
    </div>
  </div>
{/if}

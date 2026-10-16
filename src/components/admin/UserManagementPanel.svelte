<script lang="ts">
  import { onMount } from 'svelte';
  import type { AdminUserItem } from '@/types';
  import { Card, StatCard, Pagination } from '@/components/ui';
  import { toast } from '@/lib/toast';
  import AdminUserSuspendModal from './AdminUserSuspendModal.svelte';
  import AdminUserDetailModal from './AdminUserDetailModal.svelte';
  import AdminUserQuotaModal from './user/AdminUserQuotaModal.svelte';
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
  let quotaModalOpen = false;
  let suggestedAddProducts = 0;
  let suggestedAddCategories = 0;
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
        checkUrlForQuotaAction();
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
    } else {
      checkUrlForQuotaAction();
    }
  });

  const checkUrlForQuotaAction = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'quota') {
      const tenantId = params.get('tenantId');
      if (tenantId) {
        const u = users.find(u => u.id === tenantId);
        if (u) {
          openQuotaModal(
            u, 
            Number(params.get('addProd')) || 0, 
            Number(params.get('addCat')) || 0
          );
          
          // clean URL
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
  };

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

  const openQuotaModal = (user: AdminUserItem, addProd = 0, addCat = 0) => {
    selectedUser = user;
    suggestedAddProducts = addProd;
    suggestedAddCategories = addCat;
    quotaModalOpen = true;
  };

  const closeModal = () => { 
    suspendModalOpen = false; 
    unsuspendModalOpen = false;
    detailModalOpen = false;
    quotaModalOpen = false;
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

  let currentPage = 1;
  const pageSize = 10;
  $: paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const roleOptions = [
    { value: 'all', label: 'Semua Peran' },
    { value: 'tenant', label: 'Merchant' },
    { value: 'designer', label: 'Desainer' },
    ...(currentUser?.role === 'superadmin' ? [{ value: 'admin', label: 'Admin' }] : [])
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

    </div>
    

  </div>


  <!-- User Stats Summary -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <StatCard label="Total Pengguna" value={users.length} badge="Semua" cardTheme="dark" icon="group" delayClass="delay-100" />
    <StatCard label="Pengguna Aktif" value={users.filter(u => u.status === 'active').length} badge="Sehat" cardTheme="default" icon="check_circle" delayClass="delay-150" />
    <StatCard label="Ditangguhkan" value={users.filter(u => u.status === 'suspended').length} badge="Perhatian" cardTheme="blue" icon="block" delayClass="delay-200" />
  </div>

  <Card variant="bordered" padding="none" radius="2xl" class="overflow-hidden shadow-xs animate-fade-in-up delay-75">
    <!-- Header & Controls -->
    <div class="p-5 sm:p-6 border-b border-light flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">group</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-heading-md text-main font-bold font-heading leading-tight">
              Daftar Pengguna
            </h3>
          </div>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">
            Kelola dan tinjau seluruh akun pengguna di platform.
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
            placeholder="Cari nama atau email..."
            class="bg-nested/80 border border-light rounded-full pl-8 pr-3 py-1.5 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary focus:bg-card transition-all w-44 sm:w-52"
          />
        </div>

        {#if currentUser?.role === 'superadmin'}
          <!-- Segmented Role Filter -->
          <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
            {#each roleOptions as opt}
              <button
                type="button"
                on:click={() => (roleFilter = opt.value as any)}
                class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {roleFilter === opt.value ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
              >
                {opt.label}
              </button>
            {/each}
          </div>
        {/if}

        <!-- Segmented Status Filter -->
        <div class="flex items-center gap-1 bg-nested/80 border border-light rounded-full p-1 overflow-x-auto">
          {#each statusOptions as opt}
            <button
              type="button"
              on:click={() => (statusFilter = opt.value as any)}
              class="px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-[0.98] {statusFilter === opt.value ? 'bg-main text-canvas dark:bg-primary shadow-2xs' : 'text-muted hover:text-main'}"
            >
              {opt.label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    {#if isLoading && users.length === 0}
      <div class="flex justify-center items-center py-16">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    {:else}
      <AdminUserTable
        users={paginatedUsers}
        startIndex={(currentPage - 1) * pageSize}
        onSuspend={openSuspendModal}
        onUnsuspend={openUnsuspendModal}
        onShowDetail={openDetailModal}
        onManageQuota={(u) => openQuotaModal(u)}
      />
      {#if filteredUsers.length > 0}
        <Pagination
          bind:currentPage={currentPage}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
        />
      {/if}
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

<AdminUserQuotaModal
  isOpen={quotaModalOpen}
  selectedUser={selectedUser}
  {suggestedAddProducts}
  {suggestedAddCategories}
  onClose={closeModal}
/>




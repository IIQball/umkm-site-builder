<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, UserX, CheckCircle2, AlertCircle, Users } from 'lucide-svelte';
  import type { AdminUserItem } from '@/types';
  import { Badge, Card, Button, Input, Select } from '@/components/ui';
  import AdminUserSuspendModal from './AdminUserSuspendModal.svelte';
  import AdminUserDetailModal from './AdminUserDetailModal.svelte';

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
      if (result.success && Array.isArray(result.data)) {
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

  const openSuspendModal = (u: AdminUserItem) => { 
    selectedUser = u; 
    suspendReason = ''; 
    suspendModalOpen = true; 
  };
  
  const openUnsuspendModal = (u: AdminUserItem) => { 
    selectedUser = u; 
    unsuspendModalOpen = true; 
  };
  
  const openDetailModal = (u: AdminUserItem) => {
    selectedUser = u;
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
      
      if (res.ok && (result.success || result.ok)) {
        showToast(newStatus === 'active' ? 'Akun berhasil diaktifkan' : 'Akun berhasil ditangguhkan', 'success');
        closeModal();
        await fetchUsers();
      } else {
        let errorMsg = result.error?.message || 'Gagal memperbarui status akun';
        if (result.details) {
          const detailVals = Object.values(result.details).flat().filter(Boolean);
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

  const formatDate = (d: string): string => {
    return d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
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
  <Card variant="bordered" padding="lg" radius="2xl" className="shadow-xs hover:shadow-md transition-all">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
          <Users size={20} />
        </div>
        <div>
          <h1 class="text-heading-md font-bold text-main leading-tight">Manajemen Pengguna</h1>
          <p class="text-body-sm text-secondary mt-0.5">Kelola dan tinjau status akun pengguna di platform</p>
        </div>
      </div>
      
      <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div class="w-full md:w-64 relative">
          <Input 
            bind:value={searchQuery}
            placeholder="Cari nama atau email..." 
            size="sm"
          >
            <div slot="prefix"><Search size={16} /></div>
          </Input>
        </div>
        
        <div class="flex gap-2 w-full md:w-auto">
          <div class="w-full md:w-36">
            <Select 
              bind:value={roleFilter}
              options={roleOptions}
              size="sm"
            />
          </div>
          <div class="w-full md:w-40">
            <Select 
              bind:value={statusFilter}
              options={statusOptions}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  </Card>

  <Card variant="bordered" padding="none" radius="2xl" className="overflow-hidden shadow-xs">
    {#if isLoading && users.length === 0}
      <div class="flex justify-center items-center py-16">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    {:else if filteredUsers.length === 0}
      <div class="py-16 px-8 flex flex-col items-center text-center">
        <div class="w-14 h-14 rounded-2xl bg-nested flex items-center justify-center mb-4 text-muted">
          <UserX size={28} />
        </div>
        <h4 class="text-sm font-bold text-main mb-1.5">Tidak Ada Pengguna</h4>
        <p class="text-xs text-secondary max-w-xs leading-relaxed">Belum ada pengguna yang sesuai dengan pencarian atau filter Anda.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px]">
          <thead>
            <tr class="bg-nested/60 border-b border-light">
              <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-4">Pengguna</th>
              <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-4">Peran</th>
              <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-4">Tanggal Daftar</th>
              <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-4">Status</th>
              <th class="text-right text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border-light)]">
            {#each filteredUsers as item (item.id)}
              <tr class="hover:bg-nested/40 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-bold text-xs text-main">{item.name}</p>
                  <p class="text-xs text-muted truncate max-w-[200px]">{item.email}</p>
                </td>
                <td class="px-4 py-4">
                  <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-nested border border-light uppercase tracking-wider text-secondary">
                    {item.role === 'designer' ? 'Desainer' : item.role === 'tenant' ? 'Tenant' : item.role}
                  </span>
                </td>
                <td class="px-4 py-4 text-xs text-muted">
                  {formatDate(item.createdAt)}
                </td>
                <td class="px-4 py-4">
                  {#if item.status === 'active'}
                    <Badge variant="emerald" dot size="sm">
                      AKTIF
                    </Badge>
                  {:else}
                    <Badge variant="rose" dot size="sm">
                      DITANGGUHKAN
                    </Badge>
                  {/if}
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    {#if item.status === 'active'}
                      <Button 
                        size="xs"
                        variant="destructive"
                        on:click={() => openSuspendModal(item)}
                      >
                        Tangguhkan
                      </Button>
                    {:else}
                      {#if item.suspendReason}
                        <Button 
                          size="xs"
                          variant="outline"
                          title="Lihat Alasan"
                          on:click={() => openDetailModal(item)}
                        >
                          Alasan
                        </Button>
                      {/if}
                      <Button 
                        size="xs"
                        class="!bg-success hover:!bg-success/90 text-white"
                        on:click={() => openUnsuspendModal(item)}
                      >
                        Aktifkan
                      </Button>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
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
  {selectedUser}
  onClose={closeModal}
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

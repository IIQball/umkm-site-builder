<script context="module" lang="ts">
  export type AdminUserItem = {
    id: string;
    name: string;
    email: string;
    role: 'tenant' | 'designer';
    status: 'active' | 'suspended';
    suspendReason: string | null;
    createdAt: string;
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';

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

  const submitStatusUpdate = async (newStatus: 'active' | 'suspended') => {
    if (!selectedUser) return;
    
    if (newStatus === 'suspended' && suspendReason.trim().length < 5) {
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
          suspendReason: newStatus === 'suspended' ? suspendReason : undefined 
        }),
      });
      const result = await res.json();
      if (res.ok && (result.success || result.ok)) {
        showToast(newStatus === 'active' ? 'Akun berhasil diaktifkan' : 'Akun berhasil ditangguhkan', 'success');
        closeModal();
        await fetchUsers();
      } else {
        showToast(result.error?.message || 'Gagal memperbarui status akun', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi', 'error');
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
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl font-black text-main tracking-tight animate-fade-in">Manajemen Pengguna</h1>
      <p class="text-sm text-secondary mt-1">Kelola dan tinjau status akun pengguna di platform</p>
    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-4 items-center bg-card border border-light p-4 rounded-2xl shadow-sm">
    <div class="flex-1 w-full relative">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg pointer-events-none">search</span>
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Cari berdasarkan nama atau email..." 
        class="w-full pl-10 pr-4 py-2 bg-nested text-main border border-light focus:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-colors"
      />
    </div>
    
    <div class="flex gap-2 w-full md:w-auto">
      <select 
        bind:value={roleFilter}
        class="px-3 py-2 bg-nested text-main border border-light focus:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-colors cursor-pointer w-full md:w-40"
      >
        <option value="all">Semua Peran</option>
        <option value="tenant">Tenant</option>
        <option value="designer">Desainer</option>
      </select>

      <select 
        bind:value={statusFilter}
        class="px-3 py-2 bg-nested text-main border border-light focus:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-colors cursor-pointer w-full md:w-40"
      >
        <option value="all">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="suspended">Ditangguhkan</option>
      </select>
    </div>
  </div>

  {#if isLoading && users.length === 0}
    <div class="flex justify-center items-center py-16 bg-card rounded-2xl border border-light shadow-sm">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  {:else if filteredUsers.length === 0}
    <div class="bg-card border border-light rounded-2xl py-16 px-8 flex flex-col items-center text-center shadow-sm">
      <div class="w-14 h-14 rounded-2xl bg-nested border border-light flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-muted">group_off</span>
      </div>
      <h4 class="text-sm font-bold text-main mb-1.5">Tidak Ada Pengguna</h4>
      <p class="text-xs text-secondary max-w-xs leading-relaxed">Belum ada pengguna yang sesuai dengan pencarian atau filter Anda.</p>
    </div>
  {:else}
    <div class="overflow-x-auto bg-card rounded-2xl border border-light shadow-sm">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr class="bg-nested border-b border-light">
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Pengguna</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Peran</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Tanggal Daftar</th>
            <th class="text-left text-xs font-extrabold uppercase tracking-widest text-muted px-4 py-3">Status</th>
            <th class="text-right text-xs font-extrabold uppercase tracking-widest text-muted px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-border-light)]">
          {#each filteredUsers as item (item.id)}
            <tr class="hover:bg-nested transition-colors">
              <td class="px-6 py-3.5">
                <p class="font-bold text-xs text-main">{item.name}</p>
                <p class="text-xs text-muted truncate max-w-[200px]">{item.email}</p>
              </td>
              <td class="px-4 py-3.5">
                <span class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-nested border border-light uppercase tracking-wider text-secondary">
                  {item.role === 'designer' ? 'Desainer' : item.role === 'tenant' ? 'Tenant' : item.role}
                </span>
              </td>
              <td class="px-4 py-3.5 text-xs text-muted">
                {formatDate(item.createdAt)}
              </td>
              <td class="px-4 py-3.5">
                {#if item.status === 'active'}
                  <span class="badge-custom badge-custom-emerald text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0"></span>
                    AKTIF
                  </span>
                {:else}
                  <div class="flex items-center">
                    <span class="badge-custom badge-custom-rose text-[10px]">
                      <span class="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0"></span>
                      DITANGGUHKAN
                    </span>
                  </div>
                {/if}
              </td>
              <td class="px-6 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  {#if item.status === 'active'}
                    <button 
                      type="button" 
                      on:click={() => openSuspendModal(item)} 
                      class="btn btn-xs bg-error border-none text-white font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Tangguhkan
                    </button>
                  {:else}
                    {#if item.suspendReason}
                      <button 
                        type="button" 
                        on:click={() => openDetailModal(item)} 
                        class="btn btn-xs btn-outline border-light hover:border-main hover:bg-nested text-muted hover:text-main font-bold rounded-lg shadow-sm cursor-pointer"
                        title="Lihat Alasan"
                      >
                        Alasan
                      </button>
                    {/if}
                    <button 
                      type="button" 
                      on:click={() => openUnsuspendModal(item)} 
                      class="btn btn-xs bg-success border-none text-white font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Aktifkan
                    </button>
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if suspendModalOpen && selectedUser}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 animate-fade-in">
      <h3 class="font-bold text-sm text-main">Tangguhkan Pengguna</h3>
      <p class="text-xs text-secondary leading-relaxed">Berikan alasan penangguhan untuk akun <strong>{selectedUser.name}</strong>:</p>
      <textarea 
        bind:value={suspendReason} 
        placeholder="Alasan penangguhan (min 5 karakter)..." 
        class="w-full px-3 py-2 bg-nested text-main border border-light focus:border-primary rounded-xl text-xs font-semibold focus:outline-none transition-colors h-24"
      ></textarea>
      <div class="flex items-center justify-end gap-2 pt-2">
        <button type="button" class="inline-flex items-center justify-center text-xs font-bold text-secondary hover:text-main hover:bg-nested rounded-xl px-4 py-2.5 transition-colors cursor-pointer" on:click={closeModal} disabled={actionLoading}>Batal</button>
        <button type="button" class="btn btn-sm bg-error border-none text-white text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer" on:click={() => submitStatusUpdate('suspended')} disabled={actionLoading || suspendReason.trim().length < 5}>
          {actionLoading ? 'Memproses...' : 'Tangguhkan'}
        </button>
      </div>
    </div>
  </div>
{/if}

{#if unsuspendModalOpen && selectedUser}
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-card border border-light rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 animate-fade-in">
      <h3 class="font-bold text-sm text-main">Aktifkan Pengguna</h3>
      <p class="text-xs text-secondary leading-relaxed">Apakah Anda yakin ingin mengaktifkan kembali akun <strong>{selectedUser.name}</strong>?</p>
      <div class="flex items-center justify-end gap-2 pt-2">
        <button type="button" class="inline-flex items-center justify-center text-xs font-bold text-secondary hover:text-main hover:bg-nested rounded-xl px-4 py-2.5 transition-colors cursor-pointer" on:click={closeModal} disabled={actionLoading}>Batal</button>
        <button type="button" class="btn btn-sm bg-success border-none text-white text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer" on:click={() => submitStatusUpdate('active')} disabled={actionLoading}>
          {actionLoading ? 'Memproses...' : 'Aktifkan Akun'}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Detail Alasan Modal -->
{#if detailModalOpen && selectedUser}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="bg-card w-full max-w-sm rounded-3xl shadow-xl overflow-hidden border border-light scale-100 transition-transform">
      <div class="p-6">
        <div class="w-12 h-12 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-2xl text-error">info</span>
        </div>
        <h3 class="text-lg font-black text-main mb-1">Alasan Penangguhan</h3>
        <p class="text-xs text-muted mb-4 font-medium">Informasi penangguhan untuk akun <strong>{selectedUser.name}</strong></p>
        
        <div class="bg-nested border border-light rounded-xl p-4">
          <p class="text-sm font-semibold text-main leading-relaxed whitespace-pre-wrap">{selectedUser.suspendReason}</p>
        </div>
        
        <div class="flex items-center justify-end gap-2 pt-6">
          <button type="button" class="btn btn-sm bg-nested text-secondary hover:text-main border-none font-bold rounded-xl px-4 py-2" on:click={closeModal}>Tutup</button>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if toast}
  <div class="fixed bottom-4 right-4 z-50 transition-all animate-fade-in">
    <div 
      class="alert text-xs rounded-xl flex items-center gap-2 px-4 py-3 shadow-lg {toast.type === 'success' ? 'alert-success' : 'alert-error'}"
    >
      <span class="material-symbols-outlined text-base flex-shrink-0">
        {toast.type === 'success' ? 'check_circle' : 'error'}
      </span>
      <span class="font-bold">{toast.message}</span>
    </div>
  </div>
{/if}

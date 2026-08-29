<script lang="ts">
  import { onMount } from 'svelte';
  import { ShieldCheck, Plus } from 'lucide-svelte';
  import { toast } from '@/lib/toast';
  import type { AdminEntry, ConfirmModalState } from './whitelist/whitelist.types';
  
  import AdminAddModal from './whitelist/AdminAddModal.svelte';
  import AdminWhitelistTable from './whitelist/AdminWhitelistTable.svelte';
  import AdminDetailModal from './whitelist/AdminDetailModal.svelte';
  import AdminConfirmModal from './whitelist/AdminConfirmModal.svelte';
  import StatCard from '../ui/StatCard.svelte';

  let admins: AdminEntry[] = [];
  
  let isActionLoading = false;
  let isFetching = true;
  
  // State for View Details Modal
  let selectedAdmin: AdminEntry | null = null;
  // State for Custom Confirm Modal
  let confirmModal: ConfirmModalState | null = null;
  // State for Add Modal
  let isAddModalOpen = false;

  $: totalAdmins = admins.length;
  $: activeAdmins = admins.filter(a => a.status === 'active').length;
  $: suspendedAdmins = admins.filter(a => a.status === 'suspended').length;

  const fetchAdmins = async () => {
    isFetching = true;
    try {
      const res = await fetch('/api/admin/whitelist');
      const result = await res.json();
      if (res.ok && result.success) {
        admins = result.data;
      }
    } catch {
      toast.error('Gagal mengambil data admin');
    } finally {
      isFetching = false;
    }
  };

  onMount(fetchAdmins);

  const requestToggleStatus = (event: CustomEvent<AdminEntry>) => {
    const admin = event.detail;
    confirmModal = { isOpen: true, type: 'toggle', id: admin.id, adminName: admin.name, currentStatus: admin.status };
  };

  const executeToggleStatus = async () => {
    if (!confirmModal || confirmModal.type !== 'toggle') return;
    const { id, currentStatus } = confirmModal;
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const actionName = currentStatus === 'active' ? 'memblokir' : 'mengaktifkan kembali';
    
    confirmModal = null;
    isActionLoading = true;

    try {
      const res = await fetch(`/api/admin/whitelist?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Akses admin berhasil ${newStatus === 'active' ? 'diaktifkan' : 'diblokir'}`);
        await fetchAdmins();
      } else {
        toast.error(result.error?.message || `Gagal ${actionName} admin`);
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isActionLoading = false;
    }
  };

  const requestRemove = (event: CustomEvent<AdminEntry>) => {
    const admin = event.detail;
    confirmModal = { isOpen: true, type: 'remove', id: admin.id, adminName: admin.name };
  };

  const executeRemove = async () => {
    if (!confirmModal || confirmModal.type !== 'remove') return;
    const { id } = confirmModal;
    
    confirmModal = null;
    isActionLoading = true;

    try {
      const res = await fetch(`/api/admin/whitelist?id=${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success('Akun admin berhasil dihapus permanen');
        if (selectedAdmin?.id === id) selectedAdmin = null;
        await fetchAdmins();
      } else {
        toast.error(result.error?.message || 'Gagal menghapus admin');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isActionLoading = false;
    }
  };

  const handleConfirmAction = () => {
    if (confirmModal?.type === 'remove') {
      executeRemove();
    } else if (confirmModal?.type === 'toggle') {
      executeToggleStatus();
    }
  };
</script>

<div class="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-light pb-6">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <h1 class="text-heading-md text-main">Manajemen Admin</h1>
      </div>
      <p class="text-body-base text-secondary mt-0.5 max-w-xl leading-relaxed">
        Buat akun Administrator baru secara langsung. Admin yang terdaftar dapat mengelola operasional platform sesuai otoritas yang diberikan.
      </p>
    </div>
    
    <button type="button" on:click={() => isAddModalOpen = true} class="btn btn-primary rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-full md:w-auto shrink-0 px-6 h-11">
      <Plus size={18} strokeWidth={2.5} class="mr-1" /> Tambah Admin
    </button>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <StatCard 
      label="Total Admin" 
      value={totalAdmins} 
      icon="group"
      iconCls="text-main"
      borderAccent="border-b-4 border-b-secondary"
      description="Semua akun admin yang terdaftar di platform"
    />
    <StatCard 
      label="Admin Aktif" 
      value={activeAdmins} 
      icon="check_circle"
      iconCls="text-success"
      borderAccent="border-b-4 border-b-success"
      description="Akun admin yang memiliki akses login normal"
    />
    <StatCard 
      label="Admin Diblokir" 
      value={suspendedAdmins} 
      icon="block"
      iconCls="text-error"
      borderAccent="border-b-4 border-b-error"
      description="Akses login ditangguhkan atau dibatasi"
    />
  </div>

  <AdminAddModal 
    isOpen={isAddModalOpen} 
    on:success={() => { fetchAdmins(); isAddModalOpen = false; }} 
    on:close={() => isAddModalOpen = false} 
  />

  <AdminWhitelistTable 
    {admins} 
    {isFetching} 
    {isActionLoading} 
    on:view={(e) => selectedAdmin = e.detail}
    on:toggleStatus={requestToggleStatus}
    on:remove={requestRemove}
  />
</div>

<AdminDetailModal admin={selectedAdmin} on:close={() => selectedAdmin = null} />

<AdminConfirmModal 
  modalState={confirmModal} 
  {isActionLoading}
  on:close={() => confirmModal = null}
  on:confirm={handleConfirmAction}
/>

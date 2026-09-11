<script lang="ts">
  import { UserPlus, Store, ShieldCheck, Eye, EyeOff } from 'lucide-svelte';
  import { toast } from '@/lib/toast';
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Modal } from '@/components/ui';

  import { authClient } from '@/lib/auth-client';

  export let isOpen = false;
  export let currentUser: any = null;

  const dispatch = createEventDispatcher<{ success: void; close: void }>();

  $: selectedRole = currentUser?.role === 'superadmin' ? 'admin' : 'tenant';

  let newName = '';
  let newEmail = '';
  let newPassword = '';
  let confirmPassword = '';
  let showPassword = false;
  let showConfirmPassword = false;

  let isSubmitting = false;

  const close = () => {
    if (isSubmitting) return;
    dispatch('close');
    setTimeout(resetForm, 300);
  };

  const resetForm = () => {
    newName = '';
    newEmail = '';
    newPassword = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
  };

  const handleAdd = async () => {
    if (!newName || !newEmail) return;

    isSubmitting = true;

    try {
      const payload = {
        role: selectedRole,
        name: newName, 
        email: newEmail
      };

      const res = await fetch('/api/admin/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        // Automatically send activation link via client
        const redirectUrl = `/activation?uid=${result.data.id}&name=${encodeURIComponent(newName)}`;
        const { error } = await authClient.requestPasswordReset({
          email: result.data.email || newEmail,
          redirectTo: redirectUrl
        });

        if (error) {
          toast.error(`Akun berhasil dibuat, tetapi gagal mengirim email aktivasi: ${error.message}`);
        } else {
          toast.success(`Akun ${selectedRole === 'tenant' ? 'Merchant' : 'Admin'} berhasil didaftarkan dan email aktivasi telah dikirim.`);
        }

        resetForm();
        dispatch('success');
      } else {
        toast.error(result.error?.message || 'Gagal mendaftarkan pengguna');
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Modal open={isOpen} on:close={close} size="md">
  <svelte:fragment slot="header">
    <h3 class="font-bold text-main text-base flex items-center gap-2 leading-none">
      <UserPlus size={18} class="text-primary" />
      <span>Tambah {selectedRole === 'admin' ? 'Admin' : 'Merchant'} Baru</span>
    </h3>
  </svelte:fragment>

  <div class="py-1">
    <form on:submit|preventDefault={handleAdd} class="animate-fade-in">
      <div class="space-y-5">
        <div class="flex items-center gap-3 mb-2 pb-4 border-b border-light">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {#if selectedRole === 'tenant'}<Store size={20}/>
            {:else}<ShieldCheck size={20}/>{/if}
          </div>
          <div>
            <p class="text-xs text-muted uppercase tracking-wider font-bold">Mendaftar sebagai</p>
            <p class="font-bold text-main capitalize">{selectedRole === 'tenant' ? 'Merchant' : selectedRole}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-5">
          <Input
            id="newName"
            type="text"
            label="Nama Lengkap"
            bind:value={newName}
            disabled={isSubmitting}
            required
            minlength="3"
            placeholder="Contoh: Budi Santoso"
          />
          
          <Input
            id="newEmail"
            type="email"
            label="Alamat Email"
            bind:value={newEmail}
            disabled={isSubmitting}
            required
            placeholder="budi@email.com"
          />
        </div>

        <div class="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs text-primary/80 font-medium">
          Sistem akan otomatis membuat akun {selectedRole === 'tenant' ? 'Merchant' : 'Admin'} dan mengirimkan undangan aktivasi ke email <strong>{newEmail || 'yang Anda masukkan'}</strong>. Pengguna dapat mengatur kata sandi mereka sendiri melalui link tersebut.
        </div>
      </div>
    </form>
  </div>

  <svelte:fragment slot="footer">
    <div class="w-full flex justify-between items-center">
      <Button variant="secondary" size="sm" on:click={close} disabled={isSubmitting}>
        <span>Batal</span>
      </Button>
      <Button 
        type="button"
        variant="primary" 
        size="sm" 
        disabled={isSubmitting || !newName || !newEmail} 
        loading={isSubmitting}
        on:click={handleAdd}
        className="font-bold px-6"
      >
        <UserPlus size={16} class="mr-1" />
        <span>Daftarkan Akun</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>

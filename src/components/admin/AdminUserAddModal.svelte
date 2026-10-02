<script lang="ts">
  import { UserPlus } from 'lucide-svelte';
  import { toast } from '@/lib/toast';
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Modal } from '@/components/ui';

  import { authClient } from '@/lib/auth-client';

  export let isOpen = false
  export let currentUser: { role?: string; id?: string } | null = null
  export let forceRole: 'tenant' | 'admin' | null = null;

  const dispatch = createEventDispatcher<{ success: void; close: void }>();

  $: selectedRole = forceRole ? forceRole : (currentUser?.role === 'superadmin' ? 'admin' : 'tenant');

  let newName = '';
  let newEmail = '';

  let isSubmitting = false;

  const close = () => {
    if (isSubmitting) return;
    dispatch('close');
    setTimeout(resetForm, 300);
  };

  const resetForm = () => {
    newName = ''
    newEmail = ''
  }

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
    <p class="text-[13px] text-secondary mb-5 leading-relaxed">
      Kirimkan link undangan registrasi ke alamat email calon <strong class="font-semibold">{selectedRole === 'admin' ? 'Admin' : 'Merchant'}</strong> baru. Mereka akan menerima instruksi lengkap untuk masuk ke sistem.
    </p>
    <form on:submit|preventDefault={handleAdd} class="animate-fade-in">
      <div class="space-y-5">
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

        <div class="bg-primary/5 border border-primary/20 rounded-xl p-3.5 text-xs text-primary/80 leading-relaxed font-medium">
          Sistem akan membuat profil awal dan mengirimkan link aktivasi ke 
          {#if newEmail}
            <strong class="text-primary font-bold">{newEmail}</strong>
          {:else}
            <span class="text-primary/60 italic">alamat email di atas</span>
          {/if}.
          Pengguna dapat membuat kata sandi mereka secara mandiri melalui link tersebut.
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
        <span>Kirim Undangan</span>
      </Button>
    </div>
  </svelte:fragment>
</Modal>

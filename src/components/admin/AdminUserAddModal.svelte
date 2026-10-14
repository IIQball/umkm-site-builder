<script lang="ts">
  import { toast } from '@/lib/toast';
  import { createEventDispatcher } from 'svelte';
  import { Button, Modal } from '@/components/ui';
  import { authClient } from '@/lib/auth-client';

  export let isOpen = false;
  export let currentUser: { role?: string; id?: string } | null = null;
  export let forceRole: 'tenant' | 'admin' | null = null;

  const dispatch = createEventDispatcher<{ success: void; close: void }>();

  $: selectedRole = forceRole ? forceRole : (currentUser?.role === 'superadmin' ? 'admin' : 'tenant');
  $: roleLabel = selectedRole === 'admin' ? 'Admin' : 'Merchant';
  $: roleIcon = selectedRole === 'admin' ? 'manage_accounts' : 'storefront';

  let newName = '';
  let newEmail = '';
  let isSubmitting = false;

  const close = () => {
    if (isSubmitting) return;
    dispatch('close');
    setTimeout(resetForm, 300);
  };

  const resetForm = () => {
    newName = '';
    newEmail = '';
  };

  const handleAdd = async () => {
    if (!newName || !newEmail) return;

    isSubmitting = true;
    try {
      const res = await fetch('/api/admin/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, name: newName, email: newEmail }),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        const redirectUrl = `/activation?uid=${result.data.id}&name=${encodeURIComponent(newName)}`;
        const { error } = await authClient.requestPasswordReset({
          email: result.data.email || newEmail,
          redirectTo: redirectUrl,
        });

        if (error) {
          toast.error(`Akun berhasil dibuat, tetapi gagal mengirim email aktivasi: ${error.message}`);
        } else {
          toast.success(`Akun ${roleLabel} berhasil didaftarkan dan email aktivasi telah dikirim.`);
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
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 shadow-2xs">
        <span class="material-symbols-outlined text-lg">{roleIcon}</span>
      </div>
      <div>
        <h3 class="text-base font-extrabold text-main font-heading leading-tight">
          Tambah {roleLabel} Baru
        </h3>
        <p class="text-2xs text-muted mt-0.5">
          Kirimkan link undangan registrasi ke email calon {roleLabel.toLowerCase()} baru untuk aktivasi akun.
        </p>
      </div>
    </div>
  </svelte:fragment>

  <form on:submit|preventDefault={handleAdd} class="space-y-4 pt-1">
    <div class="space-y-1.5">
      <label for="inv_name" class="text-xs font-bold text-main block font-heading">
        Nama Lengkap <span class="text-rose-500">*</span>
      </label>
      <input
        id="inv_name"
        type="text"
        bind:value={newName}
        disabled={isSubmitting}
        required
        minlength="3"
        placeholder="Contoh: Budi Santoso"
        class="w-full bg-nested/80 border border-light rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all font-sans"
      />
    </div>

    <div class="space-y-1.5">
      <label for="inv_email" class="text-xs font-bold text-main block font-heading">
        Alamat Email <span class="text-rose-500">*</span>
      </label>
      <input
        id="inv_email"
        type="email"
        bind:value={newEmail}
        disabled={isSubmitting}
        required
        placeholder="budi@email.com"
        class="w-full bg-nested/80 border border-light rounded-xl px-3.5 py-2 text-xs text-main placeholder:text-muted focus:outline-none focus:border-primary/50 focus:bg-card transition-all font-sans"
      />
    </div>

    <!-- Info notice — warna hitam / text-main jelas, bukan biru -->
    <div class="bg-nested border border-light rounded-xl p-3.5 text-xs text-main leading-relaxed font-sans">
      Sistem akan mengirimkan link aktivasi ke
      {#if newEmail}
        <strong class="font-bold text-main">{newEmail}</strong>
      {:else}
        <span class="text-secondary italic">alamat email di atas</span>
      {/if}.
      Pengguna dapat membuat kata sandi mereka secara mandiri melalui link tersebut.
    </div>

    <div class="flex items-center justify-end gap-2 pt-3 border-t border-light">
      <Button
        variant="secondary"
        size="sm"
        class="rounded-xl font-bold"
        on:click={close}
        disabled={isSubmitting}
      >
        Batal
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        class="rounded-xl font-bold"
        disabled={isSubmitting || !newName || !newEmail}
        loading={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Undangan'}
      </Button>
    </div>
  </form>
</Modal>

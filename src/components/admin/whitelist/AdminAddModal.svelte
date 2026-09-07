<script lang="ts">
  import { Plus, Eye, EyeOff, UserPlus } from 'lucide-svelte';
  import { toast } from '@/lib/toast';
  import { createEventDispatcher } from 'svelte';
  import { Button, Modal } from '@/components/ui';

  export let isOpen = false;

  const dispatch = createEventDispatcher<{ success: void; close: void }>();

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
  };

  const handleAdd = async () => {
    if (!newName || !newEmail || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok');
      return;
    }

    isSubmitting = true;

    try {
      const res = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, confirmPassword }),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        toast.success('Akun admin berhasil didaftarkan');
        newName = '';
        newEmail = '';
        newPassword = '';
        confirmPassword = '';
        dispatch('success');
      } else {
        toast.error(result.error?.message || 'Gagal mendaftarkan admin');
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
      <span>Pendaftaran Admin Baru</span>
    </h3>
  </svelte:fragment>

  <!-- Form -->
  <form id="admin-add-form" on:submit|preventDefault={handleAdd} class="space-y-5 py-1">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="form-control w-full">
        <label for="newName" class="block text-[11px] font-extrabold uppercase tracking-widest text-muted mb-2">Nama Lengkap</label>
        <input
          id="newName"
          type="text"
          bind:value={newName}
          disabled={isSubmitting}
          required
          minlength="3"
          placeholder="Contoh: Budi Santoso"
          class="input h-11 px-4 bg-nested/30 text-main border-light focus:border-primary rounded-xl text-sm font-medium w-full transition-all focus:ring-4 focus:ring-primary/10"
        />
      </div>
      
      <div class="form-control w-full">
        <label for="newEmail" class="block text-[11px] font-extrabold uppercase tracking-widest text-muted mb-2">Alamat Email</label>
        <input
          id="newEmail"
          type="email"
          bind:value={newEmail}
          disabled={isSubmitting}
          required
          placeholder="admin@perusahaan.com"
          class="input h-11 px-4 bg-nested/30 text-main border-light focus:border-primary rounded-xl text-sm font-medium w-full transition-all focus:ring-4 focus:ring-primary/10"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="form-control w-full">
        <label for="newPassword" class="block text-[11px] font-extrabold uppercase tracking-widest text-muted mb-2">Kata Sandi Baru</label>
        <div class="relative">
          {#if showPassword}
            <input
              id="newPassword"
              type="text"
              bind:value={newPassword}
              disabled={isSubmitting}
              required
              minlength="8"
              placeholder="Minimal 8 karakter"
              class="input h-11 px-4 pr-11 bg-nested/30 text-main border-light focus:border-primary rounded-xl text-sm font-medium w-full transition-all focus:ring-4 focus:ring-primary/10"
            />
          {:else}
            <input
              id="newPassword"
              type="password"
              bind:value={newPassword}
              disabled={isSubmitting}
              required
              minlength="8"
              placeholder="Minimal 8 karakter"
              class="input h-11 px-4 pr-11 bg-nested/30 text-main border-light focus:border-primary rounded-xl text-sm font-medium w-full transition-all focus:ring-4 focus:ring-primary/10"
            />
          {/if}
          <button
            type="button"
            on:click={() => showPassword = !showPassword}
            class="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted hover:text-main transition-colors"
          >
            {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
          </button>
        </div>
      </div>

      <div class="form-control w-full">
        <label for="confirmPassword" class="block text-[11px] font-extrabold uppercase tracking-widest text-muted mb-2">Konfirmasi Sandi</label>
        <div class="relative">
          {#if showConfirmPassword}
            <input
              id="confirmPassword"
              type="text"
              bind:value={confirmPassword}
              disabled={isSubmitting}
              required
              minlength="8"
              placeholder="Ketik ulang sandi"
              class="input h-11 px-4 pr-11 bg-nested/30 text-main border-light focus:border-primary rounded-xl text-sm font-medium w-full transition-all focus:ring-4 focus:ring-primary/10"
            />
          {:else}
            <input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              disabled={isSubmitting}
              required
              minlength="8"
              placeholder="Ketik ulang sandi"
              class="input h-11 px-4 pr-11 bg-nested/30 text-main border-light focus:border-primary rounded-xl text-sm font-medium w-full transition-all focus:ring-4 focus:ring-primary/10"
            />
          {/if}
          <button
            type="button"
            on:click={() => showConfirmPassword = !showConfirmPassword}
            class="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted hover:text-main transition-colors"
          >
            {#if showConfirmPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
          </button>
        </div>
      </div>
    </div>
  </form>

  <!-- Footer Actions -->
  <svelte:fragment slot="footer">
    <Button
      variant="secondary"
      size="sm"
      on:click={close}
      disabled={isSubmitting}
    >
      Batal
    </Button>
    <Button
      type="submit"
      form="admin-add-form"
      variant="primary"
      size="sm"
      disabled={isSubmitting || !newName || !newEmail || !newPassword || !confirmPassword}
      loading={isSubmitting}
      className="font-bold px-6"
    >
      <Plus size={18} strokeWidth={2.5} class="mr-1" />
      <span>Daftarkan</span>
    </Button>
  </svelte:fragment>
</Modal>

<script lang="ts">
  import { Plus, Eye, EyeOff, UserPlus, X } from 'lucide-svelte';
  import { toast } from '@/lib/toast';
  import { createEventDispatcher } from 'svelte';

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

      if (res.ok && result.success) {
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

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-nested/80 backdrop-blur-sm" on:click={close} on:keydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="0"></div>
    <div class="relative bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-light overflow-hidden animate-scale-up">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-light flex justify-between items-center bg-nested/30">
        <h3 class="font-bold text-main text-base flex items-center gap-2 leading-none">
          <UserPlus size={18} class="text-primary" />
          <span class="pt-1">Pendaftaran Admin Baru</span>
        </h3>
        <button type="button" on:click={close} disabled={isSubmitting} class="btn btn-ghost btn-sm btn-square hover:bg-nested/80 rounded-xl">
          <X size={18} class="text-secondary" />
        </button>
      </div>

      <!-- Form -->
      <form on:submit|preventDefault={handleAdd}>
        <div class="p-6 space-y-5">
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
              <label for="newPassword" class="block text-[11px] font-extrabold uppercase tracking-widest text-muted mb-2">Kata Sandi</label>
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
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-light bg-nested/20 flex justify-end gap-3">
          <button type="button" on:click={close} disabled={isSubmitting} class="btn btn-outline border-light hover:bg-light hover:text-main rounded-xl px-6 h-11 min-h-0 text-sm">
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !newName || !newEmail || !newPassword || !confirmPassword}
            class="btn btn-primary h-11 text-sm font-bold rounded-xl px-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            {#if isSubmitting}
              <span class="loading loading-spinner loading-sm"></span> Menyimpan...
            {:else}
              <Plus size={18} strokeWidth={2.5} class="mr-1" /> Daftarkan
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

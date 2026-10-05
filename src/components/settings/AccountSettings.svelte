<script lang="ts">
  import { authClient } from "@/lib/auth-client";
  import { toast } from "@/lib/toast";

  export let userJson: string;
  let user = JSON.parse(userJson);

  let newName = user.name;
  let isUpdatingName = false;

  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let isUpdatingPassword = false;

  let showCurrentPassword = false;
  let showNewPassword = false;
  let showConfirmPassword = false;

  async function handleUpdateName(e: Event) {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Nama tidak boleh kosong.");
      return;
    }
    if (newName === user.name) {
      toast.info("Nama belum diubah.");
      return;
    }

    isUpdatingName = true;
    try {
      const { error } = await authClient.updateUser({
        name: newName.trim(),
      });
      if (error) throw error;
      toast.success("Nama berhasil diperbarui! Memuat ulang...");
      
      // Memberi jeda sedikit agar toast terlihat, lalu muat ulang untuk memperbarui navbar
      setTimeout(() => {
        window.location.reload();
      }, 750);
      
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui nama.");
      isUpdatingName = false;
    }
  }

  async function handleUpdatePassword(e: Event) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua kolom kata sandi wajib diisi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }

    isUpdatingPassword = true;
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true
      });
      
      if (error) throw error;
      
      toast.success("Kata sandi berhasil diperbarui!");
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui kata sandi. Pastikan sandi lama benar.");
    } finally {
      isUpdatingPassword = false;
    }
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
  
  <!-- Profil Akun Card -->
  <section class="border border-base-200 rounded-xl overflow-hidden bg-base-100 shadow-sm transition-all flex flex-col">
    <div class="border-b border-base-200 p-5 sm:p-6 bg-base-50/30">
      <h2 class="text-lg font-semibold text-base-content tracking-tight">Profil Akun</h2>
      <p class="text-sm text-base-content/60 mt-1">Kelola informasi publik dan data pribadi Anda.</p>
    </div>
    
    <form on:submit={handleUpdateName} class="flex flex-col flex-grow">
      <div class="p-5 sm:p-6 space-y-5 flex-grow">
        <!-- Email (Disabled) -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="email">
            <span class="label-text font-medium text-base-content/90">Alamat Email</span>
          </label>
          <input
            type="email"
            id="email"
            class="input input-bordered w-full bg-base-200/50 text-base-content/60 cursor-not-allowed focus:outline-none transition-colors"
            value={user.email}
            disabled
            title="Email tidak dapat diubah"
          />
          <p class="text-xs text-base-content/50 mt-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            Email digunakan untuk login dan tidak dapat diganti.
          </p>
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="name">
            <span class="label-text font-medium text-base-content/90">Nama Lengkap</span>
          </label>
          <input
            type="text"
            id="name"
            class="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-out"
            bind:value={newName}
            placeholder="Masukkan nama lengkap Anda"
            required
          />
        </div>
      </div>

      <div class="border-t border-base-200 p-4 sm:px-6 bg-base-50/30 flex justify-end mt-auto">
        <button 
          type="submit" 
          class="btn btn-primary active:scale-[0.97] transition-all duration-150 ease-out shadow-sm w-full sm:w-auto" 
          disabled={isUpdatingName || newName === user.name}
        >
          {#if isUpdatingName}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
          Simpan Perubahan
        </button>
      </div>
    </form>
  </section>

  <!-- Ubah Kata Sandi Card -->
  <section class="border border-base-200 rounded-xl overflow-hidden bg-base-100 shadow-sm transition-all flex flex-col">
    <div class="border-b border-base-200 p-5 sm:p-6 bg-base-50/30">
      <h2 class="text-lg font-semibold text-base-content tracking-tight">Keamanan & Kata Sandi</h2>
      <p class="text-sm text-base-content/60 mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat agar tetap aman.</p>
    </div>
    
    <form on:submit={handleUpdatePassword} class="flex flex-col flex-grow">
      <div class="p-5 sm:p-6 space-y-5 flex-grow">
        <!-- Current Password -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="currentPassword">
            <span class="label-text font-medium text-base-content/90">Kata Sandi Saat Ini</span>
          </label>
          <div class="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              class="input input-bordered w-full pr-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-out"
              bind:value={currentPassword}
              placeholder="Masukkan kata sandi saat ini"
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content active:scale-95 transition-all outline-none"
              on:click={() => showCurrentPassword = !showCurrentPassword}
              tabindex="-1"
            >
              {#if showCurrentPassword}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="newPassword">
            <span class="label-text font-medium text-base-content/90">Kata Sandi Baru</span>
          </label>
          <div class="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              class="input input-bordered w-full pr-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-out"
              bind:value={newPassword}
              placeholder="Min. 8 karakter"
              minlength="8"
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content active:scale-95 transition-all outline-none"
              on:click={() => showNewPassword = !showNewPassword}
              tabindex="-1"
            >
              {#if showNewPassword}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="confirmPassword">
            <span class="label-text font-medium text-base-content/90">Konfirmasi Kata Sandi</span>
          </label>
          <div class="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              class="input input-bordered w-full pr-10 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 ease-out"
              bind:value={confirmPassword}
              placeholder="Ketik ulang kata sandi baru"
              minlength="8"
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content active:scale-95 transition-all outline-none"
              on:click={() => showConfirmPassword = !showConfirmPassword}
              tabindex="-1"
            >
              {#if showConfirmPassword}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {/if}
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-base-200 p-4 sm:px-6 bg-base-50/30 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-auto">
        <a href="/auth/forgot-password" class="text-sm text-primary hover:text-primary-focus hover:underline font-medium active:scale-95 transition-all duration-150 ease-out">
          Lupa kata sandi lama?
        </a>
        <button 
          type="submit" 
          class="btn btn-primary active:scale-[0.97] transition-all duration-150 ease-out shadow-sm w-full sm:w-auto" 
          disabled={isUpdatingPassword}
        >
          {#if isUpdatingPassword}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
          Perbarui Kata Sandi
        </button>
      </div>
    </form>
  </section>
</div>

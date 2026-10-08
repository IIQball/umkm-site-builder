<script lang="ts">
  import { onMount } from "svelte";
  import { authClient } from "@/lib/auth-client";
  import { toast } from "@/lib/toast";
  import Button from "@/components/ui/Button.svelte";
  import { Eye, EyeOff, Info, ShieldAlert } from "lucide-svelte";

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

  // Konfigurasi Cooldown Keamanan (1 hari = 24 jam)
  const PASSWORD_COOLDOWN_HOURS = 24;
  const PASSWORD_COOLDOWN_MS = PASSWORD_COOLDOWN_HOURS * 60 * 60 * 1000;
  const STORAGE_KEY = `last_password_change_${user.id}`;

  let remainingCooldownMs = 0;

  function calculateRemainingCooldown(): number {
    if (typeof window === "undefined") return 0;
    const lastChange = localStorage.getItem(STORAGE_KEY);
    if (!lastChange) return 0;

    const lastTimestamp = parseInt(lastChange, 10);
    if (isNaN(lastTimestamp)) return 0;

    const elapsed = Date.now() - lastTimestamp;
    return Math.max(0, PASSWORD_COOLDOWN_MS - elapsed);
  }

  function formatCooldownTime(ms: number): string {
    const totalMinutes = Math.ceil(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
  }

  function refreshCooldownState() {
    remainingCooldownMs = calculateRemainingCooldown();
  }

  onMount(() => {
    refreshCooldownState();
    const interval = setInterval(refreshCooldownState, 60000);
    return () => clearInterval(interval);
  });

  $: isCooldownActive = remainingCooldownMs > 0;
  $: cooldownFormatted = formatCooldownTime(remainingCooldownMs);

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
    refreshCooldownState();

    if (isCooldownActive) {
      toast.error(`Perubahan kata sandi dibatasi 1x dalam 24 jam. Silakan coba lagi dalam ${cooldownFormatted}.`);
      return;
    }

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
      
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }
      refreshCooldownState();

      toast.success("Kata sandi berhasil diperbarui! Anda dapat mengubah kata sandi lagi dalam 24 jam.");
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
  <section class="border border-light rounded-xl overflow-hidden bg-card shadow-xs flex flex-col">
    <div class="border-b border-light p-5 sm:p-6 bg-nested/30">
      <h2 class="text-lg font-semibold text-main tracking-tight font-heading">Profil Akun</h2>
      <p class="text-sm text-secondary mt-1">Kelola informasi publik dan data pribadi Anda.</p>
    </div>
    
    <form on:submit={handleUpdateName} class="flex flex-col flex-grow">
      <div class="p-5 sm:p-6 space-y-5 flex-grow">
        <!-- Email (Disabled) -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="email">
            <span class="label-text font-medium text-main">Alamat Email</span>
          </label>
          <input
            type="email"
            id="email"
            class="input input-bordered w-full bg-nested text-muted cursor-not-allowed focus:outline-none"
            value={user.email}
            disabled
            title="Email tidak dapat diubah"
          />
          <p class="text-xs text-muted mt-2 flex items-center gap-1.5">
            <Info size={14} class="shrink-0" />
            Email digunakan untuk login dan tidak dapat diganti.
          </p>
        </div>

        <!-- Name -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="name">
            <span class="label-text font-medium text-main">Nama Lengkap</span>
          </label>
          <input
            type="text"
            id="name"
            class="input input-bordered w-full bg-nested text-main focus:border-primary"
            bind:value={newName}
            placeholder="Masukkan nama lengkap Anda"
            required
          />
        </div>
      </div>

      <div class="border-t border-light p-4 sm:px-6 bg-nested/30 flex justify-end mt-auto">
        <Button 
          type="submit" 
          variant="primary"
          loading={isUpdatingName}
          disabled={isUpdatingName || newName === user.name}
          class="w-full sm:w-auto"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  </section>

  <!-- Ubah Kata Sandi Card -->
  <section class="border border-light rounded-xl overflow-hidden bg-card shadow-xs flex flex-col">
    <div class="border-b border-light p-5 sm:p-6 bg-nested/30">
      <h2 class="text-lg font-semibold text-main tracking-tight font-heading">Keamanan & Kata Sandi</h2>
      <p class="text-sm text-secondary mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat agar tetap aman.</p>
    </div>
    
    <form on:submit={handleUpdatePassword} class="flex flex-col flex-grow">
      <div class="p-5 sm:p-6 space-y-5 flex-grow">
        {#if isCooldownActive}
          <div class="p-4 rounded-lg bg-warning/10 border border-warning/30 text-main text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <ShieldAlert size={20} class="text-warning shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-warning">Batas Waktu Perubahan Kata Sandi (Cooldown)</p>
              <p class="text-secondary mt-1 leading-relaxed">
                Demi keamanan akun dan mencegah spamming, kata sandi hanya dapat diperbarui <strong>1 kali dalam 24 jam</strong>. Silakan tunggu <span class="font-bold text-main underline decoration-warning/50">{cooldownFormatted}</span> sebelum melakukan pembaruan berikutnya.
              </p>
            </div>
          </div>
        {/if}

        <!-- Current Password -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="currentPassword">
            <span class="label-text font-medium text-main">Kata Sandi Saat Ini</span>
          </label>
          <div class="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              class="input input-bordered w-full pr-10 bg-nested text-main focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              bind:value={currentPassword}
              placeholder="Masukkan kata sandi saat ini"
              disabled={isCooldownActive}
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors disabled:opacity-50"
              on:click={() => showCurrentPassword = !showCurrentPassword}
              disabled={isCooldownActive}
              tabindex="-1"
              aria-label={showCurrentPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {#if showCurrentPassword}
                <EyeOff size={18} />
              {:else}
                <Eye size={18} />
              {/if}
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="newPassword">
            <span class="label-text font-medium text-main">Kata Sandi Baru</span>
          </label>
          <div class="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              class="input input-bordered w-full pr-10 bg-nested text-main focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              bind:value={newPassword}
              placeholder="Min. 8 karakter"
              minlength="8"
              disabled={isCooldownActive}
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors disabled:opacity-50"
              on:click={() => showNewPassword = !showNewPassword}
              disabled={isCooldownActive}
              tabindex="-1"
              aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {#if showNewPassword}
                <EyeOff size={18} />
              {:else}
                <Eye size={18} />
              {/if}
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-control w-full">
          <label class="label pb-1.5" for="confirmPassword">
            <span class="label-text font-medium text-main">Konfirmasi Kata Sandi</span>
          </label>
          <div class="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              class="input input-bordered w-full pr-10 bg-nested text-main focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              bind:value={confirmPassword}
              placeholder="Ketik ulang kata sandi baru"
              minlength="8"
              disabled={isCooldownActive}
              required
            />
            <button 
              type="button" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors disabled:opacity-50"
              on:click={() => showConfirmPassword = !showConfirmPassword}
              disabled={isCooldownActive}
              tabindex="-1"
              aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {#if showConfirmPassword}
                <EyeOff size={18} />
              {:else}
                <Eye size={18} />
              {/if}
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-light p-4 sm:px-6 bg-nested/30 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-auto">
        <a href="/auth/forgot-password" class="text-sm text-primary hover:underline font-medium">
          Lupa kata sandi lama?
        </a>
        <Button 
          type="submit" 
          variant="primary"
          loading={isUpdatingPassword}
          disabled={isUpdatingPassword || isCooldownActive}
          class="w-full sm:w-auto"
        >
          Perbarui Kata Sandi
        </Button>
      </div>
    </form>
  </section>
</div>

<script lang="ts">
  import { onMount } from "svelte";
  import { authClient } from "@/lib/auth-client";
  import { toast } from "@/lib/toast";
  import { Card, Button, Input } from "@/components/ui";

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
      
      // Catat timestamp perubahan kata sandi untuk batas waktu 24 jam
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

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-10">
  <!-- Profil Akun Card -->
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden flex flex-col h-full">
    <div class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">person</span>
        </div>
        <div>
          <h3 class="text-heading-md text-main font-bold font-heading leading-tight">Profil Akun</h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">Kelola informasi publik dan data pribadi Anda.</p>
        </div>
      </div>
    </div>
    
    <form on:submit={handleUpdateName} class="flex flex-col flex-grow">
      <div class="p-6 md:p-8 space-y-6 flex-grow">
        <Input
          id="email"
          type="email"
          label="Alamat Email"
          value={user.email}
          disabled={true}
          helper="Email digunakan untuk login dan tidak dapat diganti."
          title="Email tidak dapat diubah"
        />

        <Input
          id="name"
          type="text"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          bind:value={newName}
          required={true}
        />
      </div>

      <div class="p-4 sm:px-6 py-4 border-t border-light flex justify-end mt-auto bg-card">
        <Button 
          type="submit" 
          variant="primary"
          size="md"
          className="shadow-xs font-bold rounded-2xl w-full sm:w-auto"
          loading={isUpdatingName}
          disabled={isUpdatingName || newName === user.name}
        >
          <span class="material-symbols-outlined text-[18px] mr-1.5 icon-filled">save</span>
          <span>Simpan Perubahan</span>
        </Button>
      </div>
    </form>
  </Card>

  <!-- Ubah Kata Sandi Card -->
  <Card variant="bordered" padding="none" radius="2xl" className="shadow-xs overflow-hidden flex flex-col h-full">
    <div class="p-5 sm:p-6 border-b border-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-main text-canvas dark:bg-nested flex items-center justify-center flex-shrink-0 shadow-2xs">
          <span class="material-symbols-outlined text-lg">lock</span>
        </div>
        <div>
          <h3 class="text-heading-md text-main font-bold font-heading leading-tight">Keamanan & Kata Sandi</h3>
          <p class="text-body-sm text-secondary mt-0.5 font-sans">Pastikan akun Anda menggunakan kata sandi yang kuat.</p>
        </div>
      </div>
    </div>
    
    <form on:submit={handleUpdatePassword} class="flex flex-col flex-grow">
      <div class="p-6 md:p-8 space-y-6 flex-grow">
        {#if isCooldownActive}
          <div class="p-4 rounded-xl bg-orange/10 border border-orange/20 text-orange-dark dark:text-orange-light text-xs sm:text-sm flex items-start gap-3 shadow-2xs mb-6">
            <span class="material-symbols-outlined text-orange shrink-0 mt-0.5">warning</span>
            <div>
              <p class="font-bold font-heading">Batas Waktu Perubahan Kata Sandi (Cooldown)</p>
              <p class="mt-1 leading-relaxed opacity-90">
                Demi keamanan akun dan mencegah spamming, kata sandi hanya dapat diperbarui <strong>1 kali dalam 24 jam</strong>. Silakan tunggu <span class="font-bold underline decoration-orange/40">{cooldownFormatted}</span> sebelum melakukan pembaruan berikutnya.
              </p>
            </div>
          </div>
        {/if}

        <Input
          id="currentPassword"
          type={showCurrentPassword ? "text" : "password"}
          label="Kata Sandi Saat Ini"
          placeholder="Masukkan kata sandi saat ini"
          bind:value={currentPassword}
          disabled={isCooldownActive}
          required={true}
        >
          <button 
            slot="suffix"
            type="button" 
            class="text-muted hover:text-main transition-colors outline-none disabled:opacity-50 flex items-center justify-center"
            on:click={() => showCurrentPassword = !showCurrentPassword}
            disabled={isCooldownActive}
            tabindex="-1"
          >
            <span class="material-symbols-outlined text-[18px]">
              {showCurrentPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </Input>

        <Input
          id="newPassword"
          type={showNewPassword ? "text" : "password"}
          label="Kata Sandi Baru"
          placeholder="Min. 8 karakter"
          bind:value={newPassword}
          disabled={isCooldownActive}
          required={true}
          minlength="8"
        >
          <button 
            slot="suffix"
            type="button" 
            class="text-muted hover:text-main transition-colors outline-none disabled:opacity-50 flex items-center justify-center"
            on:click={() => showNewPassword = !showNewPassword}
            disabled={isCooldownActive}
            tabindex="-1"
          >
            <span class="material-symbols-outlined text-[18px]">
              {showNewPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </Input>

        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          label="Konfirmasi Kata Sandi"
          placeholder="Ketik ulang kata sandi baru"
          bind:value={confirmPassword}
          disabled={isCooldownActive}
          required={true}
          minlength="8"
        >
          <button 
            slot="suffix"
            type="button" 
            class="text-muted hover:text-main transition-colors outline-none disabled:opacity-50 flex items-center justify-center"
            on:click={() => showConfirmPassword = !showConfirmPassword}
            disabled={isCooldownActive}
            tabindex="-1"
          >
            <span class="material-symbols-outlined text-[18px]">
              {showConfirmPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </Input>
      </div>

      <div class="p-4 sm:px-6 py-4 border-t border-light flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-auto bg-card">
        <a href="/auth/forgot-password" class="text-label-caps font-bold text-primary hover:text-primary-focus hover:underline active:scale-95 transition-all duration-150 ease-out">
          LUPA KATA SANDI LAMA?
        </a>
        <Button 
          type="submit" 
          variant="primary"
          size="md"
          className="shadow-xs font-bold rounded-2xl w-full sm:w-auto"
          loading={isUpdatingPassword}
          disabled={isUpdatingPassword || isCooldownActive}
        >
          <span class="material-symbols-outlined text-[18px] mr-1.5 icon-filled">lock_reset</span>
          <span>Perbarui Kata Sandi</span>
        </Button>
      </div>
    </form>
  </Card>
</div>

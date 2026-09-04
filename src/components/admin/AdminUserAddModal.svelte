<script lang="ts">
  import { UserPlus, Store, Paintbrush, ArrowRight, ArrowLeft, Eye, EyeOff, Check, CheckCircle2 } from 'lucide-svelte';
  import { toast } from '@/lib/toast';
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Card, Modal } from '@/components/ui';

  export let isOpen = false;

  const dispatch = createEventDispatcher<{ success: void; close: void }>();

  let step: 'role' | 'details' = 'role';
  let selectedRole: 'tenant' | 'designer' | null = null;

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
    setTimeout(resetForm, 300); // Reset after animation
  };

  const resetForm = () => {
    step = 'role';
    selectedRole = null;
    newName = '';
    newEmail = '';
    newPassword = '';
    confirmPassword = '';
    showPassword = false;
    showConfirmPassword = false;
  };

  const goToDetails = () => {
    if (!selectedRole) return;
    step = 'details';
  };

  const goBack = () => {
    step = 'role';
  };

  const handleAdd = async () => {
    if (!selectedRole || !newName || !newEmail || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok');
      return;
    }

    isSubmitting = true;

    try {
      const res = await fetch('/api/admin/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: selectedRole,
          name: newName, 
          email: newEmail, 
          password: newPassword, 
          confirmPassword 
        }),
      });
      const result = await res.json();

      if (res.ok && result.ok) {
        toast.success(`Akun ${selectedRole === 'tenant' ? 'Tenant' : 'Designer'} berhasil didaftarkan`);
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
      <span>Pendaftaran Pengguna Baru</span>
    </h3>
  </svelte:fragment>

  <div class="py-1">
        <!-- Step Indicator -->
        <div class="flex items-center justify-center mb-8 gap-4">
          <div class="flex items-center gap-2 {step === 'role' ? 'text-primary font-bold' : 'text-success'}">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs border {step === 'role' ? 'border-primary bg-primary/10' : 'border-success bg-success text-white'}">
              {#if step === 'details'}<Check size={14}/>{:else}1{/if}
            </div>
            <span class="text-sm">Pilih Peran</span>
          </div>
          <div class="w-12 h-px bg-border"></div>
          <div class="flex items-center gap-2 {step === 'details' ? 'text-primary font-bold' : 'text-muted'}">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs border {step === 'details' ? 'border-primary bg-primary/10' : 'border-light'}">
              2
            </div>
            <span class="text-sm">Isi Data</span>
          </div>
        </div>

        {#if step === 'role'}
          <div class="space-y-4 animate-fade-in">
            <h4 class="text-sm font-semibold text-main text-center mb-2">Pilih jenis akun yang akan dibuat:</h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Tenant Card -->
              <button
                type="button"
                on:click={() => selectedRole = 'tenant'}
                class="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-transform active:scale-95"
              >
                <Card 
                  variant="bordered" 
                  padding="md" 
                  radius="2xl" 
                  class="h-full flex flex-col items-center relative overflow-hidden transition-all duration-300 {selectedRole === 'tenant' ? '!border-primary !bg-primary/5 shadow-md scale-[1.02]' : 'hover:!border-primary/50 hover:bg-nested/30'}"
                >
                  <!-- Active Checkmark Indicator -->
                  {#if selectedRole === 'tenant'}
                    <div class="absolute top-3 right-3 text-primary animate-fade-in">
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    </div>
                  {/if}
                  
                  <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors {selectedRole === 'tenant' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-primary/10 text-primary'}">
                    <Store size={26} strokeWidth={selectedRole === 'tenant' ? 2.5 : 2} />
                  </div>
                  <h5 class="font-bold text-main mb-1.5 {selectedRole === 'tenant' ? 'text-primary' : ''}">Tenant</h5>
                  <p class="text-xs text-muted text-center leading-relaxed">Pemilik UMKM yang akan menggunakan template untuk membuat website toko online mereka.</p>
                </Card>
              </button>

              <!-- Designer Card -->
              <button
                type="button"
                on:click={() => selectedRole = 'designer'}
                class="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-transform active:scale-95"
              >
                <Card 
                  variant="bordered" 
                  padding="md" 
                  radius="2xl" 
                  class="h-full flex flex-col items-center relative overflow-hidden transition-all duration-300 {selectedRole === 'designer' ? '!border-primary !bg-primary/5 shadow-md scale-[1.02]' : 'hover:!border-primary/50 hover:bg-nested/30'}"
                >
                  <!-- Active Checkmark Indicator -->
                  {#if selectedRole === 'designer'}
                    <div class="absolute top-3 right-3 text-primary animate-fade-in">
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    </div>
                  {/if}

                  <div class="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors {selectedRole === 'designer' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-primary/10 text-primary'}">
                    <Paintbrush size={26} strokeWidth={selectedRole === 'designer' ? 2.5 : 2} />
                  </div>
                  <h5 class="font-bold text-main mb-1.5 {selectedRole === 'designer' ? 'text-primary' : ''}">Designer</h5>
                  <p class="text-xs text-muted text-center leading-relaxed">Kreator yang akan membuat, menerbitkan, dan menjual desain template di platform.</p>
                </Card>
              </button>
            </div>
          </div>
        {:else if step === 'details'}
          <form on:submit|preventDefault={handleAdd} class="animate-fade-in">
            <div class="space-y-5">
              <div class="flex items-center gap-3 mb-2 pb-4 border-b border-light">
                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {#if selectedRole === 'tenant'}<Store size={20}/>{:else}<Paintbrush size={20}/>{/if}
                </div>
                <div>
                  <p class="text-xs text-muted uppercase tracking-wider font-bold">Mendaftar sebagai</p>
                  <p class="font-bold text-main capitalize">{selectedRole}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  label="Kata Sandi Baru"
                  bind:value={newPassword}
                  disabled={isSubmitting}
                  required
                  minlength="8"
                  placeholder="Minimal 8 karakter"
                >
                  <button
                    slot="suffix"
                    type="button"
                    on:click={() => showPassword = !showPassword}
                    class="h-full w-9 flex items-center justify-center text-muted hover:text-main transition-colors"
                  >
                    {#if showPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </Input>

                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Konfirmasi Sandi"
                  bind:value={confirmPassword}
                  disabled={isSubmitting}
                  required
                  minlength="8"
                  placeholder="Ketik ulang sandi"
                >
                  <button
                    slot="suffix"
                    type="button"
                    on:click={() => showConfirmPassword = !showConfirmPassword}
                    class="h-full w-9 flex items-center justify-center text-muted hover:text-main transition-colors"
                  >
                    {#if showConfirmPassword}<EyeOff size={16} />{:else}<Eye size={16} />{/if}
                  </button>
                </Input>
              </div>
            </div>
          </form>
        {/if}
      </div>

  <!-- Footer Actions -->
  <svelte:fragment slot="footer">
    <div class="w-full flex justify-between items-center">
      {#if step === 'role'}
        <Button variant="secondary" size="sm" on:click={close}>Batal</Button>
        <Button variant="primary" size="sm" disabled={!selectedRole} on:click={goToDetails} className="font-bold px-6">
          <span>Lanjut</span>
          <ArrowRight size={16} class="ml-1" />
        </Button>
      {:else if step === 'details'}
        <Button variant="secondary" size="sm" on:click={goBack} disabled={isSubmitting}>
          <ArrowLeft size={16} class="mr-1" />
          <span>Kembali</span>
        </Button>
        <Button 
          type="button"
          variant="primary" 
          size="sm" 
          disabled={isSubmitting || !newName || !newEmail || !newPassword || !confirmPassword} 
          loading={isSubmitting}
          on:click={handleAdd}
          className="font-bold px-6"
        >
          <UserPlus size={16} class="mr-1" />
          <span>Daftarkan Akun</span>
        </Button>
      {/if}
    </div>
  </svelte:fragment>
</Modal>

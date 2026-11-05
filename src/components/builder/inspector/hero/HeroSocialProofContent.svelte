<script lang="ts">
  import { Star } from 'lucide-svelte';
  import HeroAvatarUploader from './HeroAvatarUploader.svelte';

  export let socialProofStars: number = 5;
  export let socialProofAvatars: string[] = [];
  export let socialProofText: string = 'Dipercaya oleh 2.500+ Pembeli';
  export let onPropChange: (key: string, value: unknown) => void;

  $: currentStars = typeof socialProofStars === 'number' ? socialProofStars : 5;
  $: currentAvatars =
    Array.isArray(socialProofAvatars) && socialProofAvatars.length === 4
      ? socialProofAvatars
      : [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        ];

  function updateAvatar(index: number, val: string) {
    const next = currentAvatars.map((url, i) => (i === index ? val : url));
    onPropChange('socialProofAvatars', next);
  }
</script>

<div class="space-y-3 pt-3 border-t border-base-300">
  <span class="block font-semibold text-xs text-base-content/80">
    Kustomisasi Bukti Sosial & Rating
  </span>

  <div class="space-y-3">
    <!-- Jumlah Bintang -->
    <div>
      <span class="block text-[11px] font-medium text-base-content/70 mb-1">
        Jumlah Bintang Rating: {currentStars} / 5
      </span>
      <div class="flex items-center gap-2">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={currentStars}
          on:input={(e) => onPropChange('socialProofStars', parseInt(e.currentTarget.value, 10))}
          class="range range-xs range-warning flex-1"
        />
        <div class="flex items-center gap-0.5 text-amber-400">
          {#each Array(currentStars) as _}
            <Star size={12} class="fill-current text-amber-400" />
          {/each}
        </div>
      </div>
    </div>

    <!-- Kalimat Dipercaya -->
    <div>
      <label for="social-proof-text" class="block text-[11px] font-medium text-base-content/70 mb-0.5">
        Kalimat Bukti Sosial
      </label>
      <input
        id="social-proof-text"
        type="text"
        value={socialProofText}
        on:input={(e) => onPropChange('socialProofText', e.currentTarget.value)}
        class="input input-bordered input-xs w-full"
        placeholder="Dipercaya oleh 2.500+ Pembeli"
      />
    </div>

    <!-- Foto Avatar Pengguna (4 Orang) dengan Drag & Drop / Pilih File -->
    <div class="space-y-2 pt-1">
      <span class="block text-[11px] font-medium text-base-content/70">
        Foto Profil Pembeli (Pilih Berkas atau Tarik & Lepas)
      </span>
      <div class="space-y-2">
        {#each currentAvatars as avatar, i (i)}
          <HeroAvatarUploader
            avatarUrl={avatar}
            index={i}
            onAvatarChange={(newUrl) => updateAvatar(i, newUrl)}
          />
        {/each}
      </div>
    </div>
  </div>
</div>

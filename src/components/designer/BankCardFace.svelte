<script lang="ts">
  import { Star, Trash2 } from 'lucide-svelte';
  import { getBankBrandConfig } from './bankBranding.helpers';
  import BankCardOrnament from './BankCardOrnament.svelte';
  import type { BankAccount } from '@/types';

  export let account: BankAccount;
  export let isActive: boolean = false;
  export let stackOffset: number = 0; // 0 = front, 1 = behind 1, 2 = behind 2
  export let totalCards: number = 1;
  export let onSelect: () => void = () => {};
  export let onSwipeToBack: () => void = () => {};
  export let onTriggerSetPrimary: (acc: BankAccount) => void = () => {};
  export let onTriggerDelete: (acc: BankAccount) => void = () => {};
  export let canDelete: boolean = false;

  $: brandConfig = getBankBrandConfig(account.bankName || account.bankCode);

  $: resolvedHolderName = (
    account.accountHolder ||
    account.holderName ||
    (account as any)?.accountHolderName ||
    'Belum Diatur'
  ).toUpperCase();

  $: lastFourDigits =
    account.accountNumber && account.accountNumber.length > 4
      ? account.accountNumber.slice(-4)
      : account.accountNumber || '••••';

  // Drag & Swipe gesture state for active front card (inspired by image-stack-carousel)
  let isDragging = false;
  let dragX = 0;
  let dragY = 0;
  let startX = 0;
  let startY = 0;
  let isFlyingOut = false;
  let flyDirection = { x: 0, y: 0 };
  let prevActive = isActive;
  let isJustSelected = false;
  let isHovered = false;

  $: if (isActive && !prevActive) {
    prevActive = true;
    isJustSelected = true;
    setTimeout(() => {
      isJustSelected = false;
    }, 450);
  } else if (!isActive && prevActive) {
    prevActive = false;
    isJustSelected = false;
  }

  const SWIPE_THRESHOLD = 90;

  function handlePointerDown(e: PointerEvent) {
    if (!isActive || totalCards <= 1) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('button') || target?.closest('a')) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    dragX = 0;
    dragY = 0;
    (e.currentTarget as HTMLElement)?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent) {
    if (!isDragging || !isActive) return;
    dragX = e.clientX - startX;
    dragY = e.clientY - startY;
  }

  function handlePointerUp(e: PointerEvent) {
    if (!isDragging || !isActive) return;
    isDragging = false;
    try {
      (e.currentTarget as HTMLElement)?.releasePointerCapture(e.pointerId);
    } catch (_err) {
      // Ignore if pointer capture already released
    }

    const dist = Math.hypot(dragX, dragY);
    if (dist > SWIPE_THRESHOLD) {
      isFlyingOut = true;
      flyDirection = {
        x: dragX > 0 ? 340 : -340,
        y: dragY * 1.4,
      };
      setTimeout(() => {
        onSwipeToBack();
        dragX = 0;
        dragY = 0;
        isFlyingOut = false;
      }, 240);
    } else {
      dragX = 0;
      dragY = 0;
    }
  }

  function handlePointerCancel() {
    isDragging = false;
    dragX = 0;
    dragY = 0;
  }

  // Compute 3D stack transforms with tilt & rotation
  $: zIndexClass = isActive ? (isFlyingOut ? 'z-30' : 'z-20') : stackOffset === 1 ? 'z-10' : 'z-0';

  $: rotateZDeg = stackOffset === 1 ? 2.5 : stackOffset === 2 ? -2.5 : 0;
  $: scaleVal = stackOffset === 1 ? 0.97 : stackOffset === 2 ? 0.94 : 1;
  $: translateYPx = stackOffset === 1 ? (isHovered ? -28 : -22) : stackOffset === 2 ? (isHovered ? -46 : -40) : 0;
  $: opacityVal = stackOffset === 1 ? 0.94 : stackOffset === 2 ? 0.88 : 1;

  // 3D tilt while dragging front card
  $: tiltX = isDragging ? Math.max(-25, Math.min(25, -dragY * 0.12)) : 0;
  $: tiltY = isDragging ? Math.max(-25, Math.min(25, dragX * 0.12)) : 0;
  $: dragRotateZ = isDragging ? Math.max(-15, Math.min(15, dragX * 0.05)) : 0;

  $: cardTransformStyle = (() => {
    if (isActive) {
      if (isFlyingOut) {
        return `transform: translate3d(${flyDirection.x}px, ${flyDirection.y}px, 0px) rotateZ(${flyDirection.x > 0 ? 20 : -20}deg) scale(0.9); opacity: 0; transition: transform 240ms ease-in, opacity 240ms ease-in;`;
      }
      if (isDragging) {
        return `transform: translate3d(${dragX}px, ${dragY}px, 0px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${dragRotateZ}deg) scale(1.02); cursor: grabbing; touch-action: none; transition: none;`;
      }
      return `transform: translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); transform-origin: center top; transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease, box-shadow 350ms ease;`;
    }
    return `transform: translate3d(0px, ${translateYPx}px, -${stackOffset * 20}px) rotateZ(${rotateZDeg}deg) scale(${scaleVal}); transform-origin: center top; opacity: ${opacityVal}; transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease;`;
  })();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  role="region"
  aria-label={`Kartu Bank ${account.bankName} akhiran ${lastFourDigits}`}
  class="relative w-full h-full rounded-3xl {brandConfig.gradientClass} border {brandConfig.borderClass} p-6 sm:p-7 text-white shadow-2xl shadow-black/40 will-change-transform select-none {zIndexClass} {isJustSelected ? 'ring-2 ring-orange shadow-orange-500/35 ring-offset-2 ring-offset-card scale-100' : isActive ? 'ring-2 ring-orange/40 shadow-orange-500/10 cursor-grab' : 'cursor-pointer hover:brightness-115 hover:opacity-100 active:scale-[0.98]'}"
  style={cardTransformStyle}
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointercancel={handlePointerCancel}
  on:mouseenter={() => { if (!isActive) isHovered = true; }}
  on:mouseleave={() => { isHovered = false; }}
  on:click={() => { if (!isActive) onSelect(); }}
>
  <!-- Dynamic Ambient Glows -->
  <div class="absolute -right-16 -top-16 w-60 h-60 rounded-full {brandConfig.glowClass} blur-3xl pointer-events-none"></div>
  <div class="absolute -left-12 -bottom-12 w-52 h-52 rounded-full {brandConfig.glowClass} blur-2xl pointer-events-none opacity-60"></div>
  <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] opacity-20 pointer-events-none rounded-3xl"></div>

  <!-- Bank Ornament Vector -->
  <BankCardOrnament bankCode={account.bankName || account.bankCode} />

  <div class="relative z-10 flex flex-col justify-between h-full min-h-[190px]">
    <!-- Top Row: Chip + Bank Logo & Actions -->
    <div class="flex items-center justify-between gap-3 mb-4">
      <div class="flex items-center gap-2.5">
        <!-- Smart Chip Visual -->
        <div class="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/60 shadow-sm relative overflow-hidden flex items-center justify-center flex-shrink-0">
          <div class="w-full h-full border border-amber-900/30 rounded-[3px] grid grid-cols-2 gap-0.5 opacity-70">
            <div class="border-r border-b border-amber-900/40"></div>
            <div class="border-b border-amber-900/40"></div>
            <div class="border-r border-amber-900/40"></div>
            <div></div>
          </div>
        </div>

        <!-- Contactless Symbol -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/70">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1.5-2.5" />
          <path d="M5.5 17.5A6.5 6.5 0 0 0 12 11c0-3.59-1.5-5.5-4-6.5" />
          <path d="M2.5 20.5A10.5 10.5 0 0 0 13 10c0-5.8-2.5-9-6.5-10.5" />
        </svg>

        {#if account.isPrimary}
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-xs">
            <Star size={10} class="fill-amber-300 text-amber-300" />
            <span>Rekening Utama</span>
          </span>
        {/if}

        {#if !isActive}
          <span class="hidden sm:inline-block px-2 py-0.5 rounded-full text-3xs font-mono font-bold bg-white/15 text-white/90">
            Klik untuk pakai
          </span>
        {:else if totalCards > 1}
          <span class="hidden sm:inline-block px-2 py-0.5 rounded-full text-3xs font-mono font-bold bg-white/15 text-white/90">
            Geser untuk ganti
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        {#if brandConfig.logoPath}
          <img
            src={brandConfig.logoPath}
            alt={brandConfig.name}
            class="h-9 sm:h-10 w-auto max-w-[110px] object-contain rounded-lg shadow-sm drop-shadow-xs"
          />
        {:else}
          <div class="inline-flex items-center {brandConfig.badgeClass} border px-3 py-0.5 rounded-full text-xs font-black font-mono uppercase">
            <span>{brandConfig.name || account.bankName}</span>
          </div>
        {/if}

        <!-- Actions visible only when card is active -->
        {#if isActive}
          {#if !account.isPrimary}
            <button
              type="button"
              class="px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/30 hover:border-white bg-white/10 hover:bg-white/20 backdrop-blur-xs transition-all cursor-pointer"
              title="Jadikan Sebagai Rekening Utama"
              on:click|stopPropagation={() => onTriggerSetPrimary(account)}
            >
              Jadikan Utama
            </button>
          {/if}

          {#if canDelete}
            <button
              type="button"
              class="p-1.5 rounded-full text-red-200 border border-red-400/30 hover:border-red-400 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-xs transition-all cursor-pointer"
              title="Hapus Rekening Ini"
              on:click|stopPropagation={() => onTriggerDelete(account)}
            >
              <Trash2 size={13} />
            </button>
          {/if}
        {/if}
      </div>
    </div>

    <!-- Middle Row: Account Number -->
    <div class="w-full my-3 sm:my-4">
      <span class="text-[10px] text-white/60 font-bold uppercase tracking-widest font-heading block mb-0.5">
        Nomor Rekening
      </span>
      <p class="whitespace-nowrap font-mono tracking-widest text-base sm:text-xl font-black text-white drop-shadow-sm">
        •••• &nbsp;•••• &nbsp;•••• &nbsp;<span class="{brandConfig.accentTextClass} font-black">{lastFourDigits}</span>
      </p>
    </div>

    <!-- Cardholder Details -->
    <div>
      <span class="text-[10px] text-white/60 uppercase tracking-widest font-bold font-heading block">
        Pemilik Rekening Terverifikasi
      </span>
      <p class="text-xs sm:text-sm font-bold text-white uppercase truncate font-mono tracking-wide mt-0.5 drop-shadow-xs">
        {resolvedHolderName}
      </p>
    </div>
  </div>
</div>

<script lang="ts">
  import { Heart, MessageCircle, Star, CheckCircle2 } from 'lucide-svelte';
  import type { TestimonialItem } from '@/types';
  import { canvasStore } from '../../stores/editorStore';
  import { resolveTestimonialItemStyle } from './testimonialStyles.helpers';
  import Modal from '@/components/ui/Modal.svelte';

  export let sectionId: string = '';
  export let testimonials: TestimonialItem[] = [];
  export let nodeStyles: Record<string, Record<string, string>> = {};

  // Per-card liked & comment state
  let likedMap: Record<number, boolean> = {};
  let animatingHeart: number | null = null;
  let commentModalIndex: number | null = null;
  let customComments: Record<number, Array<{ author: string; text: string; time: string }>> = {};
  let newCommentAuthor: string = '';
  let newCommentText: string = '';

  $: commentModalOpen = commentModalIndex !== null;
  $: commentModalItem = commentModalIndex !== null ? testimonials[commentModalIndex] ?? null : null;

  // Static fallback comments
  const SAMPLE_COMMENTS: Array<{ author: string; text: string; time: string }[]> = [
    [
      { author: 'Rina W.', text: 'Setuju banget, produknya memang top!', time: '2j lalu' },
      { author: 'Budi S.', text: 'Saya juga udah beli, recommended!', time: '5j lalu' },
    ],
    [
      { author: 'Dewi K.', text: 'Pengirimannya cepat ya, mantap!', time: '1h lalu' },
    ],
    [
      { author: 'Riko A.', text: 'Harganya juga oke banget buat kualitas segini.', time: '3j lalu' },
      { author: 'Siti N.', text: 'Semoga makin berkembang tokonya!', time: '4j lalu' },
      { author: 'Ahmad F.', text: 'Baru tahu toko ini, langsung order.', time: '1h lalu' },
    ],
  ];

  function selectCard(e: Event, idx: number, item: TestimonialItem) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, item.id || `testi_item_${idx}`);
    }
  }

  function selectAvatar(e: Event, idx: number) {
    e.stopPropagation();
    if (sectionId) {
      canvasStore.selectNode(sectionId, `testi_avatar_${idx}`);
    }
  }

  function toggleHeart(e: Event, idx: number) {
    e.stopPropagation();
    likedMap = { ...likedMap, [idx]: !likedMap[idx] };
    animatingHeart = idx;
    setTimeout(() => {
      if (animatingHeart === idx) animatingHeart = null;
    }, 400);
  }

  function openComments(e: Event, idx: number) {
    e.stopPropagation();
    commentModalIndex = idx;
  }

  function closeComments() {
    commentModalIndex = null;
    newCommentAuthor = '';
    newCommentText = '';
  }

  function getCommentsForItem(idx: number, item?: TestimonialItem | null) {
    if (customComments[idx]) return customComments[idx];
    if (item?.comments && item.comments.length > 0) {
      return item.comments.map((c) => ({ author: c.author, text: c.text, time: c.time || '1j lalu' }));
    }
    return SAMPLE_COMMENTS[idx % SAMPLE_COMMENTS.length] ?? [];
  }

  function addComment(idx: number) {
    if (!newCommentText.trim()) return;
    const current = [...getCommentsForItem(idx, testimonials[idx])];
    const updated = [
      ...current,
      {
        author: newCommentAuthor.trim() || 'Pengunjung',
        text: newCommentText.trim(),
        time: 'Baru saja',
      },
    ];
    customComments = { ...customComments, [idx]: updated };
    newCommentText = '';
  }
</script>

<div class="cq-testi-grid-3 text-left">
  {#each testimonials as item, index (item.id || index)}
    {@const itemStyle = resolveTestimonialItemStyle(item, index, nodeStyles)}
    {@const isCardActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === (item.id || `testi_item_${index}`)}
    {@const isAvatarActive = $canvasStore.selectedSectionId === sectionId && $canvasStore.selectedNodeId === `testi_avatar_${index}`}
    {@const handle = (item.customerName || 'user').toLowerCase().replace(/\s+/g, '_')}
    {@const isLiked = !!likedMap[index]}
    {@const likeCount = (94 + index * 34) + (isLiked ? 1 : 0)}
    {@const comments = getCommentsForItem(index, item)}
    {@const commentCount = comments.length}

    <div
      role="button"
      tabindex="0"
      on:click={(e) => selectCard(e, index, item)}
      on:keydown={(e) => { if (e.key === 'Enter') selectCard(e, index, item); }}
      class={`p-5 rounded-3xl border border-light/80 bg-card shadow-xs flex flex-col justify-between space-y-3 transition-all duration-200 cursor-pointer ${
        isCardActive
          ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-base-100 shadow-md'
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-3 min-w-0">
          <div
            role="button"
            tabindex="0"
            on:click={(e) => selectAvatar(e, index)}
            on:keydown={(e) => { if (e.key === 'Enter') selectAvatar(e, index); }}
            class={`w-9 h-9 rounded-full overflow-hidden bg-nested shrink-0 cursor-pointer ${
              isAvatarActive ? 'ring-2 ring-primary' : ''
            }`}
          >
            {#if item.avatar}
              <img src={item.avatar} alt={item.customerName} class="w-full h-full object-cover" />
            {:else}
              <div class="w-full h-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                {(item.customerName || 'U').charAt(0).toUpperCase()}
              </div>
            {/if}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1">
              <h4 class="font-heading font-bold text-xs text-main truncate">
                {item.customerName}
              </h4>
              {#if item.verified !== false}
                <CheckCircle2 size={11} class="text-emerald-500 shrink-0" />
              {/if}
            </div>
            <p class="text-[10px] text-secondary/70 truncate font-mono">
              @{handle}
            </p>
          </div>
        </div>
        <span class="text-[10px] text-secondary font-mono shrink-0">
          {item.platform || (index === 0 ? 'WhatsApp' : index === 1 ? 'Instagram' : 'Google')}
        </span>
      </div>

      <div class="flex items-center gap-0.5 text-amber-400">
        {#each Array(item.rating || 5) as _}
          <Star size={11} class="fill-amber-400 text-amber-400" />
        {/each}
      </div>

      <p
        class="text-xs leading-relaxed"
        style="{itemStyle.color ? `color: ${itemStyle.color};` : 'color: var(--color-text-main);'}"
      >
        {item.comment}
      </p>

      <div class="flex items-center gap-4 pt-3 border-t border-light/60 text-[11px] text-secondary">
        <!-- Interactive heart button with animation -->
        <button
          type="button"
          on:click={(e) => toggleHeart(e, index)}
          class="flex items-center gap-1.5 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer select-none"
          class:text-rose-500={isLiked}
          class:text-secondary={!isLiked}
          aria-label={isLiked ? 'Batal suka' : 'Suka ulasan ini'}
          aria-pressed={isLiked}
        >
          <Heart
            size={13}
            class={`transition-all duration-200 ${animatingHeart === index ? 'animate-heart-pop' : ''} ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'fill-rose-500/20 text-rose-500'}`}
          />
          <span>{likeCount} Suka</span>
        </button>

        <!-- Comment button that opens modal -->
        <button
          type="button"
          on:click={(e) => openComments(e, index)}
          class="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Buka komentar"
        >
          <MessageCircle size={13} />
          <span>{commentCount} Komentar</span>
        </button>
      </div>
    </div>
  {/each}
</div>

<!-- Comment Modal (per review) -->
<Modal
  open={commentModalOpen}
  title={commentModalItem ? `Komentar — ${commentModalItem.customerName}` : ''}
  size="sm"
  on:close={closeComments}
>
  {#if commentModalItem && commentModalIndex !== null}
    {@const comments = getCommentsForItem(commentModalIndex, commentModalItem)}
    <div class="space-y-4">
      <!-- Original review snippet -->
      <div class="p-3 rounded-2xl bg-nested border border-light/60 text-xs leading-relaxed text-main italic">
        "{commentModalItem.comment}"
      </div>

      <!-- Comments list -->
      <div class="space-y-3 max-h-56 overflow-y-auto pr-1">
        {#each comments as c}
          <div class="flex gap-2.5">
            <div class="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {c.author.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2">
                <span class="font-heading font-bold text-xs text-main">{c.author}</span>
                <span class="text-[10px] text-secondary">{c.time}</span>
              </div>
              <p class="text-xs text-main/80 mt-0.5 leading-relaxed">{c.text}</p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Add Comment Form -->
      <form on:submit|preventDefault={() => { if (commentModalIndex !== null) addComment(commentModalIndex); }} class="pt-3 border-t border-light/60 space-y-2">
        <span class="block text-2xs font-semibold text-secondary">Tambah Komentar Ulasan:</span>
        <div class="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            bind:value={newCommentAuthor}
            placeholder="Nama..."
            class="w-full sm:w-28 px-2.5 py-1.5 bg-card border border-light rounded-xl text-xs text-main focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            bind:value={newCommentText}
            placeholder="Tulis komentar..."
            class="flex-1 px-2.5 py-1.5 bg-card border border-light rounded-xl text-xs text-main focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            class="px-4 py-1.5 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  {/if}
</Modal>

<style>
  @keyframes heartPop {
    0% { transform: scale(1); }
    40% { transform: scale(1.45) rotate(-12deg); }
    75% { transform: scale(1.15) rotate(6deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  .animate-heart-pop {
    animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
</style>

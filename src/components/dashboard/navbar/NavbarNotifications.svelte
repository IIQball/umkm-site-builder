<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale, slide } from "svelte/transition";
  import { cubicOut, backOut } from "svelte/easing";
  import Button from "@/components/ui/Button.svelte";
  import { formatDate } from "@/lib/utils/format";
  import type { AuthenticatedUser } from "@/lib/auth";
  import {
    getNotificationIcon,
    getNotificationLink,
    filterNotifications,
    buildNotificationTabs,
    type AppNotificationItem,
  } from "./notification.helpers";
  import NotificationDeleteModal from "./NotificationDeleteModal.svelte";

  export let user: AuthenticatedUser | null = null;
  let notifications: AppNotificationItem[] = [];
  let unreadCount = 0;
  let isOpen = false;
  let isLoading = true;
  let activeTab = "all";
  let notificationToDelete: string | null = null;
  let containerRef: HTMLDivElement;
  let modalClosedAt = 0;

  const toggleDropdown = () => {
    isOpen = !isOpen;
    if (isOpen) {
      fetchNotifications();
    }
  };

  const closeDropdown = () => {
    if (Date.now() - modalClosedAt < 350) return;
    if (notificationToDelete) return;
    isOpen = false;
  };

  const handleCancelModal = () => {
    modalClosedAt = Date.now();
    notificationToDelete = null;
  };

  const handleWindowClick = (e: MouseEvent) => {
    if (!isOpen) return;
    if (Date.now() - modalClosedAt < 350) return;
    if (notificationToDelete) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    if (containerRef && containerRef.contains(target)) return;
    if (target.closest('.modal, [role="dialog"], [role="presentation"]')) return;

    isOpen = false;
  };

  const fetchNotifications = async () => {
    isLoading = true;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        notifications = json.data || [];
        unreadCount = notifications.filter((n) => !n.isRead).length;
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      isLoading = false;
    }
  };

  const markAsRead = async (id?: string, isRead?: boolean) => {
    if (!id || isRead) return;
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      notifications = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      unreadCount = notifications.filter((n) => !n.isRead).length;
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const deleteNotification = async (id: string) => {
    modalClosedAt = Date.now();
    notificationToDelete = null;
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      notifications = notifications.filter((n) => n.id !== id);
      unreadCount = notifications.filter((n) => !n.isRead).length;
    } catch (e) {
      console.error("Failed to delete notification", e);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`/api/notifications/read-all`, { method: "POST" });
      notifications = notifications.map((n) => ({ ...n, isRead: true }));
      unreadCount = 0;
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    }
  };

  onMount(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  });

  $: filteredNotifications = filterNotifications(notifications, activeTab);
  $: tabs = buildNotificationTabs(notifications, user?.role);
</script>

<svelte:window on:click={handleWindowClick} />

<div bind:this={containerRef} class="static sm:relative">
  <!-- Notification Bell Button -->
  <Button
    variant="ghost"
    size="icon"
    on:click={(e) => { e.detail?.stopPropagation?.(); toggleDropdown(); }}
    class="relative rounded-full text-muted hover:text-main cursor-pointer"
    aria-label="Notifikasi"
    title="Notifikasi"
  >
    <span class="material-symbols-outlined text-lg">notifications</span>
    {#if unreadCount > 0}
      <span
        in:scale={{ duration: 400, easing: backOut, start: 0.5 }}
        class="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-error text-white text-[9px] font-bold rounded-full ring-2 ring-card leading-none"
      >
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    {/if}
  </Button>

  <!-- Dropdown & Mobile Backdrop -->
  {#if isOpen}
    <!-- Backdrop for mobile/clicking outside -->
    <button
      type="button"
      tabindex="-1"
      class="fixed inset-0 z-40 w-full h-full bg-black/25 sm:bg-transparent backdrop-blur-[1px] sm:backdrop-blur-none border-none cursor-default outline-none transition-opacity"
      on:click={closeDropdown}
      aria-label="Tutup notifikasi"
    ></button>

    <!-- Dropdown Panel (Responsive: full width on mobile with safe inset, popover on desktop) -->
    <div
      role="presentation"
      in:fly={{ y: -8, duration: 200, easing: cubicOut }}
      out:fade={{ duration: 150 }}
      class="absolute inset-x-2.5 sm:inset-x-auto sm:right-0 top-full mt-2 w-auto sm:w-[400px] max-w-[calc(100vw-1.25rem)] sm:max-w-[400px] bg-card border border-light rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-light flex items-center justify-between bg-card">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-lg">notifications</span>
          <h3 class="text-sm sm:text-base font-bold text-main font-heading tracking-tight">Notifikasi</h3>
          {#if unreadCount > 0}
            <span class="px-2 py-0.5 text-2xs font-bold rounded-full bg-primary/15 text-primary">
              {unreadCount} baru
            </span>
          {/if}
        </div>
        <Button
          variant="ghost"
          size="icon"
          on:click={fetchNotifications}
          class="h-8 w-8 min-h-[32px] min-w-[32px] rounded-xl text-muted hover:text-main cursor-pointer"
          title="Refresh"
        >
          <span class="material-symbols-outlined text-[18px]" class:animate-spin={isLoading}>sync</span>
        </Button>
      </div>

      <!-- Category Filter Tabs -->
      <div class="px-3 sm:px-4 py-2 border-b border-light bg-nested/30">
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {#each tabs as tab}
            <button
              type="button"
              on:click={() => (activeTab = tab.id)}
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl shrink-0 transition-all cursor-pointer {activeTab === tab.id
                ? 'bg-card text-main shadow-xs border border-light font-bold'
                : 'text-muted hover:text-main hover:bg-nested/60 border border-transparent'}"
            >
              <span>{tab.label}</span>
              <span class="px-1.5 py-0.5 rounded-full text-2xs min-w-[18px] text-center font-mono {activeTab === tab.id ? 'bg-primary/15 text-primary font-bold' : 'bg-light/40 text-muted'}">
                {tab.count}
              </span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Notification List -->
      <div class="max-h-[min(380px,calc(100vh-210px))] sm:max-h-[360px] overflow-y-auto divide-y divide-light/60">
        {#if isLoading && notifications.length === 0}
          <div class="py-12 flex items-center justify-center text-sm text-secondary">
            <span class="loading loading-spinner loading-sm text-primary mr-2"></span>
            <span>Memuat notifikasi...</span>
          </div>
        {:else if filteredNotifications.length === 0}
          <div class="py-14 flex flex-col items-center justify-center gap-1 px-4 text-center">
            <span class="material-symbols-outlined text-2xl text-muted/40 mb-1">notifications_off</span>
            <p class="text-xs sm:text-sm text-main font-medium">Tidak ada notifikasi di kategori ini</p>
            <p class="text-2xs text-muted">Semua update terkini akan muncul di sini</p>
          </div>
        {:else}
          {#each filteredNotifications as notif (notif.id)}
            <div out:slide={{ duration: 180, easing: cubicOut }}>
              <a
                href={getNotificationLink(notif, user?.role)}
                on:click={() => markAsRead(notif.id, notif.isRead)}
                class="flex items-start gap-3 px-3.5 sm:px-4 py-3 hover:bg-nested transition-colors group {notif.isRead ? '' : 'bg-primary/5'}"
              >
                <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-[16px]">{getNotificationIcon(notif.type)}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-1.5">
                    <p class="text-xs sm:text-[13px] {notif.isRead ? 'font-medium text-secondary' : 'font-bold text-main'} leading-tight truncate">
                      {notif.title}
                    </p>
                    {#if !notif.isRead}
                      <span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                    {/if}
                  </div>
                  <p class="text-[11.5px] leading-relaxed {notif.isRead ? 'text-muted' : 'text-secondary'} line-clamp-2 mt-0.5">
                    {notif.message}
                  </p>
                  <p class="text-2xs text-muted/70 mt-1">
                    {formatDate(notif.createdAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 min-w-[28px] min-h-[28px] rounded-lg hover:bg-error/10 text-muted hover:text-error shrink-0"
                  on:click={(e) => { e.detail?.preventDefault?.(); e.detail?.stopPropagation?.(); notificationToDelete = notif.id ?? null; }}
                  title="Hapus notifikasi"
                >
                  <span class="material-symbols-outlined text-[15px]">delete</span>
                </Button>
              </a>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Footer -->
      <div class="p-3 sm:p-3.5 border-t border-light flex items-center justify-between bg-card">
        <span class="text-2xs text-muted font-sans">
          {notifications.length} notifikasi
        </span>
        <Button
          variant="tertiary"
          on:click={markAllAsRead}
          disabled={unreadCount === 0}
          class="text-xs font-bold text-primary hover:text-primary-focus cursor-pointer"
        >
          Tandai semua dibaca
        </Button>
      </div>
    </div>
  {/if}
</div>

<!-- Modal Konfirmasi Hapus Notifikasi -->
<NotificationDeleteModal
  bind:notificationToDelete
  onConfirm={(id) => {
    modalClosedAt = Date.now();
    deleteNotification(id);
  }}
  onCancel={handleCancelModal}
/>

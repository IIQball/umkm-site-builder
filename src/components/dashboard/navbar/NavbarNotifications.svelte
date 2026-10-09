<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly, scale, slide } from "svelte/transition";
  import { cubicOut, backOut } from "svelte/easing";
  import Button from "@/components/ui/Button.svelte";
  import Modal from "@/components/ui/Modal.svelte";
  import { formatDate } from "@/lib/utils/format";
  
  export let user: any = null;
  let notifications: any[] = [];
  let unreadCount = 0;
  let isOpen = false;
  let isLoading = true;
  let activeTab = 'all'; // 'all', 'template', 'users'
  let notificationToDelete: string | null = null;

  const toggleDropdown = () => {
    isOpen = !isOpen;
    if (isOpen) {
      fetchNotifications();
    }
  };

  const closeDropdown = () => {
    isOpen = false;
  };

  const fetchNotifications = async () => {
    isLoading = true;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        notifications = json.data;
        unreadCount = notifications.filter(n => !n.isRead).length;
      }
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    } finally {
      isLoading = false;
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
      notifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
      unreadCount = notifications.filter(n => !n.isRead).length;
    } catch (e) {
      console.error("Failed to mark notification as read", e);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      notifications = notifications.filter(n => n.id !== id);
      unreadCount = notifications.filter(n => !n.isRead).length;
    } catch (e) {
      console.error("Failed to delete notification", e);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`/api/notifications/read-all`, { method: "POST" });
      notifications = notifications.map(n => ({ ...n, isRead: true }));
      unreadCount = 0;
    } catch (e) {
      console.error("Failed to mark all notifications as read", e);
    }
  };

  onMount(() => {
    fetchNotifications();
    // Poll every 60 seconds to avoid dev server log spam
    const interval = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(interval);
  });

  $: filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'users') return n.type === 'user_registered';
    if (activeTab === 'sales') return n.type === 'template_purchased';
    if (activeTab === 'template') return ['template_submitted', 'template_reviewed'].includes(n.type);
    if (activeTab === 'store') return ['store_managed_by_admin', 'template_purchased'].includes(n.type);
    if (activeTab === 'quota') return ['quota_upgrade_request'].includes(n.type);
    return true;
  });

  $: allCount = notifications.filter(n => !n.isRead).length;
  $: templateCount = notifications.filter(n => ['template_submitted', 'template_reviewed'].includes(n.type) && !n.isRead).length;
  $: usersCount = notifications.filter(n => n.type === 'user_registered' && !n.isRead).length;
  $: salesCount = notifications.filter(n => n.type === 'template_purchased' && !n.isRead).length;
  $: storeCount = notifications.filter(n => ['store_managed_by_admin', 'template_purchased'].includes(n.type) && !n.isRead).length;
  $: quotaCount = notifications.filter(n => ['quota_upgrade_request'].includes(n.type) && !n.isRead).length;

  function getIcon(type: string) {
    if (type === 'user_registered') return 'person_add';
    if (type === 'template_submitted') return 'palette';
    if (type === 'template_reviewed') return 'fact_check';
    if (type === 'template_purchased') return 'shopping_cart';
    if (type === 'store_managed_by_admin') return 'storefront';
    if (type === 'quota_upgrade_request') return 'rocket_launch';
    return 'notifications';
  }

  function getLink(notif: any) {
    const type = notif.type;
    if (type === 'user_registered') return '/superadmin/users';
    if (type === 'template_submitted') return '/superadmin/templates';
    if (type === 'template_reviewed') return '/designer/templates';
    if (type === 'template_purchased') return user?.role === 'tenant' ? '/tenant/store' : '/designer/wallet';
    if (type === 'store_managed_by_admin') return '/tenant/store';
    if (type === 'quota_upgrade_request') {
      if (user?.role === 'tenant') {
        return '/tenant/store';
      }
      const { tenantId, requested } = notif.metadata || {};
      if (tenantId) {
        let url = `/superadmin/users?action=quota&tenantId=${tenantId}`;
        if (requested?.productSlots) url += `&addProd=${requested.productSlots}`;
        if (requested?.categorySlots) url += `&addCat=${requested.categorySlots}`;
        return url;
      }
      return '/superadmin/users';
    }
    return '#';
  }
</script>

<svelte:window on:click={() => { if (isOpen && !notificationToDelete) isOpen = false; }} />

<div class="relative">
  <!-- Notification Bell -->
  <Button
    variant="ghost"
    size="icon"
    on:click={(e) => { e.detail?.stopPropagation?.(); toggleDropdown(); }}
    class="relative rounded-full text-muted hover:text-main"
    aria-label="Notifikasi"
    title="Notifikasi"
  >
    <span class="material-symbols-outlined text-lg">notifications</span>
    {#if unreadCount > 0}
      <span 
        in:scale={{ duration: 400, easing: backOut, start: 0.5 }}
        class="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-error text-white text-[9px] font-bold rounded-full ring-2 ring-card leading-none"
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    {/if}
  </Button>

  <!-- Dropdown -->
  {#if isOpen}
    <div
      role="presentation"
      in:fly={{ y: -10, duration: 250, easing: cubicOut }}
      out:fade={{ duration: 150 }}
      class="absolute right-0 top-full mt-2 w-[400px] max-w-[calc(100vw-2rem)] bg-card border border-light rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-light flex items-center justify-between">
        <h3 class="text-base font-bold text-main tracking-tight">Notifikasi</h3>
        <Button variant="ghost" size="icon" on:click={fetchNotifications} class="h-8 w-8 min-h-[32px] min-w-[32px] text-muted hover:text-main" title="Refresh">
          <span class="material-symbols-outlined text-[18px]" class:animate-spin={isLoading}>sync</span>
        </Button>
      </div>

      <!-- Tabs -->
      <div class="px-4 py-2 border-b border-light">
        <div class="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 -mb-1">
          <Button 
            variant="ghost" size="sm"
            on:click={() => activeTab = 'all'} 
            class="text-sm rounded-lg shrink-0 {activeTab === 'all' ? 'bg-nested text-main hover:bg-nested' : 'text-muted hover:text-main hover:bg-nested/50'}"
          >
            Semua
            <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{allCount}</span>
          </Button>
          <Button 
            variant="ghost" size="sm"
            on:click={() => activeTab = 'template'} 
            class="text-sm rounded-lg shrink-0 {activeTab === 'template' ? 'bg-nested text-main hover:bg-nested' : 'text-muted hover:text-main hover:bg-nested/50'}"
          >
            Template
            <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{templateCount}</span>
          </Button>
          
          {#if user?.role === 'superadmin'}
            <Button 
              variant="ghost" size="sm"
              on:click={() => activeTab = 'users'} 
              class="text-sm rounded-lg shrink-0 {activeTab === 'users' ? 'bg-nested text-main hover:bg-nested' : 'text-muted hover:text-main hover:bg-nested/50'}"
            >
              Pengguna
              <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{usersCount}</span>
            </Button>
          {:else if user?.role === 'designer'}
            <Button 
              variant="ghost" size="sm"
              on:click={() => activeTab = 'sales'} 
              class="text-sm rounded-lg shrink-0 {activeTab === 'sales' ? 'bg-nested text-main hover:bg-nested' : 'text-muted hover:text-main hover:bg-nested/50'}"
            >
              Penjualan
              <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{salesCount}</span>
            </Button>
          {:else if user?.role === 'tenant'}
            <Button 
              variant="ghost" size="sm"
              on:click={() => activeTab = 'store'} 
              class="text-sm rounded-lg shrink-0 {activeTab === 'store' ? 'bg-nested text-main hover:bg-nested' : 'text-muted hover:text-main hover:bg-nested/50'}"
            >
              Toko
              <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{storeCount}</span>
            </Button>
          {/if}

          {#if user?.role === 'superadmin' || user?.role === 'tenant'}
            <Button 
              variant="ghost" size="sm"
              on:click={() => activeTab = 'quota'} 
              class="text-sm rounded-lg shrink-0 {activeTab === 'quota' ? 'bg-nested text-main hover:bg-nested' : 'text-muted hover:text-main hover:bg-nested/50'}"
            >
              Kuota
              <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{quotaCount}</span>
            </Button>
          {/if}
        </div>
      </div>

      <!-- Content -->
      <div class="max-h-[300px] overflow-y-auto">
        {#if isLoading && notifications.length === 0}
          <div class="py-12 flex items-center justify-center text-sm text-muted">Memuat...</div>
        {:else if filteredNotifications.length === 0}
          <div class="py-16 flex items-center justify-center">
            <p class="text-sm text-muted font-medium">Tidak ada notifikasi di kategori ini</p>
          </div>
        {:else}
          {#each filteredNotifications as notif (notif.id)}
            <div out:slide|local={{ duration: 200, easing: cubicOut }}>
              <a
                href={getLink(notif)}
                on:click={() => markAsRead(notif.id, notif.isRead)}
                class="flex items-start gap-2.5 px-4 py-3 border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-nested transition-colors group {notif.isRead ? '' : 'bg-primary/5'}"
              >
                <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-[15px]">{getIcon(notif.type)}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] {notif.isRead ? 'font-medium text-secondary' : 'font-semibold text-main'} leading-tight">{notif.title}</p>
                  <p class="text-[11.5px] leading-[1.4] {notif.isRead ? 'text-muted' : 'text-secondary'} line-clamp-2 mt-0.5">{notif.message}</p>
                  <p class="text-xs text-muted mt-1 opacity-60">
                    {formatDate(notif.createdAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {#if !notif.isRead}
                  <div class="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0 mt-1.5 shadow-sm"></div>
                {/if}
                <Button 
                  variant="ghost" size="icon"
                  class="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 min-w-[28px] min-h-[28px] rounded-md hover:bg-error/10 text-muted hover:text-error shrink-0"
                  on:click={(e) => { e.detail?.preventDefault?.(); e.detail?.stopPropagation?.(); notificationToDelete = notif.id; }}
                  title="Hapus notifikasi"
                >
                  <span class="material-symbols-outlined text-[16px]">delete</span>
                </Button>
              </a>
            </div>
          {/each}
        {/if}
      </div>
      
      <!-- Footer -->
      <div class="p-4 border-t border-light flex items-center justify-center bg-card">
        <Button 
          variant="tertiary"
          on:click={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Tandai semua dibaca
        </Button>
      </div>
    </div>
    
    <!-- Backdrop for mobile/clicking outside -->
    <button
      type="button"
      tabindex="-1"
      class="fixed inset-0 z-40 w-full h-full bg-transparent border-none cursor-default outline-none" 
      on:click={closeDropdown}
      aria-label="Tutup dropdown"
    ></button>
  {/if}
</div>

<Modal
  open={!!notificationToDelete}
  title="Hapus Notifikasi?"
  size="xs"
  borderless
  on:close={() => notificationToDelete = null}
>
  <p class="text-sm text-secondary leading-relaxed">
    Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
  </p>
  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => notificationToDelete = null}>Batal</Button>
    <Button 
      variant="destructive" 
      on:click={() => { 
        if (notificationToDelete) deleteNotification(notificationToDelete); 
        notificationToDelete = null; 
      }}
    >
      Ya, Hapus
    </Button>
  </svelte:fragment>
</Modal>

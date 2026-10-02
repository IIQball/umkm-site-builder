<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  
  export let user: any = null;
  let notifications: any[] = [];
  let unreadCount = 0;
  let isOpen = false;
  let isLoading = true;
  let activeTab = 'all'; // 'all', 'template', 'users'

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
    // Poll every 5 seconds for near real-time notifications
    const interval = setInterval(fetchNotifications, 5000); 
    return () => clearInterval(interval);
  });

  $: filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'users') return n.type === 'user_registered';
    if (activeTab === 'sales') return n.type === 'template_purchased';
    if (activeTab === 'template') return ['template_submitted', 'template_reviewed'].includes(n.type);
    return true;
  });

  $: allCount = notifications.filter(n => !n.isRead).length;
  $: templateCount = notifications.filter(n => ['template_submitted', 'template_reviewed'].includes(n.type) && !n.isRead).length;
  $: usersCount = notifications.filter(n => n.type === 'user_registered' && !n.isRead).length;
  $: salesCount = notifications.filter(n => n.type === 'template_purchased' && !n.isRead).length;

  function getIcon(type: string) {
    if (type === 'user_registered') return 'person_add';
    if (type === 'template_submitted') return 'palette';
    if (type === 'template_reviewed') return 'fact_check';
    if (type === 'template_purchased') return 'shopping_cart';
    return 'notifications';
  }

  function getLink(type: string) {
    if (type === 'user_registered') return '/superadmin/users';
    if (type === 'template_submitted') return '/superadmin/templates';
    if (type === 'template_reviewed') return '/designer/templates';
    if (type === 'template_purchased') return '/designer/wallet';
    return '#';
  }
</script>

<svelte:window on:click={() => { if (isOpen) isOpen = false; }} />

<div class="relative">
  <!-- Notification Bell -->
  <button
    type="button"
    on:click|stopPropagation={toggleDropdown}
    class="relative p-2 text-muted hover:text-main hover:bg-nested rounded-full transition-colors active:scale-95 cursor-pointer"
    aria-label="Notifikasi"
    title="Notifikasi"
  >
    <span class="material-symbols-outlined text-lg">notifications</span>
    {#if unreadCount > 0}
      <span class="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-error text-white text-[9px] font-bold rounded-full ring-2 ring-card leading-none">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    {/if}
  </button>

  <!-- Dropdown -->
  {#if isOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
      class="absolute right-0 top-full mt-2 w-[400px] max-w-[calc(100vw-2rem)] bg-card border border-light rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
      on:click|stopPropagation
    >
      <!-- Header -->
      <div class="px-4 py-3 border-b border-light flex items-center justify-between">
        <h3 class="text-base font-bold text-main tracking-tight">Notifikasi</h3>
        <button on:click={fetchNotifications} class="text-muted hover:text-main transition-colors" title="Refresh">
          <span class="material-symbols-outlined text-[18px]" class:animate-spin={isLoading}>sync</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="px-4 py-2 border-b border-light">
        <div class="flex items-center gap-1">
          <button 
            on:click={() => activeTab = 'all'} 
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {activeTab === 'all' ? 'bg-nested text-main' : 'text-muted hover:text-main hover:bg-nested/50'}"
          >
            Semua
            <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{allCount}</span>
          </button>
          <button 
            on:click={() => activeTab = 'template'} 
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {activeTab === 'template' ? 'bg-nested text-main' : 'text-muted hover:text-main hover:bg-nested/50'}"
          >
            Template
            <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{templateCount}</span>
          </button>
          
          {#if user?.role === 'superadmin'}
            <button 
              on:click={() => activeTab = 'users'} 
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {activeTab === 'users' ? 'bg-nested text-main' : 'text-muted hover:text-main hover:bg-nested/50'}"
            >
              Pengguna
              <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{usersCount}</span>
            </button>
          {:else if user?.role === 'designer'}
            <button 
              on:click={() => activeTab = 'sales'} 
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {activeTab === 'sales' ? 'bg-nested text-main' : 'text-muted hover:text-main hover:bg-nested/50'}"
            >
              Penjualan
              <span class="bg-light/30 text-muted px-1.5 py-0.5 rounded-full text-xs min-w-[20px] text-center">{salesCount}</span>
            </button>
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
            <a
              href={getLink(notif.type)}
              on:click={() => markAsRead(notif.id, notif.isRead)}
              class="flex items-start gap-2.5 px-4 py-3 border-b border-black/5 dark:border-white/5 last:border-b-0 hover:bg-nested transition-colors group {notif.isRead ? '' : 'bg-primary/5'}"
            >
              <div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[15px]">{getIcon(notif.type)}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] {notif.isRead ? 'font-medium text-secondary' : 'font-semibold text-main'} leading-tight">{notif.title}</p>
                <p class="text-[11.5px] leading-[1.4] {notif.isRead ? 'text-muted' : 'text-secondary'} line-clamp-2 mt-0.5">{notif.message}</p>
                <p class="text-3xs text-muted mt-1 opacity-60">
                  {new Date(notif.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {#if !notif.isRead}
                <div class="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0 mt-1.5 shadow-sm"></div>
              {/if}
              <button 
                type="button" 
                class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-7 h-7 rounded-md hover:bg-error/10 text-muted hover:text-error shrink-0"
                on:click|preventDefault|stopPropagation={() => deleteNotification(notif.id)}
                title="Hapus notifikasi"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </a>
          {/each}
        {/if}
      </div>
      
      <!-- Footer -->
      <div class="p-4 border-t border-light flex items-center justify-center bg-card">
        <button 
          on:click={markAllAsRead}
          class="text-sm font-medium text-muted hover:text-main transition-colors {unreadCount === 0 ? 'opacity-50 cursor-not-allowed' : 'underline underline-offset-4 decoration-muted/40 hover:decoration-main'}"
          disabled={unreadCount === 0}
        >
          Tandai semua dibaca
        </button>
      </div>
    </div>
    
    <!-- Backdrop for mobile/clicking outside -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div 
      class="fixed inset-0 z-40 bg-transparent" 
      on:click={closeDropdown}
    ></div>
  {/if}
</div>

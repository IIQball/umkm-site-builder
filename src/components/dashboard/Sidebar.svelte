<script lang="ts">
  import { signOutAndRedirect } from '@/lib/auth-client';
  import type { AuthenticatedUser } from '@/lib/auth';
  import { onMount } from 'svelte';
  import { getNavGroups } from './sidebar/sidebar.helpers';
  import SidebarDesktop from './sidebar/SidebarDesktop.svelte';
  import SidebarMobile from './sidebar/SidebarMobile.svelte';

  export let userJson: string;
  export let currentPath = '';

  const user: AuthenticatedUser = JSON.parse(userJson);
  const navGroups = getNavGroups(user.role);

  let collapsed = false;
  let drawerOpen = false;
  let isLoggingOut = false;

  onMount(() => {
    collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (!currentPath && typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }
  });

  const toggleCollapse = () => {
    collapsed = !collapsed;
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  };

  const openDrawer = () => { drawerOpen = true; };
  const closeDrawer = () => { drawerOpen = false; };

  const handleSignOut = async () => {
    isLoggingOut = true;
    await signOutAndRedirect();
  };
</script>

<SidebarDesktop
  {user}
  {navGroups}
  {collapsed}
  {currentPath}
  on:toggleCollapse={toggleCollapse}
  on:signOut={handleSignOut}
/>

<SidebarMobile
  {user}
  {navGroups}
  {drawerOpen}
  {currentPath}
  {isLoggingOut}
  on:openDrawer={openDrawer}
  on:closeDrawer={closeDrawer}
  on:signOut={handleSignOut}
/>

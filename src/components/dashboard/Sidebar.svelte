<script lang="ts">
  import { signOut } from '@/lib/auth-client';
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
    await signOut();
    window.location.href = '/auth/login';
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
  on:openDrawer={openDrawer}
  on:closeDrawer={closeDrawer}
  on:signOut={handleSignOut}
/>

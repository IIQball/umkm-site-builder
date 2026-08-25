<script lang="ts">
  import { signOut } from '@/lib/auth-client';
  import type { AuthenticatedUser } from '@/lib/auth';
  import { onMount } from 'svelte';
  import { getNavItems } from './sidebar/sidebar.helpers';
  import SidebarDesktop from './sidebar/SidebarDesktop.svelte';
  import SidebarMobile from './sidebar/SidebarMobile.svelte';

  export let userJson: string;

  const user: AuthenticatedUser = JSON.parse(userJson);
  const navItems = getNavItems(user.role);
  
  const generalItems = navItems.filter((i) => i.group === 'GENERAL');
  const accountItems = navItems.filter((i) => i.group === 'ACCOUNT');
  const flatItems    = navItems.filter((i) => !i.group);

  let collapsed = false;
  let drawerOpen = false;
  let currentPath = '';

  onMount(() => {
    collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    currentPath = window.location.pathname;
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
  {generalItems}
  {accountItems}
  {flatItems}
  {collapsed}
  {currentPath}
  on:toggleCollapse={toggleCollapse}
  on:signOut={handleSignOut}
/>

<SidebarMobile
  {user}
  {generalItems}
  {accountItems}
  {flatItems}
  {drawerOpen}
  {currentPath}
  on:openDrawer={openDrawer}
  on:closeDrawer={closeDrawer}
  on:signOut={handleSignOut}
/>

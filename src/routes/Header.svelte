<script>
    import { 
      
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    HeaderUtilities,
    HeaderGlobalAction,
    
      
     } from "carbon-components-svelte";

     import Logout from "carbon-icons-svelte/lib/Logout.svelte";
     import { navigate } from "svelte-routing";
     import { adminStore } from './Stores/adminStore';
     import { userStore } from './Stores/userStore';
     import { eventStore } from './Stores/eventStore';
     import { tableSettingsStore } from './Stores/tableSettingsStore';
     import { onMount } from "svelte";

  import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";
  import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
  export let UserStatus;


    import { supabase } from './supabase'
  
    // export let User = 'unnown';

    let isSideNavOpen = false;

    $: userEmail = $userStore.user?.email || 'Загрузка...';
    $: isAdmin = $adminStore.isAdmin;

    // $: UserStatus = isAdmin ? 'Admin' : 'Manager';

    // $: isLoading = $adminStore.isLoading;

    $: {
      UserStatus = $adminStore.isAdmin ? 'Admin' : 'Manager';
        console.log('Status updated:', UserStatus);
    }

//     onMount(async () => {
//     try {
//         // Сначала проверяем пользователя
//         await userStore.checkAndSetUser();
//         // Потом проверяем статус админа
//         await adminStore.checkAdminStatus();
        
//         console.log('After all checks - UserStatus:', UserStatus);
//     } catch (error) {
//         console.error('Error during initialization:', error);
//     }
// });


    
console.log('currentUser в хедере',userEmail);

  // // Функция для выхода из системы
  // async function handleLogout() {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.error('Error signing out:', error);
  //   } else {
  //     eventStore.clearEvents; 
  //     userStore.setUser(null);// Очистка eventStore
  //     adminStore.reset();

  //     // Перенаправляем пользователя на главную страницу после выхода
  //     navigate('/');
  //   }
  // }


  async function handleLogout() {
  try {
    // Очищаем localStorage вручную
    localStorage.removeItem('sb-irjkppabtcmhrxvtkkyy-auth-token');

    // Пытаемся выйти через Supabase (на случай, если сессия всё ещё активна)
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Error during signOut (ignoring):', error);
    }

    // Очищаем состояние приложения
    eventStore.clearEvents();
    userStore.setUser(null);
    adminStore.reset();

    // Перенаправляем пользователя на главную страницу
    navigate('/');
  } catch (err) {
    console.error('Error during forced logout:', err);
  }
}
   





  function toggleTableSettings() {
        tableSettingsStore.update(state => ({
            ...state,
            showColumnSelector: !state.showColumnSelector
        }));
    }


</script>

<Header company="БИК>" platformName="CRM" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderNav>
    <HeaderNavItem text={userEmail} />
    <HeaderNavItem  text={UserStatus} />
    <!-- <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu> -->
  </HeaderNav>

  <HeaderUtilities>

    <HeaderGlobalAction
    iconDescription="Settings"
    tooltipAlignment="start"
    icon={SettingsAdjust}
    on:click={toggleTableSettings}
  />

    <HeaderGlobalAction iconDescription={UserStatus} 
    title="Notifications"
    aria-label="Notifications"
    icon={UserAvatarFilledAlt} 
    >
    
  </HeaderGlobalAction>


    <HeaderGlobalAction
      iconDescription="Log out"
      tooltipAlignment="end"
      icon={Logout}
      on:click={handleLogout}
    />


  
    
  </HeaderUtilities>

</Header>

<Content>
  <Grid>
    <Row>
      <Column>
        <h2>Мои клиенты</h2>
     
      </Column>
    </Row>
  </Grid>
</Content>

<style>
  
  :global(.bx--header) {
    background-color: #212533!important;
    border-bottom: 1px solid #303f9f;
  }
  
  </style>


  
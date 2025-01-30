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


  import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";
  import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
  export let UserStatus;


    import { supabase } from './supabase'
  
    // export let User = 'unnown';

    let isSideNavOpen = false;

    $: currentUser = $userStore.user;
    $: isAdmin = $adminStore.isAdmin;

    $: UserStatus = isAdmin ? 'Admin' : 'Manager';
    
console.log('currentUser в хедере',currentUser);

  // Функция для выхода из системы
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      eventStore.clearEvents; // Очистка eventStore
      // Перенаправляем пользователя на главную страницу после выхода
      navigate('/');
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
    <HeaderNavItem text={currentUser.email} />
    <HeaderNavItem  text={UserStatus} />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
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
    <span> Привет</span>
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
  


  
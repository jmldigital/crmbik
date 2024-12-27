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

  import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";

  export let UserStatus;


    import { supabase } from '../lib/supabase'
  
    // export let User = 'unnown';

    let isSideNavOpen = false;


  // Функция для выхода из системы
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      // Перенаправляем пользователя на главную страницу после выхода
      navigate('/');
    }
  }


</script>

<Header company="БИК>" platformName="CRM" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
  <HeaderNav>
    <HeaderNavItem href="/" text="Link 1" />
    <HeaderNavItem href="/" text="Link 2" />
    <HeaderNavItem href="/" text="Link 3" />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
  </HeaderNav>

  <HeaderUtilities>

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
  


  
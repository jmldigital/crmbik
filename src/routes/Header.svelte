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

  import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";

  export let UserStatus;


    import { supabase } from '../lib/supabase'
  
    // export let User = 'unnown';

    let isSideNavOpen = false;
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
      href="/"
    />
  </HeaderUtilities>

</Header>

<Content>
  <Grid>
    <Row>
      <Column>
        <h1>Welcome</h1>
      </Column>
    </Row>
  </Grid>
</Content>
  


  
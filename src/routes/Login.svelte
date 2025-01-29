<script>
  import { navigate } from "svelte-routing";
  import { supabase } from '../lib/supabase';
  import { onMount, onDestroy } from 'svelte';
  import { 
    Form, 
    TextInput, 
    Button, 
    InlineNotification,
    Grid,
    Row,
    Column,
    PasswordInput
  } from "carbon-components-svelte";


  import { adminStore } from './adminStore';
  
  let email = '';
  let password = 'aasas';
  let errorMessage = '';
  let loading = false;

  // console.log('Component initialized');

  // await adminStore.checkAdminStatus(); // Дождитесь проверки админа
  

  onMount(() => {
    console.log('Login component mounted');
    return () => {
      console.log('Login component cleanup');
    };


  });

  onDestroy(() => {
    console.log('Login component destroyed');
  });

  $: {
    console.log('Values changed:', { email, password });
  }

  async function handleSubmit(e) {
    console.log('Form submitted');
    e.preventDefault();
    
    try {
      loading = true;
      errorMessage = '';
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log('Login successful');
      navigate('/clients');
      
    } catch (error) {
      console.error('Login error:', error);
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }


  function goToReg() {
    navigate('/register');
  }
</script>

<Grid>
  <Row>
    <Column>
      <h1>Вход в систему</h1>
      
      {#if errorMessage}
        <InlineNotification
          kind="error"
          title="Ошибка!"
          subtitle={errorMessage}
        />
      {/if}
      
      <Form on:submit={handleSubmit}>
        <TextInput
          labelText="Email"
          placeholder="Введите ваш email"
          type="email"
          bind:value={email}
          required
        />
        
        <PasswordInput
          labelText="Пароль"
          placeholder="Введите пароль"
          type="password"
          bind:value={password}
          required
        />
        
        <Button 
          type="submit"
          loading={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
        <Button 
          kind="tertiary"
          on:click={goToReg}
        >
          Регистрация нового пользователя
        </Button>
      </Form>
    </Column>
  </Row>
</Grid>
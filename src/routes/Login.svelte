<script>
  import { navigate } from "svelte-routing";
  import { supabase } from './supabase';
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
  import { userStore } from './Stores/userStore';
  import { adminStore } from './Stores/adminStore';
  
  let email = '';
  let password = '';
  let errorMessage = '';
  let loading = false;

  onMount(async () => {
    // Проверяем существующую сессию
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      userStore.setUser(session.user);
      navigate('/clients');
    }
  });

  async function handleSubmit(e) {
    console.log('Form submitted');
    e.preventDefault();
    
    try {
      loading = true;
      errorMessage = '';
      userStore.setLoading(true);
      
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Сохраняем пользователя в store
       userStore.setUser(user);
      
      // // Проверяем статус админа
         await adminStore.checkAdminStatus();
      
      console.log('Login successful');
      navigate('/clients');
      
    } catch (error) {
      console.error('Login error:', error);
      errorMessage = error.message;
      userStore.setError(error.message);
    } finally {
      loading = false;
      userStore.setLoading(false);
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
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
        <Button 
           kind="secondary"
          on:click={goToReg}
          disabled={loading}
        >
          Регистрация нового пользователя
        </Button>
      </Form>
    </Column>
  </Row>
</Grid>
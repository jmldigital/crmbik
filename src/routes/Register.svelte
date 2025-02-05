<script>
  import { onMount } from 'svelte';
  import { navigate } from "svelte-routing";
  import { supabase } from './supabase';
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

  let email = '';
  let firstName = '';
  let lastName = '';
  let password = '';
  let confirmPassword = '';
  let message = '';
  let isLoading = false;

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/clients');
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      message = 'Пароли не совпадают. Попробуйте снова.';
      return;
    }

    try {
      isLoading = true;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://your-app-url.com/clients',
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) throw error;

      const userId = data.user.id;

      const { error: insertError } = await supabase
        .from('managers')
        .insert([{ 
          id: userId, 
          email, 
          manager_first_name: firstName, 
          manager_last_name: lastName 
        }]);

      if (insertError) throw insertError;

      message = 'Регистрация прошла успешно. Проверьте вашу почту для подтверждения регистрации.';
      goToLogin();
    } catch (error) {
      message = `Ошибка: ${error.message}`;
    } finally {
      isLoading = false;
    }
  }

  function goToLogin() {
    navigate('/login');
  }
</script>

<Grid>
  <Row>
    <Column>
      <h1>Регистрация</h1>

      <Form on:submit={handleSubmit}>
        <TextInput
          labelText="Email"
          placeholder="Введите ваш email"
          type="email"
          bind:value={email}
          required
        />

        <TextInput
          labelText="Имя"
          placeholder="Введите ваше имя"
          bind:value={firstName}
          required
        />

        <TextInput
          labelText="Фамилия"
          placeholder="Введите вашу фамилию"
          bind:value={lastName}
          required
        />

        <PasswordInput
          labelText="Пароль"
          placeholder="Введите пароль"
          type="password"
          bind:value={password}
          required
        />

        <PasswordInput
          labelText="Подтверждение пароля"
          placeholder="Повторите пароль"
          type="password"
          bind:value={confirmPassword}
          required
        />

        <Button 
          type="submit" 
         
        >
          Зарегистрироваться
        </Button>

        <Button 
          kind="tertiary"
          on:click={goToLogin}
        >
          Войти
        </Button>
      </Form>

      {#if message}
        <InlineNotification
          kind={message.includes('успешно') ? 'success' : 'error'}
          title={message.includes('успешно') ? 'Успех!' : 'Ошибка!'}
          subtitle={message}
        />
      {/if}
    </Column>
  </Row>
</Grid>
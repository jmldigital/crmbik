<script>
  import { navigate } from "svelte-routing";
  import { supabase } from "./supabase";
  import { onMount, onDestroy } from "svelte";
  import {
    Form,
    TextInput,
    Button,
    InlineNotification,
    Grid,
    Row,
    Column,
    PasswordInput,
  } from "carbon-components-svelte";
  import { userStore } from "./Stores/userStore";
  import { adminStore } from "./Stores/adminStore";

  let email = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  onMount(async () => {
    try {
      // Проверяем существующую сессию
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return;
      }

      if (session?.user) {
        // Логируем информацию о времени входа
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        
        console.log('====================================');
        console.log(`Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${formattedDate}`);
        console.log("Current User's Login: jmldigital");
        console.log('Session User:', session.user.email);
        console.log('====================================');

        // Проверяем время последнего входа
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        const currentTime = new Date().getTime();

        if (lastLoginTime) {
          const timeDiff = currentTime - parseInt(lastLoginTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // Если прошло больше 24 часов, делаем повторную аутентификацию
          if (hoursDiff > 24) {
            console.log('Session expired, requiring re-authentication');
            await supabase.auth.signOut();
            userStore.setUser(null);
            return;
          }
        }

        // Обновляем время последнего входа
        localStorage.setItem('lastLoginTime', currentTime.toString());

        // Устанавливаем пользователя и перенаправляем
        userStore.setUser(session.user);
        navigate("/clients");
      }
    } catch (error) {
      console.error('Unexpected error during session check:', error);
    }
  });


    // Добавьте обработчик событий аутентификации
    onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        
        console.log('====================================');
        console.log(`Auth State Change - Sign In`);
        console.log(`Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): ${formattedDate}`);
        console.log("Current User's Login: jmldigital");
        console.log('====================================');
      }
    });

    // Очистка подписки при размонтировании компонента
    return () => {
      subscription.unsubscribe();
    };
  });

  async function handleSubmit(e) {
    console.log("Form submitted");
    e.preventDefault();

    try {
      loading = true;
      errorMessage = "";
      userStore.setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Сохраняем пользователя в store
      userStore.setUser(user);

      // Проверяем статус админа
      await adminStore.checkAdminStatus();

      console.log("Login successful");
      navigate("/clients");
    } catch (error) {
      console.error("Login error:", error);
      errorMessage = error.message;
      userStore.setError(error.message);
    } finally {
      loading = false;
      userStore.setLoading(false);
    }
  }

  function goToReg() {
    navigate("/register");
  }

  function goToReset() {
    navigate("/reset");
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

        <Button type="submit" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </Button>
        <Button kind="secondary" on:click={goToReg} disabled={loading}>
          Зарегистрироваться
        </Button>
        
      </Form>
    </Column>
   
  </Row>
  <Button kind="ghost" on:click={goToReset} disabled={loading}>
    забыл пароль
  </Button>
</Grid>

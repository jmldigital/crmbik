<script>
    import { TextInput, Button, Form } from 'carbon-components-svelte';
    import { supabase } from './supabase';
    import { navigate } from 'svelte-routing';
  
    let email = '';
    let password = '';
    let first_name = '';
    let last_name = '';
    let isRegistering = false;
    let errorMessage = '';
    let loading = false;
  
    async function handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      if (form && form.checkValidity()) {
        if (isRegistering) {
          await registerManager();
        } else {
          await loginManager();
        }
      } else {
        alert('Пожалуйста, заполните все обязательные поля');
      }
    }
  
    async function registerManager() {
      try {
        loading = true;
        errorMessage = '';
  
        const { user, error } = await supabase.auth.signUp({
          email,
          password
        });
  
        if (error) throw error;
  
        // Добавление информации о менеджере в таблицу managers
        const { data, error: insertError } = await supabase
          .from('managers')
          .insert([{ id: user.id, email, first_name, last_name }]);
  
        if (insertError) throw insertError;
  
        alert('Менеджер успешно зарегистрирован');
        navigate('/clients');
      } catch (error) {
        console.error('Registration error:', error);
        errorMessage = error.message;
      } finally {
        loading = false;
      }
    }
  
    async function loginManager() {
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
  </script>
  
  <div class="auth-container">
    <div class="auth-box">
      <h1>{isRegistering ? 'Регистрация' : 'Вход в систему'}</h1>
  
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
  
      <Form id='auth-form' on:submit={handleSubmit}>
        <TextInput
          type="email"
          placeholder="Email"
          bind:value={email}
          required
        />
        <TextInput
          type="password"
          placeholder="Пароль"
          bind:value={password}
          required
        />
        {#if isRegistering}
          <TextInput
            type="text"
            placeholder="Имя"
            bind:value={first_name}
            required
          />
          <TextInput
            type="text"
            placeholder="Фамилия"
            bind:value={last_name}
            required
          />
        {/if}
        <Button type="submit" disabled={loading}>
          {#if loading}
            {isRegistering ? 'Регистрация...' : 'Вход...'}
          {:else}
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          {/if}
        </Button>
      </Form>
  
      <Button kind="secondary" on:click={() => isRegistering = !isRegistering}>
        {isRegistering ? 'Уже есть аккаунт? Войти' : 'Создать новый аккаунт'}
      </Button>
    </div>
  </div>
  
  <style>
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  
    .auth-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
  
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }
  
    .form-group {
      margin-bottom: 1.5rem;
    }
  
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }
  
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  
    input:focus {
      border-color: #4CAF50;
      outline: none;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }
  
    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
  
    button:hover:not(:disabled) {
      background-color: #45a049;
    }
  
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  
    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }
  </style>
  
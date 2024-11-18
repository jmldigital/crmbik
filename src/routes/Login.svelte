<script>
    import { navigate } from "svelte-routing";
    import { supabase } from '../lib/supabase';
    import { onMount, onDestroy } from 'svelte';
    
    let email = '';
    let password = 'aasas';
    let errorMessage = '';
    let loading = false;

    // Добавляем больше логов
    console.log('Component initialized');

    onMount(() => {
      console.log('Login component mounted');
      return () => {
        console.log('Login component cleanup');
      };
    });

    onDestroy(() => {
      console.log('Login component destroyed');
    });

    // Добавим лог для отслеживания изменений
    $: {
      console.log('Values changed:', { email, password });
    }

    function handleSubmit(e) {
      console.log('Form submitted');
      e.preventDefault();
      handleLogin();
    }
  
    async function handleLogin() {
      console.log('Starting login process');
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
  
  <div class="login-container">
    <div class="login-box">
      <h1>Вход в систему</h1>
      
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}
      
      <!-- Используем обычный атрибут onsubmit вместо on:submit -->
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
          type="email" 
          id="email" 
          bind:value={email} 
          required
        />
        </div>
        
        <div class="form-group">
          <label for="password">Пароль:</label>
          <input 
          type="password" 
          id="password" 
          bind:value={password} 
          required
        />
        </div>
        
        <button type="submit" disabled={loading}>
          {#if loading}
            Вход...
          {:else}
            Войти
          {/if}
        </button>
      </form>
    </div>
  </div>
  
  <style>
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-box {
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
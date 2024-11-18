
<script>
  import { onMount } from 'svelte'
  import { supabase } from '../lib/supabase'
  
  let clients = []
  let newClient = {
    first_name: '',
    last_name: '',
    phone: '',
    source: '',
    email: '',
    status: 'Новый'
  }
  let isEditing = false
  let editingClient = null
  
  onMount(async () => {
    await loadClients()
  })
  
  async function loadClients() {
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('manager_id', userData.user.id)
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    clients = data
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (e.target.checkValidity()) {
      addClient();
    } else {
      // Просто показываем сообщение об ошибке, не очищаем форму
      alert('Пожалуйста, заполните все обязательные поля');
    }
  }

  
  
  async function addClient() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error: addError } = await supabase
        .from('clients')
        .insert([{ ...newClient, manager_id: userData.user.id }])
        .select();
      
      if (addError) throw addError;
      
      clients = [data[0], ...clients];
      
      // Очищаем форму ТОЛЬКО после успешного добавления
      newClient = {
        first_name: '',
        last_name: '',
        phone: '',
        source: '',
        email: '',
        status: 'Новый'
      };

      alert('Клиент успешно добавлен');
      
    } catch (err) {
      alert(err.message);
      error = err.message;
      // При ошибке значения тоже сохраняются
    }
  }
  
  function startEdit(client) {
    isEditing = true
    editingClient = { ...client }
  }
  
  async function saveEdit() {
    const { error } = await supabase
      .from('clients')
      .update(editingClient)
      .eq('id', editingClient.id)
    
    if (error) {
      console.error('Error:', error)
      return
    }
    
    isEditing = false
    editingClient = null
    await loadClients()
  }
</script>

<div class="clients-container">
  <h1>Клиенты</h1>
  
  <!-- Форма добавления нового клиента -->

  <form onsubmit={handleSubmit}>

  <div class="add-client-form">
    <h2>Добавить нового клиента</h2>
    <div class="form-group">
      <input 
        type="text" 
        placeholder="Имя" 
        value={newClient.first_name}
        onchange={(e) => newClient.first_name = e.target.value}
        required
      />
      <input 
        type="text" 
        placeholder="Фамилия" 
        value={newClient.last_name}
        onchange={(e) => newClient.last_name = e.target.value}
        
      />
      <input 
        type="tel" 
        placeholder="Телефон" 
        value={newClient.phone}
        onchange={(e) => newClient.phone = e.target.value}
      />
      <input 
        type="text" 
        placeholder="Источник" 
        value={newClient.source}
        onchange={(e) => newClient.source = e.target.value}
        required
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={newClient.email}
        onchange={(e) => newClient.email = e.target.value}
      />
      <select 
      id="status"
      value={newClient.status}
      onchange={(e) => newClient.status = e.target.value}
    >
      <option value="Новый">Новый</option>
      <option value="В работе">В работе</option>
      <option value="Завершен">Завершен</option>
    </select>
    <button type="submit">Добавить клиента</button>
    </div>
  </div>

  </form>

  <!-- Таблица клиентов -->
  <table>
    <thead>
      <tr>
        <th>Имя</th>
        <th>Фамилия</th>
        <th>Телефон</th>
        <th>Источник</th>
        <th>Email</th>
        <th>Статус</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      {#each clients as client}
        <tr>
          <td>{client.first_name}</td>
          <td>{client.last_name}</td>
          <td>{client.phone}</td>
          <td>{client.source}</td>
          <td>{client.email}</td>
          <td>{client.status}</td>
          <td>
            <button onclick={() => startEdit(client)}>
              Редактировать
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  
  <!-- Модальное окно редактирования -->
  {#if isEditing}
    <div class="modal">
      <div class="modal-content">
        <h2>Редактировать клиента</h2>
        <input 
          type="text" 
          bind:value={editingClient.first_name}
        />
        <input 
          type="text" 
          bind:value={editingClient.last_name}
        />
        <input 
          type="tel" 
          bind:value={editingClient.phone}
        />
        <input 
          type="text" 
          bind:value={editingClient.source}
        />
        <input 
          type="email" 
          bind:value={editingClient.email}
        />
        <select bind:value={editingClient.status}>
          <option value="Новый">Новый</option>
          <option value="В работе">В работе</option>
          <option value="Завершен">Завершен</option>
        </select>
        <div class="modal-buttons">
          <button onclick={saveEdit}>Сохранить</button>
          <button onclick={() => {
            isEditing = false
            editingClient = null
          }}>Отмена</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .clients-container {
    padding: 2rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
  
  .add-client-form {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .form-group {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  input, select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
</style>

<script>
  import { onMount } from 'svelte'
  import { supabase } from '../lib/supabase'


  import { Select, SelectItem,TextInput,Button,Link,DataTable } from "carbon-components-svelte";
  import Edit16 from "carbon-icons-svelte/lib/Edit.svelte";
 
  
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
    console.log(clients);
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
      <TextInput 
        type="text" 
        placeholder="Имя" 
        value={newClient.first_name}
        onchange={(e) => newClient.first_name = e.target.value}
        required
      />
      <TextInput 
        type="text" 
        placeholder="Фамилия" 
        value={newClient.last_name}
        onchange={(e) => newClient.last_name = e.target.value}
        
      />
      <TextInput 
        type="tel" 
        placeholder="Телефон" 
        value={newClient.phone}
        onchange={(e) => newClient.phone = e.target.value}
      />
      <TextInput 
        type="text" 
        placeholder="Источник" 
        value={newClient.source}
        onchange={(e) => newClient.source = e.target.value}
        required
      />
      <TextInput 
        type="email" 
        placeholder="Email" 
        value={newClient.email}
        onchange={(e) => newClient.email = e.target.value}
      />
      <Select 
      id="status"
      value={newClient.status}
      onchange={(e) => newClient.status = e.target.value}
    >
      <option value="Новый">Новый</option>
      <option value="В работе">В работе</option>
      <option value="Завершен">Завершен</option>
    </Select>
    <Button type="submit">Добавить клиента</Button>
    </div>
  </div>

  </form>



  <DataTable
  headers={[
    { key: 'first_name', value: 'Имя' },
    { key: 'last_name', value: 'Фамилия' },
    { key: 'phone', value: 'Телефон' },
    { key: 'source', value: 'Источник' },
    { key: 'email', value: 'Email' },
    { key: 'status', value: 'Статус' },
    { key: 'actions', value: 'Действия' },
  ]}
  
  rows={clients}
  >

   <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === 'actions'}
      <Button
        kind="ghost"
        icon={Edit16}
        on:click={() => startEdit(row)}
      >
        Редактировать
      </Button>
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>


</DataTable>

  
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
          <Button onclick={saveEdit}>Сохранить</Button>
          <Button onclick={() => {
            isEditing = false
            editingClient = null
          }}>Отмена</Button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .clients-container {
    padding: 2rem;
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
  
 
  
 
  
 
</style>
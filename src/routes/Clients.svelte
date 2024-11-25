
<script>
  import { onMount } from 'svelte'
  import { supabase } from '../lib/supabase'
  import AddClientModal from './AddClientModal.svelte';

  import { Select, SelectItem,TextInput,Button,Link,DataTable,Modal,Tag, Form } from "carbon-components-svelte";
  import Edit16 from "carbon-icons-svelte/lib/Edit.svelte";

  let open = false;
  let openAdd = false;
  
  let clients = []

    // Загрузить события для клиента
    let  clientEvents = []


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
    // await loadAllEvents();
  })


  function isAdmin(user) {
   return user?.app_metadata?.role === 'admin';
}
let is_Admin = false
  
  // Функция загрузки клиентов
  async function loadClients() {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Authentication error:', authError);
      return;
    }

    let query = supabase.from('clients').select('*');

    if (isAdmin(userData.user)) {
      console.log('пользователь admin');
      is_Admin = true;
      // Загрузка всех клиентов для администратора
      const { data, error } = await supabase.rpc('get_all_clients');
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }
      clients = data;
    } else {
      console.log('пользователь менеджер');
      // Загрузка клиентов только для текущего менеджера
      query = query.eq('manager_id', userData.user.id);
      const { data, error } = await query;
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }
      clients = data;
    }

    console.log('Clients loaded:', clients);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}


  async function loadEventsForClient(clientId) {

if (is_Admin) {
  console.log('пользователь admin');
      // Загрузка всех клиентов для администратора
  const { data, error } = await supabase.rpc('get_all_client_events').eq('client_id', clientId);
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }

  return data
  
} else {

  console.log('пользователь менеджер');

    const { data, error } = await supabase
     .from('client_events')
     .select('*')
     .eq('client_id', clientId)

     return data
}


  }


async function loadAllEvents() {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Authentication error:', authError);
      return [];
    }

    const { data, error } = await supabase
      .from('client_events')
      .select('*');

    if (error) {
      console.error('Error loading events:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}



  
  async function startEdit(client) {
    isEditing = true
    editingClient = { ...client }
    open = true

      // Загрузить события для клиента
     clientEvents = await loadEventsForClient(client.id)
     console.log('clientEventsыыыыыыыы',clientEvents)

    // clientEvents = await loadAllEvents();
    // console.log('clientEventsssssss:', clientEvents);

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

  function stopEdit() {
    isEditing = false
    open = false
    editingClient = null
  }

 

  function getTagType(status) {
    switch (status) {
      case 'Новый':
        return 'green';
      case 'В работе':
        return 'blue';
      case 'Завершен':
        return 'red';
      default:
        return 'gray';
    }
  }


  function openAddModal() {
    openAdd = true;
  }

  
</script>



<!-- Добавление нового клиента -->

<Button
kind="ghost"
icon={Edit16}
on:click={openAddModal}
>
Добавить клиента
</Button>


<AddClientModal
  bind:open={openAdd}
  bind:clients={clients}
  bind:newClient={newClient}
/>

<!--  -->



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
    {:else if cell.key === 'status'}
    <Tag type={getTagType(cell.value)}>{cell.value}</Tag>
    {:else}
      {cell.value}
    {/if}

   

  </svelte:fragment>


</DataTable>


<!-- Модальное окно редактирования -->
{#if isEditing} 



<Modal
  bind:open
  modalHeading="Редактировать клиента"
  primaryButtonText="Сохранить"
  secondaryButtonText="Отменить"
  on:click:button--secondary={stopEdit}
  on:open
  on:close
  on:submit={saveEdit}
>


    <TextInput 
      type="text" 
      bind:value={editingClient.first_name}
    />
    <TextInput 
      type="text" 
      bind:value={editingClient.last_name}
    />
    <TextInput 
      type="tel" 
      bind:value={editingClient.phone}
    />
    <TextInput 
      type="text" 
      bind:value={editingClient.source}
    />
    <TextInput
      type="email" 
      bind:value={editingClient.email}
    />
    <Select 
    bind:selected={editingClient.status}
    on:change={(e) => editingClient.status = e.target.value}
    >
    <SelectItem value="Новый" text="Новый" />
    <SelectItem value="В работе" text="В работе" />
    <SelectItem value="Завершен" text="Завершен" />
    </Select>
    
    <!-- bind:value={editingClient.status} -->


      <!-- <Button onclick={saveEdit}>Сохранить</Button>
      <Button onclick={() => {
        isEditing = false
        editingClient = null
      }}>Отмена</Button> -->
    <!-- Отображение событий -->

    <h3>События</h3>
    {#if clientEvents.length > 0}
      <ul>
        {#each clientEvents as event}
          <li>{event.event_type} - {event.event_date}</li>
        {/each}
      </ul>
    {:else}
      <p>Нет событий для этого клиента.</p>
    {/if}

  </Modal>


  {/if} 







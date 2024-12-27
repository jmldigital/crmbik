
<script>
  import { onMount } from 'svelte'
  import { supabase } from '../lib/supabase'

  import AddClientModal from './AddClientModal.svelte';
  import AddClientEventsModal from './AddClientEventsModal.svelte';
  import ClientTable from './ClientTable.svelte';
  import EditClientModal from './EditClientModal.svelte';

  import Header from './Header.svelte';

  import { Select, SelectItem,TextInput,Button,Link,DataTable,Modal,Tag, Form } from "carbon-components-svelte";
  import Edit16 from "carbon-icons-svelte/lib/Edit.svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";

  let open = false;
  let openAdd = false;
  let openAddEvent = false;
  let User = 'Unown';
  
  let clients = []

  // Загрузить события для клиента
  let clientEvents = []


  let newClientEvent = {
      // event_type: '',
      // description: '',
      // status:''
    }


  let newClient = {
    // first_name: '',
    // last_name: '',
    // object:'',
    // phone: '',
    // source: '',
    // email: '',
    // status: 'Новый'
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

// Получаем имя и фамилию менеджера для клиента
async function getManagerEmail(managerId) {
  const { data, error } = await supabase
    .from('managers')
    .select('manager_first_name, manager_last_name')
    .eq('id', managerId)
    .single();

  if (error) {
    console.error('Error fetching manager name:', error);
    return null;
  }

  // Объединяем имя и фамилию в одну строку
  return `${data.manager_first_name} ${data.manager_last_name}`;
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
            User = "Admin"
      
      is_Admin = true;
      // Загрузка всех клиентов для администратора
      const { data, error } = await supabase.rpc('get_all_clients');
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }
      clients = data;

          // Добавление email менеджеров к каждому клиенту
    clients = await Promise.all(clients.map(async (client) => {
      const managerName = await getManagerEmail(client.manager_id);
      return { ...client, Manager: managerName };
    }));
      
    } else {
            User = "Менеджер"

      // Загрузка клиентов только для текущего менеджера
      query = query.eq('manager_id', userData.user.id);
      const { data, error } = await query;
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }
      clients = data;
    }

    console.log('clients', clients);



    console.log('Clients loaded:', clients);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}


// Функция для преобразования даты в понятный для человека формат
function formatDateToHumanReadable(isoDate) {
  const date = new Date(isoDate);

  // Форматируем дату в виде YYYY-MM-DD
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Форматируем время в виде HH:MM:SS
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Возвращаем отформатированную дату и время
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



  async function loadEventsForClient(clientId) {

if (is_Admin) {
 
      // Загрузка всех клиентов для администратора
  const { data, error } = await supabase.rpc('get_all_client_events').eq('client_id', clientId);
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }
      clientEvents = data.map(event => ({
      ...event,
      created_at: formatDateToHumanReadable(event.created_at)
    }));
  
} else {
    const { data, error } = await supabase
      .from('client_events')
      .select('*')
      .eq('client_id', clientId);
    if (error) {
      console.error('Error loading client events:', error);
      return;
    }
    clientEvents = data.map(event => ({
      ...event,
      created_at: formatDateToHumanReadable(event.created_at)
    }));
  }

  return clientEvents;
}



  
  async function startEdit(client) {
    isEditing = true
    editingClient = { ...client }
    open = true

      // Загрузить события для клиента
     clientEvents = await loadEventsForClient(client.id)
     console.log('имя редактируемого клиента',editingClient.first_name)

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

 

  function openAddModal() {
    openAdd = true;
  }


  function openAddEventModal() {
    openAddEvent = true;
    openAdd = false;

    isEditing=false;
    // console.log('id редактируемог оклиента ',editingClient.id)
  }


</script>

<Header UserStatus={User}></Header>

<!-- Добавление нового клиента -->
<!-- <Button icon={Add} on:click={openAddModal} > -->
  <Button size="field" kind="ghost" >Добавить клиента</Button> <Button size="field" iconDescription="Tooltip text" icon={Add} on:click={openAddModal} />

<AddClientModal
  bind:open={openAdd}
  bind:clients={clients}
  bind:newClient={newClient}
/>

<!--  -->


<AddClientEventsModal
  bind:open={openAddEvent}
  bind:client_events={clientEvents}
  bind:newClientEvent={newClientEvent}
  bind:editingClientForEvents={editingClient}
/>

<!--  -->


<ClientTable
  bind:clients={clients}
  startEdit={startEdit}
  Admin={is_Admin}
/>



<!-- Модальное окно редактирования -->
{#if isEditing} 


<EditClientModal
bind:open={open}
bind:editingClient={editingClient}
bind:clientEvents={clientEvents}
saveEdit={saveEdit}
stopEdit={stopEdit}
openAddEventModal={openAddEventModal}
/>


  {/if} 







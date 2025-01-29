<!-- ClientManager.svelte -->
<script>
    import ClientForm from './ClientFormNew.svelte';
    import ClientList from './ClientList.svelte';

    import ClientActions from './Actions.svelte';
    import Header from "./Header.svelte";

    import { Modal } from 'carbon-components-svelte';
    import { supabase } from '../lib/supabase';
    import { clientStore } from './clientStore';
    import { onMount } from 'svelte';

    // Состояния
    let clients = [];
    let isModalOpen = false;
    let isEditing = false;
    // let currentClient = null;
    
    let User = "Unown";


    let currentClient = {
        first_name: "",
        last_name: "",
        object: "",
        phone: "",
        source: "",
        email: "",
        status: "Новый"
    };


    onMount(() => {
    loadClients();
});

    // Загрузка клиентов при инициализации
    // async function loadClients() {
    //   const { data, error } = await supabase
    //     .from('clients')
    //     .select('*')
    //     .order('created_at', { ascending: false });
      
    //   if (error) {
    //     console.error('Error loading clients:', error);
    //     return;
    //   }
      
    //   clients = data;
    // }


    async function isAdmin(user) {
    const { data, error } = await supabase.rpc("is_admin");
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    return data;
  }

  let is_Admin = false;


    // Получаем имя и фамилию менеджера для клиента
    async function getManagerEmail(managerId) {
    const { data, error } = await supabase
      .from("managers")
      .select("manager_first_name, manager_last_name")
      .eq("id", managerId)
      .single();

    if (error) {
      console.error("Error fetching manager name:", error);
      return null;
    }

    // Объединяем имя и фамилию в одну строку
    return `${data.manager_first_name} ${data.manager_last_name}`;
  }


   // Функция для преобразования даты в понятный для человека формат
   function formatDateToHumanReadable(date) {
    // Пример форматирования даты
    return new Date(date).toLocaleString();
  }



 // Функция загрузки клиентов
async function loadClients() {
    clientStore.setLoading(true);
    try {
        console.log("Starting to load clients");

        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!userData) throw new Error("No user data found.");

        let query = supabase.from("clients").select("*");
        const isAdminUser = await isAdmin(userData.user);

        if (isAdminUser) {
            User = "Admin";
            is_Admin = true;

            const { data, error } = await query;
            if (error) throw error;

            // Обработка данных для админа
            const processedClients = await Promise.all(
                data.map(async (client) => {
                    const managerEmail = await getManagerEmail(client.manager_id);
                    const { events, count, lastEventStatus } = await loadEventsForClient(client.id);
                    return {
                        ...client,
                        Manager: managerEmail,
                        Touches: count,
                        lastEventStatus: lastEventStatus,
                    };
                })
            );

            // Обновляем store вместо локальной переменной
            clientStore.setClients(processedClients);

        } else {
            User = "Менеджер";
            query = query.eq("manager_id", userData.user.id);
            const { data, error } = await query;
            if (error) throw error;
            
            // Обновляем store для менеджера
            clientStore.setClients(data);
        }

    } catch (error) {
        clientStore.setError(error.message);
        console.error("Unexpected error:", error);
    } finally {
        clientStore.setLoading(false);
    }
}


  async function loadEventsForClient(clientId) {
    try {
      // Загрузка всех событий для данного клиента
      const { data, error } = await supabase
        .from("client_events")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false }); // Сортировка по дате создания в порядке убывания

      if (error) {
        console.error(
          "Ошибка получения данных из таблицы client_events:",
          error
        );
        return { events: [], count: 0, lastEventStatus: null };
      }

      // Форматирование даты и подсчет количества событий
      const clientEvents = data.map((event) => ({
        ...event,
        created_at: formatDateToHumanReadable(event.created_at),
      }));

      const eventCount = clientEvents.length;
      const lastEventStatus =
        clientEvents.length > 0 ? clientEvents[0].status : null;

      return {
        events: clientEvents,
        count: eventCount,
        lastEventStatus: lastEventStatus,
      };
    } catch (error) {
      console.error("Unexpected error:", error);
      return { events: [], count: 0, lastEventStatus: null };
    }
  }


  function handleAdd() {

    currentClient = {
    first_name: "",
    last_name: "",
    object: "",
    phone: "",
    source: "",
    email: "",
    status: "Новый", // дефолтное значение для статуса
  };
    

    isEditing = false;
    isModalOpen = true;
    console.log(' добавляем нового клиента currentClient',currentClient);
  }


  function handleEdit(event) {
    currentClient = { ...event.detail };
    console.log(' обноваляем овыбранного клиента currentClient',currentClient);
    isEditing = true;
    isModalOpen = true;
  }


  async function handleSubmit(event) {
    const clientData = event.detail;
    
    if (isEditing) {
        console.log('isEditing Update',isEditing);
      await updateClient(clientData);
    } else {
        console.log('isEditing Create',isEditing);  
      await createClient(clientData);
    }
    
    isModalOpen = false;
    // await loadClients();
    
  }
  


  // Операции с базой данных
//   async function createClient(clientData) {
//     const { error } = await supabase
//       .from('clients')
//       .insert([{
//         ...clientData,
//         created_at: new Date().toISOString(),
//         user_id: 'jmldigital' // текущий пользователь
//       }]);

//     if (error) throw error;
//   }



  async function createClient(clientData) {
    
      try {
        clientStore.setLoading(true);
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData.user.id;

          const { data: managerData, error: managerError } = await supabase
              .from('managers')
              .select('manager_first_name, manager_last_name')
              .eq('id', userId)
              .single();

          if (managerError) throw managerError;

          const { data, error: addError } = await supabase
              .from('clients')
              .insert([{
                  ...clientData,
                  manager_id: userId,
              }])
              .select();

          if (addError) throw addError;


              // Обновляем store
        const currentClients = $clientStore.clients;
        clientStore.setClients([data[0], ...currentClients]);


        //   clients = [data[0], ...clients];

        //   newClient = {
        //       first_name: '',
        //       last_name: '',
        //       object: '',
        //       phone: '',
        //       source: '',
        //       email: '',
        //       status: 'Новый'
        //   };
        //   showNotification = true;
        //   timeout = 3000;
        //   open = false;
      } catch (err) {
          alert(err.message);
      }
      finally {
        clientStore.setLoading(false);
        
    }
  }


  
  async function updateClient(clientData) {
    try {
        clientStore.setLoading(true);
        const { error } = await supabase
            .from('clients')
            .update(clientData)
            .eq('id', clientData.id);

        if (error) throw error;

        // Обновляем store
        const currentClients = $clientStore.clients;
        clientStore.setClients(
            currentClients.map(c => c.id === clientData.id ? clientData : c)
        );

    } catch (error) {
        clientStore.setError(error.message);
        throw error;
    } finally {
        clientStore.setLoading(false);
        isEditing = false;
    }
}
  </script>




<Header UserStatus={User}></Header>

  
  <div class="client-manager">
    <ClientActions on:add={handleAdd} />
    
    {#if $clientStore.loading}
    <div>Загруз...</div>
{:else if $clientStore.error}
    <div>Error: {$clientStore.error}</div>
{:else}
    <ClientList on:edit={handleEdit} />
{/if}


<!-- <ClientList on:edit={handleEdit} /> -->

    
    <Modal
      bind:open={isModalOpen}
      modalHeading={isEditing ? "Редактировать клиента" : "Добавить клиента"}
      passiveModal
      on:click:button--secondary={() => isModalOpen = false}
      hasForm
    >

    <ClientForm
    client={currentClient}
   {isEditing}
    on:submit={handleSubmit}
  /> 
    </Modal>

   
  </div>
  
  <style>
    .client-manager {
      padding: 20px;
    }
  </style>
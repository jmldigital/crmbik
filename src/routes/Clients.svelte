<script>
  import { onMount } from "svelte";
  import { supabase } from "../lib/supabase";

  import AddClientModal from "./AddClientModal.svelte";
  import AddClientEventsModal from "./AddClientEventsModal.svelte";
  import ClientTable from "./ClientTable.svelte";
  import EditClientModal from "./EditClientModal.svelte";
  import EditClientEventsModal from "./EditClientEventsModal.svelte";

  import Header from "./Header.svelte";

  import {
    Select,
    SelectItem,
    TextInput,
    Button,
    Link,
    DataTable,
    Modal,
    Tag,
    Form,
  } from "carbon-components-svelte";
  import Edit16 from "carbon-icons-svelte/lib/Edit.svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";

  let open = false;
  let openAdd = false;
  let openAddEvent = false;
  let openEditEvent = false;

  let selectedSource = "";
  let AnotherSourse = "";
  let ShowOtherSource = false;

  let User = "Unown";
  
  let isSubmitting = false;
  let formRef;

  let clients = [];

  // Загрузить события для клиента
  let clientEvents = [];

  let newClientEvent = {
    // event_type: '',
    // description: '',
    // status:''
  };

  let newClient = {};

  let isEditing = false;

  let editingClient = {
    first_name: "",
    last_name: "",
    object: "",
    phone: "",
    source: "",
    email: "",
    status: "Новый", // дефолтное значение для статуса
  };

  let editingEvent = {
    description: "",
    status: "",
  };

  let selectedStatus = "";
  let selectedDescription = "";

  let EventsLen = null;

  const standardSources = ["Telegram", "VK", "Наружка", "Шел мимо"];

  $: {
    if (isEditing) {
      if (standardSources.includes(editingClient.source)) {
        ShowOtherSource = false;
        selectedSource = editingClient.source;
        AnotherSourse = "";
      } else {
        ShowOtherSource = true;
        selectedSource = "Другой источник";
        AnotherSourse = editingClient.source;
      }
    }
  }

  onMount(async () => {
    await loadClients();
    // await loadAllEvents();
    
  });

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

  async function isAdmin(user) {
    const { data, error } = await supabase.rpc("is_admin");
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    return data;
  }

  let is_Admin = false;

  // Функция загрузки клиентов
  async function loadClients() {
    try {
      console.log("Starting to load clients");

      // Получение текущего пользователя
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError) {
        console.error("Authentication error:", authError);
        return;
      }

      if (!userData) {
        console.error("No user data found.");
        return;
      }

      let query = supabase.from("clients").select("*");

      // Проверяем роль админа с await
      const isAdminUser = await isAdmin(userData.user);
      console.log("isAdminUser check result:", isAdminUser);

      if (isAdminUser) {
        User = "Admin";
        is_Admin = true;

        // Загрузка всех клиентов для администратора
        const { data, error } = await query;
        if (error) {
          console.error("Ошибка получения данных из таблицы clients:", error);
          return;
        }
        clients = data;

        // Добавление email менеджеров и подсчет событий для каждого клиента
        clients = await Promise.all(
          clients.map(async (client) => {
            const managerEmail = await getManagerEmail(client.manager_id);

            const { events, count, lastEventStatus } =
              await loadEventsForClient(client.id);
            return {
              ...client,
              Manager: managerEmail,
              Touches: count,
              lastEventStatus: lastEventStatus,
            };
          })
        );

        console.log("Clients with manager emails:", clients);
      } else {
        User = "Менеджер";
        // Загрузка клиентов только для текущего менеджера
        query = query.eq("manager_id", userData.user.id);
        const { data, error } = await query;
        if (error) {
          console.error("Error loading clients:", error);
          return;
        }
        clients = data;
      }

    } catch (error) {
      console.error("Unexpected error:", error);
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

  async function updateEventCounter(clientId) {
    await loadClients();
    // Ваш код для обновления счетчика событий
    console.log("Updating event counter for client:", clientId);
    // Здесь добавьте логику обновления счетчика
  }

  async function startEdit(client) {
    isEditing = true;
    editingClient = { ...client };
    open = true;
    // Загрузить события для клиента
    const { events, count } = await loadEventsForClient(client.id);
    clientEvents = events;

    

  }


  // В родительском компоненте
  async function handleSubmit(e) {
        e.preventDefault();
        
        // Проверяем валидацию через ссылку на форму
        if (!formRef.validateForm(editingClient)) {
            return;
        }

        try {
            isSubmitting = true;
            await saveEdit();
        } finally {
            isSubmitting = false;
        }
    }



  async function saveEdit() {

    const sourceToSave = AnotherSourse || selectedSource;

    try {
    // Создаем объект с полями, которые нужно обновить
    const clientToUpdate = {
      // Укажите только те поля, которые нужно обновить
      first_name: editingClient.first_name,
      last_name: editingClient.last_name,
      object: editingClient.object,
      phone: editingClient.phone,
      source: sourceToSave,
      email: editingClient.email,
      status: editingClient.status,
      // Добавьте другие поля, которые нужно обновить
    };
  

    const { error } = await supabase
      .from("clients")
      .update(clientToUpdate)
      .eq("id", editingClient.id);

    if (error) throw error;

    isEditing = false;
    editingClient = null;
    await loadClients();

  } catch (error) {
      alert('Ошибка при сохранении данных');
      console.error('Error:', error);
    }
    
  }

  function stopEdit() {
    isEditing = false;
    open = false;
    editingClient = null;
  }

  function openAddModal() {
    openAdd = true;
  }

  function startEditEvent(event) {
    editingEvent = { ...event };
    selectedStatus = editingEvent.status;
    selectedDescription = editingEvent.description;
    // console.log('editingEvent клиента ',editingEvent);
    openEditEvent = true;
    isEditing = false;
  }

  function closeWindow() {
    isEditing = true;
  }

  function openAddEventModal() {
    openAddEvent = true;
    openAdd = false;
    isEditing = false;
  }

  async function handleSubmitEvent(e) {
    e.preventDefault();

    // Создаем объект с полями, которые нужно обновить
    let eventToUpdate = {
      // Укажите только те поля, которые нужно обновить
      description: selectedDescription,
      status: selectedStatus,
      // Добавьте другие поля, которые нужно обновить
    };

    const { error } = await supabase
      .from("client_events")
      .update(eventToUpdate)
      .eq("id", editingEvent.id);

    if (error) {
      console.error("Error:", error);
      return;
    }
    // console.log('editingEvent after update',editingEvent)
    // console.log('eventToUpdate after update',eventToUpdate)
    // console.log('editingClient after update',editingClient)

    openEditEvent = false;

    // Принудительно обновляем события
    const { events } = await loadEventsForClient(editingClient.id);
    clientEvents = events; // Это вызовет реактивное обновление

    // Обновляем также основную таблицу клиентов
    await loadClients();
  }
</script>

<Header UserStatus={User}></Header>

<AddClientModal bind:open={openAdd} bind:clients bind:newClient />

<!--  -->

<AddClientEventsModal
  bind:open={openAddEvent}
  bind:client_events={clientEvents}
  bind:newClientEvent
  bind:editingClientForEvents={editingClient}
  onEventAdded={updateEventCounter}
/>

<EditClientEventsModal
  bind:open={openEditEvent}
  bind:client_events={clientEvents}
  bind:selectedStatus
  bind:selectedDescription
  {closeWindow}
  handleSubmit={handleSubmitEvent}
  
/>

<ClientTable
  bind:clients
  {startEdit}
  Admin={is_Admin}
  onButtonClick={openAddModal}
/>

<!-- Модальное окно редактирования -->

{#if isEditing}
  <EditClientModal
    bind:open
    bind:editingClient
    bind:clientEvents
    selectedObject={editingClient.object}
    bind:selectedSource
    bind:AnotherSourse
    {startEditEvent}
    saveEdit={handleSubmit}
    {stopEdit}
    {openAddEventModal}
    {ShowOtherSource}
    bind:formRef
  />
{/if}

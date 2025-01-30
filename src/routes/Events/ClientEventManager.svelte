<script>
  import { Modal,Button } from "carbon-components-svelte";
  import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';
  import { supabase } from "../supabase";
  import { eventStore } from "../Stores/eventStore";
  import { clientStore } from "../Stores/clientStore";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
//   import { loadClients } from '../ClientManager.svelte';

  import { onMount } from "svelte";

  import ClientEventForm from "./ClientEventForm.svelte";
  import ClientEventsList from "./ClientEventList.svelte";
  import { adminStore } from '../Stores/adminStore';

  export let clientId;

  let events = [];
  let isModalOpen = false;
  let isEditing = false;
  let currentEvent = null;
  let formRef;

  $: clients = $clientStore.clients;
  $: events = $eventStore.events;

  // Функция для преобразования даты в понятный для человека формат
  function formatDateToHumanReadable(date) {
    // Пример форматирования даты
    return new Date(date).toLocaleString();
  }

  onMount(() => {
    loadEvents();
  });




  async function loadEvents() {
    eventStore.setLoading(true);

    try {
      const { data, error } = await supabase
        .from("client_events")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading events:", error);
        return;
      }

      events = data.map((event) => ({
        ...event,
        created_at: formatDateToHumanReadable(event.created_at),
      }));

      eventStore.setEvents(events);
    } catch (error) {
      eventStore.setError(error.message);
      console.error("Unexpected error:", error);
    } finally {
      eventStore.setLoading(false);
    }
  }

  async function handleEventSubmit(event) {
    const eventData = event.detail;
    eventData.client_id = clientId;

    console.log("eventData событие которое мы пытаемся добавить", eventData);
    try {
      if (isEditing) {
        await updateEvent(eventData);
      } else {
        await createEvent(eventData);
      }

      isModalOpen = false;
      await loadEvents();
    } catch (error) {
      console.error("Error handling event submit:", error);
    }
  }


  async function createEvent(eventData) {
    try {
        const currentClient = clients.find((client) => client.id === clientId);

        // const { data: userData } = await supabase.auth.getUser();
        // if (!userData) throw new Error("Пользователь не аутентифицирован");

        // Создаем событие и получаем его данные одной операцией
        const { data, error: addError } = await supabase
            .from("client_events")
            .insert([{
                ...eventData,
                manager_id: currentClient.manager_id,
                
            }])
            .select();

        if (addError) throw addError;

        eventStore.setEvents(events);

     // Если пользователь админ, перезагружаем все события
     if ($adminStore.isAdmin) {

        await eventStore.loadAllEvents();
        await clientStore.loadClients(); // без параметров

            console.log('перезагружаем под админом все события',events);

        } else {
            // Для не-админа просто добавляем новое событие в store
            const currentEvents = $eventStore.events;
            eventStore.setEvents([data[0], ...currentEvents]);
        }

        return data[0]; // возвращаем созданное событие

    } catch (error) {
        eventStore.setError(error.message);
        console.error("Error creating event:", error);
        throw error;
    }
}


  async function updateEvent(eventData) {
    // Создаем объект с полями, которые нужно обновить
    let eventToUpdate = {
      // Укажите только те поля, которые нужно обновить
      description: eventData.description,
      status: eventData.status,
      // Добавьте другие поля, которые нужно обновить
    };
    const { error } = await supabase
      .from("client_events")
      .update(eventToUpdate)
      .eq("id", eventData.id);

    if (error) throw error;
  }

  function handleAdd() {
    // Находим клиента по ID из массива clients
    const currentClient = clients.find((client) => client.id === clientId);

    if (!currentClient) {
      console.error("Client not found:", clientId);
      return;
    }

    currentEvent = {
      status: "Новый", // устанавливаем значение по умолчанию
      description: "",
      client_id: clientId,
      manager_id: currentClient.manager_id, // добавляем manager_id из найденного клиента
    };

    console.log("Current event with manager_id:", currentEvent);

    isEditing = false;
    isModalOpen = true;
  }

  function handleEdit(event) {
    currentEvent = { ...event.detail };
    isEditing = true;
    isModalOpen = true;
    console.log("нажали на событие-", currentEvent);
  }
</script>

<div class="events-manager">
  <Button
  
  
  icon={Add}
  on:click={handleAdd}
  kind="secondary"
>

Добавить событие</Button>



  <ClientEventsList {events} {clientId} on:edit={handleEdit} />

  <Modal
    bind:open={isModalOpen}
    modalHeading={isEditing ? "Редактировать событие" : "Добавить событие"}
    primaryButtonText={isEditing ? "Сохранить" : "Добавить"}
    secondaryButtonText="Отменить"
    passiveModal
    on:click:button--secondary={() => (isModalOpen = false)}
  >
    <ClientEventForm
      event={currentEvent}
      {isEditing}
      on:submit={handleEventSubmit}
    />
  </Modal>
</div>

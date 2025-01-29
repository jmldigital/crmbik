<script>
  import { Modal } from "carbon-components-svelte";

  import { supabase } from "../../lib/supabase";
  import { eventStore } from "./eventStore";
  import { clientStore } from "../clientStore";

  import { onMount } from "svelte";

  import ClientEventForm from "./ClientEventForm.svelte";
  import ClientEventsList from "./ClientEventList.svelte";

  export let clientId;

  let events = [];
  let isModalOpen = false;
  let isEditing = false;
  let currentEvent = null;
  let formRef;

  $: clients = $clientStore.clients;

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

    const currentClient = clients.find((client) => client.id === clientId);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData) throw new Error("Пользователь не аутентифицирован");

    const { error } = await supabase.from("client_events").insert([
      {
        ...eventData,
        manager_id: currentClient.manager_id,
      },
    ]);

    if (error) throw error;
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
  <button on:click={handleAdd}>Добавить событие</button>

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

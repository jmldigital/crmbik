<script>
  import { Modal, Button, ToastNotification } from "carbon-components-svelte";

  import { supabase } from "../supabase";
  import { eventStore } from "../Stores/eventStore";
  import { clientStore } from "../Stores/clientStore";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  //   import { loadClients } from '../ClientManager.svelte';

  import Event from "carbon-icons-svelte/lib/Lightning.svelte";

  import ClientEventForm from "./ClientEventForm.svelte";
  import ClientEventsList from "./ClientEventList.svelte";
  import { adminStore } from "../Stores/adminStore";

  export let clientId;

  let events = [];
  let isModalOpen = false;
  let isEditing = false;
  let currentEvent = null;
  let formRef;
  let filteredEvents;

  $: clients = $clientStore.clients;
  $: events = $eventStore.events;


  let showSuccessToast = false; // Состояние для управления уведомлением
  let showUpdateToast = false;

  //   console.log('dct события данног пользователя',events);

  // Фильтруем события по clientId
//   $: filteredEvents = events.filter((event) => event.client_id === clientId);


  // Фильтруем события по clientId и преобразуем created_at
$: filteredEvents = events
    .filter(event => event.client_id === clientId)
    .map(event => ({
        ...event,
        created_at: formatDateToHumanReadable(event.created_at) // Перезаписываем created_at
    }));



  // Функция для преобразования даты в понятный для человека формат
  function formatDateToHumanReadable(date) {
    const adjustedDate = new Date(new Date(date).getTime() - (3 * 60 * 60 * 1000));
  
     return adjustedDate.toLocaleString('ru-RU');
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
      //   await loadEvents();
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
        .insert([
          {
            ...eventData,
            manager_id: currentClient.manager_id,
          },
        ])
        .select();

      if (addError) throw addError;

      // Получаем текущие события из eventStore
      const currentEvents = events;

      // Добавляем новое событие в список
      const updatedEvents = [data[0], ...currentEvents]; // Новое событие добавляется в начало списка

      // Обновляем eventStore
      eventStore.setEvents(updatedEvents);

                    // Показываем уведомление об успехе
                    showSuccessToast = true;

// Скрываем уведомление через 3 секунды
setTimeout(() => {
  showSuccessToast = false;
}, 3000);

      return data[0]; // возвращаем созданное событие
    } catch (error) {
      eventStore.setError(error.message);
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async function updateEvent(eventData) {
    try {
        // Создаем объект с полями, которые нужно обновить
        let eventToUpdate = {
            description: eventData.description,
            status: eventData.status,
            // Добавьте другие поля, которые нужно обновить
        };

        // Обновляем событие в Supabase
        const { data, error } = await supabase
            .from("client_events")
            .update(eventToUpdate)
            .eq("id", eventData.id)
            .select(); // Используем .select(), чтобы получить обновленное событие

        if (error) throw error;

        // Используем реактивную переменную events вместо get(eventStore).events
        const eventIndex = events.findIndex(event => event.id === eventData.id);

        if (eventIndex === -1) {
            throw new Error("Событие не найдено в локальном хранилище");
        }

        // Создаем новый массив с обновленным событием
        const updatedEvents = [
            ...events.slice(0, eventIndex), // События до обновляемого
            { ...events[eventIndex], ...data[0] }, // Обновленное событие
            ...events.slice(eventIndex + 1), // События после обновляемого
        ];

        // Обновляем eventStore
        eventStore.setEvents(updatedEvents);

        return data[0]; // Возвращаем обновленное событие



    } catch (error) {
        eventStore.setError(error.message);
        console.error("Error updating event:", error);
        throw error;
    }
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

    
{#if showSuccessToast}
<ToastNotification
  kind="success"
  title="Событие добавлено"
  subtitle={`${currentEvent.description} `}
  timeout={3000}
  lowContrast
/>
{/if}



  <Button icon={Event} on:click={handleAdd} kind="secondary">
    Добавить событие</Button
  >

  <ClientEventsList {filteredEvents} {clientId} on:edit={handleEdit} />

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

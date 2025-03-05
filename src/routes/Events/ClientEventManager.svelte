<script>
  import { Modal, Button, ToastNotification } from "carbon-components-svelte";

  import { supabase } from "../supabase";
  import { eventStore } from "../Stores/eventStore";
  import { clientStore } from "../Stores/clientStore";
  import { referenceStore } from "../Stores/referenceStore";
  //   import { loadClients } from '../ClientManager.svelte';

  import Event from "carbon-icons-svelte/lib/Lightning.svelte";

  import ClientEventForm from "./ClientEventForm.svelte";
  import ClientEventsList from "./ClientEventList.svelte";
  import Toast from "../Toast.svelte"; // Импортируем новый компонент

  export let clientId;

  let events = [];
  let isModalOpen = false;
  let isEditing = false;
  let currentEvent = null;
  let clientStatusNew;
  let filteredEvents =[];

  $: clients = $clientStore.clients;
  $: events = $eventStore.events;
  $: eventStatuses = $referenceStore.eventStatus;
  // $:clientStatusNew;

  let toastNotification = {
    show: false,
    kind: "success",
    title: "",
    subtitle: "",
    timeout: 3000,
    lowContrast: true,
  };

  //   console.log('dct события данног пользователя',events);

  // Фильтруем события по clientId
  //   $: filteredEvents = events.filter((event) => event.client_id === clientId);

  // Фильтруем события по clientId и преобразуем created_at
  $: filteredEvents = events
    .filter((event) => event.client_id === clientId)
    .map((event) => ({
      ...event,
      created_at: formatDateToHumanReadable(event.created_at), // Перезаписываем created_at
    }));

  $: console.log("filteredEvents", filteredEvents);

  // Функция для обновления уведомления

  function showToast(kind, title, subtitle, lowContrast = true) {
    toastNotification = {
      show: true,
      kind,
      title,
      subtitle,
      timeout: 3000,
      lowContrast,
    };
  }

  // Функция для преобразования даты в понятный для человека формат
  function formatDateToHumanReadable(date) {
    const adjustedDate = new Date(
      new Date(date).getTime() - 3 * 60 * 60 * 1000
    );

    return adjustedDate.toLocaleString("ru-RU");
  }


  async function updateClientStatus(clientId, newStatus) {
  try {
    // Обновляем статус клиента в таблице clients
    const { data: updatedClientResponse, error: updateError } = await supabase
      .from("clients")
      .update({ status: newStatus })
      .eq("id", clientId)
      .select();

    if (updateError) throw updateError;

    // Берем первый элемент массива
    const updatedData = updatedClientResponse[0];

    // Проверяем данные updatedData
    if (!updatedData || !updatedData.id) {
      throw new Error("Failed to update client: Invalid response from Supabase");
    }

    // Обновляем clientStore
    const currentClients = $clientStore.clients || [];
    clientStore.setClients(
      currentClients.map((client) =>
        client.id === updatedData.id ? { ...client, ...updatedData } : client
      )
    );

    console.log("Updated clients in store:", $clientStore.clients);

    return updatedData; // Возвращаем обновленные данные клиента
  } catch (error) {
    console.error("Error updating client status:", error);
    throw error;
  }
}






  async function handleEventSubmit(event) {
    const eventData = event.detail;
    eventData.client_id = clientId;
    console.log(
      "clientStatus событие которое мы пытаемся добавить",
      clientStatusNew
    );
    try {
      if (isEditing) {
        console.log(
          "eventData событие которое мы пытаемся редактировать",
          eventData
        );
        await updateEvent(eventData);
      } else {
        console.log(
          "clientStatus событие которое мы пытаемся добавить",
          clientStatusNew
        );
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

    if (!currentClient) {
      throw new Error(`Client with ID ${clientId} not found`);
    }

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

    // Обновляем статус клиента
    await updateClientStatus(currentClient.id, clientStatusNew);

    // Показываем уведомление об успехе
    showToast("success", "Событие успешно добавлено");

    return data[0]; // Возвращаем созданное событие
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
      .eq("id", currentEvent.id)
      .select(); // Используем .select(), чтобы получить обновленное событие

    if (error) throw error;

    // Находим событие для обновления по currentEvent.id
    const eventToUpdateIndex = events.findIndex((event) => event.id === currentEvent.id);

    if (eventToUpdateIndex === -1) {
      throw new Error("Событие не найдено в локальном хранилище");
    }

    // Обновляем событие с помощью .map()
    const updatedEvents = events.map((event) =>
      event.id === currentEvent.id ? { ...event, ...data[0] } : event
    );

    // Обновляем eventStore
    eventStore.setEvents(updatedEvents);

    // Обновляем статус клиента
    await updateClientStatus(clientId, clientStatusNew);

    // Показываем уведомление об успехе
    showToast("success", "Событие успешно обновлено", `${data[0].description || ""}`);

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
      status: eventStatuses[0]?.value || "", // устанавливаем значение по умолчанию
      description: "",
      client_id: clientId,
      manager_id: currentClient.manager_id, // добавляем manager_id из найденного клиента
    };

    console.log("Current event with manager_id:", currentEvent);

    isEditing = false;
    isModalOpen = true;
  }

  function handleEdit(event) {
    const eventData = event.detail;

    // Находим клиента по clientId и получаем его текущий статус
    const currentClient = clients.find((client) => client.id === clientId);
    if (!currentClient) {
      console.error("Client not found:", clientId);
      return;
    }

    // Устанавливаем текущий статус клиента
    clientStatusNew = currentClient.status;

    // Создаем объект currentEvent с текущими данными
    currentEvent = {
      ...eventData,
      clientStatus: clientStatusNew, // Добавляем текущий статус клиента
    };

    isEditing = true;
    isModalOpen = true;

    console.log("Текущее редактируемое собьытие", currentEvent);
  }
</script>

<div class="events-manager">
  <Toast toast={toastNotification} />

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
      bind:clientStatus={clientStatusNew}
      on:submit={handleEventSubmit}
    />
    <!-- <p>Текущий статус клиента: {clientStatusNew}</p> -->
  </Modal>
</div>

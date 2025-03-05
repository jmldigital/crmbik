<!-- ClientManager.svelte -->
<script>
  import ClientForm from "./ClientFormNew.svelte";
  import ClientList from "./ClientList.svelte";
  import ClientActions from "../Clients/Actions.svelte";

  import Header from "../Header.svelte";

  import { Modal, ToastNotification } from "carbon-components-svelte";
  import { supabase } from "../supabase";
  import { clientStore } from "../Stores/clientStore";
  import { eventStore } from "../Stores/eventStore";
  import { onMount } from "svelte";
  import { adminStore } from "../Stores/adminStore";
  import { referenceStore } from "../Stores/referenceStore";
  import { DataTableSkeleton } from "carbon-components-svelte";

  import { userStore } from "../Stores/userStore";
  import { managerStore } from "../Stores/managerStore";
  import { getManagerNameByPhone } from "../utils/supabaseUtils.js";

  import Toast from "../Toast.svelte"; // Импортируем новый компонент

  // Состояния
  let clients = [];
  let isModalOpen = false;
  let isEditing = false;
  let lastEventStatus = null;
  // let currentClient = null;
  let Del = false;

  let managerName = "";

  // Используйте данные из store

  // $: allEvents = $eventStore.events;
  $: isAdmin = $adminStore.isAdmin;
  $: user = $userStore.user;
  // $: userId = user?.id;

  // Получаем данные из store
  $: sources = $referenceStore.sources;
  $: statuses = $referenceStore.statuses;
  $: objects = $referenceStore.objects;
  $: clients = $clientStore.clients;

  let currentClient = {
    first_name: "",
    last_name: "",
    object: "",
    phone: "",
    source: "",
    description: "",
    status: "",
  };

  let toastNotification = {
    show: false,
    kind: "success",
    title: "",
    subtitle: "",
    timeout: 3000,
    lowContrast: true,
  };


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

  async function fetchManagerName(phone) {
    const result = await getManagerNameByPhone(phone);

    if (result) {
      managerName = `${result.first_name} ${result.last_name}`;
    } else {
      managerName = null;
    }
  }

  onMount(async () => {
    Del = false;
    try {
      // Теперь просто вызываем loadClients из store без параметров
      await clientStore.loadClients();
      // Затем загружаем события
      await eventStore.loadEvents();

      if (isAdmin) {
        // Если пользователь администратор, загружаем менеджеров
        await managerStore.loadManagers();
      }
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  });

  function handleAdd() {
    console.log("statuses", statuses[1]?.value);
    currentClient = {
      first_name: "",
      last_name: "",
      object: objects[0]?.value || "",
      phone: "",
      source: sources[0]?.value || "", // Значение по умолчанию - первый элемент
      description: "",
      status: statuses[0]?.value || "", // Значение по умолчанию - первый элемент
    };

    isEditing = false;
    isModalOpen = true;
    console.log(" добавляем нового клиента currentClient", currentClient);
  }

  function handleEdit(event) {
    currentClient = { ...event.detail };
    console.log(
      " обноваляем овыбранного клиента currentClient",
      currentClient.phone
    );
    isEditing = true;
    isModalOpen = true;
  }

  async function handleSubmit(event) {
    const clientData = event.detail;

    if (isEditing) {
      console.log("isEditing Update", clientData);
      await updateClient(clientData);
      isModalOpen = false;
    } else {
      console.log("isEditing Create", clientData);
      await fetchManagerName(clientData.phone);
      console.log("managerName", managerName);

      if (managerName == null) {
        await createClient(clientData);
      } else {
        // console.log("такой клиент уже есть у ", managerName);
        showToast("warning", "Клиент уже существует", `Закреплен за менеджером: ${managerName}`, false);
        isModalOpen = false;
      }

      isModalOpen = false;
      // await loadClients();
    }
  }

  async function createClient(clientData) {
    try {
      clientStore.setLoading(true);
      //   const { data: userData } = await supabase.auth.getUser();
      const userId = user.id;

      // Установить isAdmin в true
      // adminStore.setAdminStatus(true);

      const { data, error: addError } = await supabase
        .from("clients")
        .insert([
          {
            ...clientData,
            manager_id: userId,
          },
        ])
        .select();

      if (addError) throw addError;

      // Обновляем store
      const currentClients = $clientStore.clients;
      clientStore.setClients([data[0], ...currentClients]);

      // Показываем уведомление об успехе

      showToast("success", "Клиент успешно добавлен", `${clientData.first_name} ${clientData.last_name}`);

      // Скрываем уведомление через 3 секунды
    
    } catch (err) {
      alert(err.message);
    } finally {
      clientStore.setLoading(false);
    }
  }

  async function updateClient(clientData) {
  try {
    clientStore.setLoading(true);

    // Деструктурируем объект, исключая свойство Manager и Touches
    const { Manager, Touches, lastEventStatus, ...clientDataToUpdate } = clientData;

    if (Del === true) {
      console.log("Условие удаления выполнено: Del == true");

      // Подсчитываем количество связанных событий
      const { data: eventsCountData, error: eventsCountError } = await supabase
        .from("client_events")
        .select("id")
        .eq("client_id", clientData.id);

      if (eventsCountError) {
        throw new Error(`Ошибка получения количества событий: ${eventsCountError.message}`);
      }

      const eventsCount = eventsCountData.length;

      // Показываем confirm с количеством событий
      const isConfirmed = confirm(
        `Вы уверены, что хотите удалить клиента "${clientData.first_name} ${clientData.last_name}"? Будет удалено ${eventsCount} связанных событий.`
      );

      if (!isConfirmed) {
        console.log("Операция отменена пользователем.");
        isModalOpen = false;
        return;
      }

      // 1. Удаляем все события клиента
      const { error: deleteEventsError } = await supabase
        .from("client_events")
        .delete()
        .eq("client_id", clientData.id);

      if (deleteEventsError) {
        throw new Error(`Ошибка удаления событий клиента: ${deleteEventsError.message}`);
      }

      console.log("Все события клиента успешно удалены.");

      // 2. Удаляем клиента
      const { error: deleteClientError } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientData.id);

      if (deleteClientError) {
        throw new Error(`Ошибка удаления клиента: ${deleteClientError.message}`);
      }

      console.log("Клиент успешно удален.");

      // Обновляем store
      clientStore.setClients($clientStore.clients.filter((c) => c.id !== clientData.id));
      eventStore.setEvents($eventStore.events.filter((e) => e.client_id !== clientData.id));

      // Показываем уведомление об успехе
      showToast("success", "Клиент удален", `${clientData.first_name} ${clientData.last_name}`);

      isModalOpen = false;
      return;
    }

    // Если Del !== true, выполняем обычное обновление клиента
    const { error } = await supabase
      .from("clients")
      .update(clientDataToUpdate)
      .eq("id", clientData.id);

    if (error) throw error;

    console.log("Клиент успешно обновлен.");

    // Обновляем store
    clientStore.setClients(
      $clientStore.clients.map((c) => (c.id === clientData.id ? clientData : c))
    );

    // Показываем уведомление об успехе
    showToast("success", "Клиент обновлен", `${clientData.first_name} ${clientData.last_name}`);
  } catch (error) {
    clientStore.setError(error.message);
    console.error("Error updating or deleting client:", error);
    showToast("danger", "Ошибка", error.message, false);
  } finally {
    clientStore.setLoading(false);
    isEditing = false;
  }
}

</script>

<Header UserStatus={user}></Header>

<Toast toast={toastNotification} />

<div class="client-manager">
  <ClientActions on:add={handleAdd} />

  {#if $clientStore.loading}
    <DataTableSkeleton />
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
    on:click:button--secondary={() => (isModalOpen = false)}
    hasForm
  >
    <ClientForm 
    bind:Del 
    client={currentClient} 
    bind:isEditing={isEditing} 
    on:submit={handleSubmit} />
  </Modal>
</div>

<style>
  .client-manager {
    padding: 20px;
  }
</style>
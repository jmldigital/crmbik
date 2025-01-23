<script>
  import {
    Select,
    SelectItem,
    TextInput,
    Button,
    Modal,
    Form,
  } from "carbon-components-svelte";
  import { supabase } from "../lib/supabase";

  export let open = false;
  export let client_events = {};
  export let selectedStatus = client_events.status;
  export let selectedDescription = client_events.description;

  export let closeWindow;

  export let handleSubmit;

  // export let editingClientForEvents;

  // export let onEventAdded;
  // export let onEventAdded = (clientId) => {};

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   const form = e.target;
    
  //   if (form && form.checkValidity()) {

  //     console.log();

  //   } else {
  //     alert("Пожалуйста, заполните все обязательные поля");
  //   }
  // }

  // async function addClientEvent(client) {
  //   editingClientForEvents = { ...client };

  //   try {
  //     const { data: userData } = await supabase.auth.getUser();
  //     const { data, error: addError } = await supabase
  //       .from("client_events")
  //       .insert([
  //         {
  //           client_id: editingClientForEvents.id,
  //           ...newClientEvent,
  //           manager_id: editingClientForEvents.manager_id,
  //         },
  //       ])
  //       .select();

  //     console.log("редактируем клиента с id - ", editingClientForEvents.id);
  //     console.log("новое событие для клиента - ", newClientEvent);

  //     if (addError) throw addError;

  //     client_events = [data[0], ...client_events];

  //     newClientEvent = {
  //       description: "",
  //       status: "",
  //     };

  //     alert("Клиента событие успешно добавлено");
  //     open = false;

  //     // Вызываем callback функцию
  //     onEventAdded(editingClientForEvents.id);
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // }
</script>

<Modal
  bind:open
  modalHeading="Редактирование события клиента"
  primaryButtonText="Сохранить"
  secondaryButtonText="Отменить"
  on:click:button--secondary={() => (open = false)}
  hasForm
  on:open
  on:close = {closeWindow}
  on:submit={handleSubmit}
>


  
    <TextInput
      type="text"
      placeholder="Описание события"
      bind:value={selectedDescription}
    />

    <Select 
    bind:selected={selectedStatus}
    >
      <SelectItem value="Беседа" text="Беседа" />
      <SelectItem value="Встреча" text="Встреча" />
      <SelectItem value="Звонок" text="Звонок" />
    </Select>
    
  
</Modal>

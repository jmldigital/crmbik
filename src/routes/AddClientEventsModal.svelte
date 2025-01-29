<script>
  import {
    Select,
    SelectItem,
    TextInput,
    Button,
    Modal,
    Form,
    ToastNotification
  } from "carbon-components-svelte";
  import { supabase } from "../lib/supabase";
  import EventForm from "./EventForm.svelte";

  export let open = false;
  export let client_events = [];
  export let newClientEvent = {
    //  description: '',
    //  status:''
  };
  let isEditing = false;
  let timeout = undefined;
  let formEventRef;
  let showNotificationEvent = false;

  export let editingClientForEvents = null;

  // export let onEventAdded;
  export let onEventAdded = (clientId) => {};



// Инициализируем с пустыми значениями


  // Следим за открытием/закрытием модального окна
  $: {
    if (open) {
      // Сбрасываем значения при открытии
      newClientEvent = {
        description: '',
        
      };
    } else {
      isEditing = false;
    }
  }


      // В родительском компоненте
      async function handleSubmit(e) {
        e.preventDefault();
        isEditing=true;
        // Проверяем валидность формы
        if (!formEventRef.isFormValidCheck()) {
            console.log('форма не валидна',newClientEvent);
            return;
        }

        try {
            console.log('форма валидна',newClientEvent);
            
            await addClientEvent(editingClientForEvents);
            
            timeout = 3000;
            showNotificationEvent = true;
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        }
        finally {
          isEditing = false; // Сбрасываем флаг редактирования
    }
    }



  async function addClientEvent(client) {
    editingClientForEvents = { ...client };

    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data, error: addError } = await supabase
        .from("client_events")
        .insert([
          {
            client_id: editingClientForEvents.id,
            ...newClientEvent,
            manager_id: editingClientForEvents.manager_id,
          },
        ])
        .select();

      console.log("редактируем клиента с id - ", editingClientForEvents.id);
      console.log("showNotificationEvent статус - ", showNotificationEvent);

      if (addError) throw addError;

      client_events = [data[0], ...client_events];

      newClientEvent = {
        description: "",
        status: "",
      };
      
      // alert("Клиента событие успешно добавлено");
      showNotificationEvent = false;
      open = false;

      // Вызываем callback функцию
      onEventAdded(editingClientForEvents.id);
    } catch (err) {
      alert(err.message);
    }
  }
</script>


{#if showNotificationEvent}
  <div style="position:absolute;right:0px;top:30px;">
      <ToastNotification
          {timeout}
          kind="success"
          title="Отлично"
          subtitle="Событие клиента успешно добавлено {timeout.toLocaleString()} ms."
          caption={new Date().toLocaleString()}
          on:close={(e) => {
              timeout = undefined;
              console.log(e.detail.timeout);
          }}
      />
  </div>
{/if}


<!-- Добавление новго события -->

<Modal
  
  bind:open
  modalHeading="Добавить событие клиента"
  primaryButtonText="Добавить"
  secondaryButtonText="Отменить"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={handleSubmit}
>






<EventForm
bind:client_events={newClientEvent}
bind:SelectedStatus = {newClientEvent.status}
bind:SelectedDescription = {newClientEvent.description}
bind:this={formEventRef}
{isEditing}
/>
</Modal>

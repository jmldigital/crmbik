<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
  
    export let open = false;
    export let client_events = [];
    export let newClientEvent = {
      
      // description: '',
      // status:''
    };

   
    export let editingClientForEvents = null

  
    function handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      console.log('Form:', form);
      if (form && form.checkValidity()) {
        addClientEvent(editingClientForEvents);
      } else {
        alert('Пожалуйста, заполните все обязательные поля');
      }
    }
  
    async function addClientEvent(client) {

    editingClientForEvents = {...client}

      try {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error: addError } = await supabase
          .from('client_events')
          .insert([{ client_id:editingClientForEvents.id,...newClientEvent, manager_id: userData.user.id }])
          .select();

        console.log('редактируем клиента с id - ',editingClientForEvents.id)
        console.log('новое событие для клиента - ',newClientEvent)

        if (addError) throw addError;
  
        client_events= [data[0], ...client_events];
  
        newClientEvent = {
            
            description: '',
            status:''
        };
  
        alert('Клиента событие успешно добавлено');
        open = false;
  
      } catch (err) {
        alert(err.message);
      }
    }
  </script>
  
  <Modal
    passiveModal
    bind:open={open}
    modalHeading="Добавить событие клиента"
    primaryButtonText="Добавить"
    secondaryButtonText="Отменить"
    on:click:button--secondary={() => (open = false)}
    hasForm
    on:open
    on:close
    on:submit={handleSubmit}
  >

  <!-- {editingClientForEvents.id} -->

  <!-- {console.log('editingClient внутри модалки события',editingClientForEvents)} -->
    <!-- Форма добавления нового клиента -->
    <Form id='my-form' on:submit={handleSubmit}>
  
      <TextInput
        type="text"
        placeholder="Описание события"
        bind:value={newClientEvent.description}
      />
 

      <Select
        bind:selected={newClientEvent.status}
      >
        <SelectItem value="Беседа" text="Беседа" />
        <SelectItem value="Встреча" text="Встреча" />
        <SelectItem value="Звонок" text="Звонок" />
      </Select>
      <Button type="submit">Добавить событие клиента</Button>
    </Form>
  </Modal>
  
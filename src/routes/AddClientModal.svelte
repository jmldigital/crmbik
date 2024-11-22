<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
  
    export let open = false;
    export let clients = [];
    export let newClient = {
      first_name: '',
      last_name: '',
      phone: '',
      source: '',
      email: '',
      status: 'Новый'
    };

   


  
    function handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      console.log('Form:', form);
      if (form && form.checkValidity()) {
        addClient();
      } else {
        alert('Пожалуйста, заполните все обязательные поля');
      }
    }
  
    async function addClient() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error: addError } = await supabase
          .from('clients')
          .insert([{ ...newClient, manager_id: userData.user.id }])
          .select();
  
        if (addError) throw addError;
  
        clients = [data[0], ...clients];
  
        newClient = {
          first_name: '',
          last_name: '',
          phone: '',
          source: '',
          email: '',
          status: 'Новый'
        };
  
        alert('Клиент успешно добавлен');
        open = false;
  
      } catch (err) {
        alert(err.message);
      }
    }
  </script>
  
  <Modal
    passiveModal
    formId='my-form'
    bind:open={open}
    modalHeading="Добавить клиента"
    primaryButtonText="Добавить"
    secondaryButtonText="Отменить"
    on:click:button--secondary={() => (open = false)}
    hasForm
    on:open
    on:close
    on:submit={handleSubmit}
  >
    <!-- Форма добавления нового клиента -->
    <Form id='my-form' on:submit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Имя"
        bind:value={newClient.first_name}
        required
      />
      <TextInput
        type="text"
        placeholder="Фамилия"
        bind:value={newClient.last_name}
      />
      <TextInput
        type="tel"
        placeholder="Телефон"
        bind:value={newClient.phone}
        required
      />
      <TextInput
        type="text"
        placeholder="Источник"
        bind:value={newClient.source}
        required
      />
      <TextInput
        type="email"
        placeholder="Email"
        bind:value={newClient.email}
      />

      <Select
        bind:selected={newClient.status}
      >
        <SelectItem value="Новый" text="Новый" />
        <SelectItem value="В работе" text="В работе" />
        <SelectItem value="Завершен" text="Завершен" />
      </Select>
      <Button type="submit">Добавить клиента</Button>
    </Form>
  </Modal>
  
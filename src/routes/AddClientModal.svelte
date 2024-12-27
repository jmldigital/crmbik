<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
  
    export let open = false;
    export let clients = [];
    export let newClient = {
      // first_name: '',
      // last_name: '',
      // object: '',
      // phone: '',
      // source: '',
      // email: '',
      // status: 'Новый'
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
        const userId = userData.user.id;

      // Получаем данные менеджера по user_id
      const { data: managerData, error: managerError } = await supabase
        .from('managers')
        .select('manager_first_name, manager_last_name')
        .eq('id', userId)
        .single();

      if (managerError) throw managerError;

      // Добавляем клиента с данными менеджера
      const { data, error: addError } = await supabase
        .from('clients')
        .insert([{
          ...newClient,
          manager_id: userId,
          // manager_first_name: managerData.first_name,
          // manager_last_name: managerData.last_name
        }])
        .select();

      if (addError) throw addError;
  
        clients = [data[0], ...clients];
  
        newClient = {
          first_name: '',
          last_name: '',
          object: '',
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

    function handleSelectChange(event) {
      newClient.object = event.target.value;
      
    }

    function handleSelectSource(event) {
      newClient.source = event.target.value;
      
    }


  </script>
  
  <Modal
    passiveModal
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


      <Select on:change={handleSelectSource}>
        <SelectItem value="Telegram" text="Telegram" />
        <SelectItem value="VK" text="VK" />
        <SelectItem value="Наружка" text="Наружка" />
        <SelectItem value="Шел мимо" text="Шел мимо" />
      </Select>

    
      <Select on:change={handleSelectChange}>
        <SelectItem value="ЮЗ-Б" text="ЮЗ-Б" />
        <SelectItem value="ЮЗ-А" text="ЮЗ-А" />
        <SelectItem value="БИК TOWER" text="БИК TOWER" />
      </Select>
    

      <TextInput
        type="tel"
        placeholder="Телефон"
        bind:value={newClient.phone}
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
  
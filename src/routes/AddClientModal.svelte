<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form, TextArea } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
    import ClientForm from "./ClientForm.svelte";

    let SelecedObject = 'БИК TOWER'
    let SelecedTarget = 'VK'

    let formRef;
    let isSubmitting = false;

    export let open = false;
    export let clients = [];
    export let newClient = {
    };

    let ShowOtherSource = false;
    let AnotherSourse = 'Другой источник';

   
  // // Отладочный вывод для проверки инициализации
  // console.log('newClient',newClient);

  // console.log('Object:', newClient.object);
  // console.log('Status:', newClient.status);

  
  // В родительском компоненте
  async function handleSubmit(e) {
        e.preventDefault();
        
        // Проверяем валидацию через ссылку на форму
        if (!formRef.validateForm(newClient)) {
            return;
        }

        try {
            isSubmitting = true;
            await addClient();
        } finally {
            isSubmitting = false;
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

      newClient.object = SelecedObject

      if (ShowOtherSource) {
      newClient.source = AnotherSourse
    }
    else {
      newClient.source = SelecedTarget
    }

    // console.log('newClient.source',newClient.source);

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
      

      if (event.target.value ==  'Другой источник')
           
    {
      ShowOtherSource = true;
      newClient.source = AnotherSourse;
      console.log('AnotherSourse',AnotherSourse);
    }
      else {
        newClient.source = event.target.value;
        ShowOtherSource = false;
      }
      
    }

 
  </script>
  
  <Modal
    
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

  <ClientForm
  {ShowOtherSource}
  bind:AnotherSourse={AnotherSourse}
  bind:this={formRef}
  handleSelectChange ={handleSelectChange}
  handleSelectSource={handleSelectSource}
  client = {newClient}
  ShowButton={false}
  />

  </Modal>
  
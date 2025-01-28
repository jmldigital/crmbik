<script>
  import { Modal, ToastNotification } from "carbon-components-svelte";
  import { supabase } from '../lib/supabase'
  import ClientForm from "./ClientForm.svelte";

  let showNotification = false;
  let timeout = undefined;


  let formRef;
  let isSubmitting = false;

  export let open = false;
  export let clients = [];
  export let newClient = {
     
  };

  let SelectedObject = 'БИК TOWER';
  let SelectedSource = 'VK';
  let ShowOtherSource = false;
  let AnotherSourse = '';

  $: {
      if (ShowOtherSource) {
          newClient.source = AnotherSourse;
      } else {
          newClient.source = SelectedSource;
      }
  }

  async function handleSubmit(e) {
      
      e.preventDefault();

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

          const { data: managerData, error: managerError } = await supabase
              .from('managers')
              .select('manager_first_name, manager_last_name')
              .eq('id', userId)
              .single();

          if (managerError) throw managerError;

          newClient.object = SelectedObject;

          const { data, error: addError } = await supabase
              .from('clients')
              .insert([{
                  ...newClient,
                  manager_id: userId,
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
          showNotification = true;
          timeout = 3000;
          open = false;
      } catch (err) {
          alert(err.message);
      }
  }
</script>

{#if showNotification}
  <div>
      <ToastNotification
          {timeout}
          kind="success"
          title="Отлично"
          subtitle="Клиент успешно добавлен {timeout.toLocaleString()} ms."
          caption={new Date().toLocaleString()}
          on:close={(e) => {
              timeout = undefined;
              console.log(e.detail.timeout);
          }}
      />
  </div>
{/if}

<Modal
  bind:open={open}
  
  primaryButtonText="Добавить"
  secondaryButtonText="Отменить"
  on:click:button--secondary={() => (open = false)}
  hasForm
  on:open
  on:close
  on:submit={handleSubmit}
>
  <ClientForm
      bind:SelectedObject
      bind:SelectedSource
      bind:AnotherSourse
      bind:this={formRef}
      client={newClient}
      ShowButton={false}
  />
</Modal>
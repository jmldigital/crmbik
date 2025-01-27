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

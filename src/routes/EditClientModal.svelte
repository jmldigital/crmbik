<script>
  import { Modal, TextInput, Select, SelectItem, DataTable, Button, Tag } from 'carbon-components-svelte';
  import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';

  export let open = false;
  export let editingClient = null;
  export let clientEvents = [];
  export let saveEdit;
  export let stopEdit;
  export let openAddEventModal;

  function getTagType(status) {
    switch (status) {
      case 'Новый':
        return 'green';
      case 'В работе':
        return 'blue';
      case 'Завершен':
        return 'red';
      default:
        return 'gray';
    }
  }

  function handleSelectChange(event) {
    editingClient.object = event.target.value;
     
    }

    function handleSelectSource(event) {
      editingClient.source = event.target.value;
      
    }


</script>

<Modal
  bind:open
  modalHeading="Редактировать клиента"
  primaryButtonText="Сохранить"
  secondaryButtonText="Отменить"
  on:click:button--secondary={stopEdit}
  on:open
  on:close
  on:submit={saveEdit}
>
  {console.log('editingClient внутри модалки редактирования', editingClient)}

  <TextInput
    type="text"
    bind:value={editingClient.first_name}
  />
  <TextInput
    type="text"
    bind:value={editingClient.last_name}
  />

  <Select on:change={handleSelectChange}>
    <SelectItem value="ЮЗ-Б" text="ЮЗ-Б" />
    <SelectItem value="ЮЗ-А" text="ЮЗ-А" />
    <SelectItem value="БИК TOWER" text="БИК TOWER" />
  </Select>

  <TextInput
    type="tel"
    bind:value={editingClient.phone}
  />

  <Select on:change={handleSelectSource}>
    <SelectItem value="Telegram" text="Telegram" />
    <SelectItem value="VK" text="VK" />
    <SelectItem value="Наружка" text="Наружка" />
    <SelectItem value="Шел мимо" text="Шел мимо" />
  </Select>

  <TextInput
    type="email"
    bind:value={editingClient.email}
  />
  <Select
    bind:selected={editingClient.status}
  >
    <SelectItem value="Новый" text="Новый" />
    <SelectItem value="В работе" text="В работе" />
    <SelectItem value="Завершен" text="Завершен" />
  </Select>

  <h3>События</h3>

  <DataTable
    headers={[
      { key: 'created_at', value: 'Дата события' },
      { key: 'description', value: 'Описание события' },
      { key: 'status', value: 'Статус события' },
      { key: 'actions', value: 'Действия' }
    ]}
    rows={clientEvents}
  >
  </DataTable>

  <Button
    kind="ghost"
    icon={Edit16}
    on:click={openAddEventModal}
  >
    Добавить событие клиента {editingClient.id}
  </Button>
</Modal>

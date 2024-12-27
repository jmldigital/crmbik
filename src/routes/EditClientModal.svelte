<script>
  import { Modal, TextInput, Select, SelectItem, DataTable, Button, Tag } from 'carbon-components-svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import { Grid, Row, Column } from "carbon-components-svelte";

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
  
  // let selected = editingClient.source;
  let selected = editingClient.object;
  let selectedValue = editingClient.source;

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

  { console.log('id менеджера, кому принадлежит клиент', editingClient) }


  <Grid fullWidth>
    <Row>
      <Column>  <TextInput
        type="text"
        bind:value={editingClient.first_name}
      />
      </Column>
      
      <Column>
        <TextInput
        type="text"
        bind:value={editingClient.last_name}
      />
      </Column>

      <Column>

        <TextInput
        type="tel"
        bind:value={editingClient.phone}
      />
      


      </Column>

      <Column>

        <TextInput
        type="email"
        bind:value={editingClient.email}
      />


      </Column>
    
    </Row>


  <Row> 
    <Column>
    
      <Select on:change={handleSelectChange}
      bind:selected
      >
        
        <SelectItem value="ЮЗ-Б" text="ЮЗ-Б" />
        <SelectItem value="ЮЗ-А" text="ЮЗ-А" />
        <SelectItem value="БИК TOWER" text="БИК TOWER" />
      </Select>
    </Column>


        <Column>


        <Select 
        on:change={handleSelectSource}
        bind:selected ={selectedValue} 
        >
          <SelectItem value="Telegram" text="Telegram" />
          <SelectItem value="VK" text="VK" />
          <SelectItem value="Наружка" text="Наружка" />
          <SelectItem value="Шел мимо" text="Шел мимо" />
        </Select>
      </Column>
    
    <Column>
          <Select
          bind:selected={editingClient.status}
        >
          <SelectItem value="Новый" text="Новый" />
          <SelectItem value="В работе" text="В работе" />
          <SelectItem value="Завершен" text="Завершен" />
        </Select>
      </Column>

     

  </Row>

  </Grid>

  <div style="height:50px;"></div>
  <Grid narrow>
    <Row>
      <Column><h3>События</h3></Column>
      <Column>
      <Button size="field"  kind="ghost" on:click={openAddEventModal} >Добавить событие </Button>
      <Button size="field" iconDescription="Tooltip text" icon={Add} on:click={openAddEventModal} />
    </Column>
    </Row>
  </Grid>



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

</Modal>

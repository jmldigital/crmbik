<script>
  import {
    Modal,
    TextInput,
    Select,
    SelectItem,
    DataTable,
    Button,
    Tag,
  } from "carbon-components-svelte";
  import Add from "carbon-icons-svelte/lib/Add.svelte";
  import { Grid, Row, Column } from "carbon-components-svelte";
  import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';

  import ClientForm from "./ClientForm.svelte";

  export let formRef;

  export let open;
  export let editingClient;
  export let clientEvents;

  export let saveEdit;
  export let stopEdit;
  export let openAddEventModal;

  export let startEditEvent;

  export let ShowOtherSource = false;
  
  // let AnotherSourse = editingClient.source;

  function getTagType(status) {
    switch (status) {
      case "Новый":
        return "green";
      case "В работе":
        return "blue";
      case "Завершен":
        return "red";
      default:
        return "gray";
    }
  }

  // let selected = editingClient.source;
  export let selectedObject = editingClient.object;
  export let selectedSource = editingClient.source;
  export let AnotherSourse = '';

 // Реактивное обновление списка событий
//  $: {
//   // AnotherSourse = editingClient.source;
//       console.log('реактивное обновление источника клиента:', editingClient.source);
    
//   }


  function handleSelectChange(event) {
    editingClient.object = event.target.value;
    
  }

  function handleSelectSource(event) {

    if (event.target.value == 'Другой источник')
    {
      ShowOtherSource = true;
       editingClient.source = AnotherSourse;
      console.log('AnotherSourse в редакторе',AnotherSourse);
    }
      else {
        editingClient.source = event.target.value;
        ShowOtherSource = false;
      }
  }

  // console.log("editingClient.object;", editingClient.object);
  // console.log("editingClient.source;", editingClient.source);
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
  <!-- {console.log("id менеджера, кому принадлежит клиент", editingClient)} -->


  <ClientForm
  {ShowOtherSource}
  bind:AnotherSourse={AnotherSourse}
  handleSelectChange ={handleSelectChange}
  handleSelectSource={handleSelectSource}
  client = {editingClient}
  {selectedObject}
  bind:selectedSource={selectedSource}
  ShowButton={false}
  bind:this={formRef}
  />


  <div style="height:50px;"></div>
  <Grid narrow>
    <Row>
      <Column><h3>События</h3></Column>
      <Column>
        <Button size="field" kind="ghost" on:click={openAddEventModal}
          >Добавить событие
        </Button>
        <Button
          size="field"
          iconDescription="Tooltip text"
          icon={Add}
          on:click={openAddEventModal}
        />
      </Column>
    </Row>
  </Grid>

  <DataTable
    headers={[
      { key: "created_at", value: "Дата события" },
      { key: "description", value: "Описание события" },
      { key: "status", value: "Статус события" },
      { key: "actions", value: "Действия" }
    ]}
    rows={clientEvents}
>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === 'actions'}
      <Button
        kind="ghost"
        iconDescription="Редактировать"
        icon={Edit16}
        on:click={() => startEditEvent(row)}
      />
    {:else}
      {row[cell.key]}
    {/if}
  </svelte:fragment>
</DataTable>


</Modal>

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


  export let clientEvents;
  export let openAddEventModal;
  export let startEditEvent;

 
  
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




</script>



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




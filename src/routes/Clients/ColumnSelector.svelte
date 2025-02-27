<script>
    import { DataTable } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    export let allHeaders = []; // Все доступные заголовки
    export let selectedRowIds = []; // Выбранные заголовки
    export let showColumnSelector = false;
  
    const dispatch = createEventDispatcher();
  

    
  // Загружаем сохраненные настройки при монтировании компонента
  onMount(() => {
    const savedColumns = localStorage.getItem("selectedColumns");
    if (savedColumns) {
      selectedRowIds = JSON.parse(savedColumns);
    }

  });



    // Обработчик выбора строки
    function handleSelection(event) {
      if (event.detail.row) {
        const rowId = event.detail.row.id;
        if (event.detail.selected) {
          if (!selectedRowIds.includes(rowId)) {
            selectedRowIds = [...selectedRowIds, rowId];
          }
        } else {
          selectedRowIds = selectedRowIds.filter((id) => id !== rowId);
        }
      } else {
        if (event.detail.selected) {
          selectedRowIds = allHeaders.map((header) => header.id);
        } else {
          selectedRowIds = [];
        }
      }
  
      // Обеспечиваем, что хотя бы одна колонка всегда выбрана
      if (selectedRowIds.length === 0) {
        selectedRowIds = ["actions","overflow"];
      }
  
      // Сохраняем выбранные колонки в localStorage
      localStorage.setItem("selectedColumns", JSON.stringify(selectedRowIds));
  
      // Отправляем событие с обновленными выбранными колонками
      dispatch("update", { selectedRowIds });
    }
  </script>
  {#if showColumnSelector}
  <div class="column-selector">
    <DataTable
      headers={[{ key: "name", value: "Название колонки" }]}
      rows={allHeaders}
      {selectedRowIds}
      selectable
      batchSelection
      on:click:row--select={handleSelection}
      on:click:header--select={handleSelection}
    >
      <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === "name"}
          {row.name}
        {/if}
      </svelte:fragment>
    </DataTable>
  </div>
  {/if}

  <style>
    .column-selector {
      margin-top: 1rem;
    }
  </style>
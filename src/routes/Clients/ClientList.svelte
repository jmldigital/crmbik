<script>
  import {
    DataTable,
    Button,
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    OverflowMenu,
    Link,
    OverflowMenuItem,
  } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  import { clientStore } from "../Stores/clientStore";
  import { eventStore } from "../Stores/eventStore";
  import { managerStore } from "../Stores/managerStore";

  import ClientEventManager from "../Events/ClientEventManager.svelte";
  import Edit16 from "carbon-icons-svelte/lib/Edit.svelte";
  import { adminStore } from "../Stores/adminStore";
  import { onMount } from "svelte";
  import { tableSettingsStore } from "../Stores/tableSettingsStore";

  import Events from "carbon-icons-svelte/lib/Lightning.svelte";
  import Close from "carbon-icons-svelte/lib/Close.svelte";

  import ColumnSelector from "./ColumnSelector.svelte"; // Импортируем компонент для выбора столбцов

  let clients = [];
  let searchTerm = "";
  let filteredClients = [];
  let processedClients = [];
  let expandedClient = null;
  let allHeaders = [];
  let selectedRowIds = [];
  let headers = [];
  let selectedRowTabIds =[]

  const dispatch = createEventDispatcher();

  // Подписываемся на store
  $: isAdmin = $adminStore.isAdmin;
  $: clients = $clientStore.clients;
  $: events = $eventStore.events;
  $: managers = $managerStore.managers;
  $: showColumnSelector = $tableSettingsStore.showColumnSelector;

  // Загружаем выбранные столбцы из localStorage при монтировании
  onMount(() => {
    const savedColumns = localStorage.getItem("selectedColumns");
    if (savedColumns) {
      selectedRowIds = JSON.parse(savedColumns);
    }
  });





  // Предобработка данных
  $: {
    processedClients = clients.map((client) => {
      const manager = managers.find((manager) => manager.id === client.manager_id);
      const managerName = manager
        ? `${manager.manager_first_name} ${manager.manager_last_name}`
        : "Нет менеджера";

      const touchesCount = events.filter((event) => event.client_id === client.id).length;
      const lastEvent = events
        .filter((event) => event.client_id === client.id && event.created_at)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      const lastEventStatus = lastEvent?.status || "Нет событий";

      return {
        ...client,
        Manager: managerName,
        Touches: touchesCount,
        lastEventStatus: lastEventStatus,
      };
    });
  }

  // Фильтрация клиентов
  $: {
    filteredClients = processedClients.filter((client) => {
      const searchFields = [
        client.Manager,
        client.first_name,
        client.last_name,
        client.object,
        client.phone,
        client.description,
        client.status,
        client.source,
        client.Touches,
        client.lastEventStatus,
      ].filter(Boolean);
      return searchFields.join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  // Инициализация заголовков
  $: {
    if ($adminStore) {
      allHeaders = $adminStore.isAdmin
        ? [
          { id: "Manager", name: "Менеджер", key: "Manager", value: "Менеджер" },
          { id: "object", name: "Объект", key: "object", value: "Объект" },
          { id: "last_name", name: "Квартира, этаж", key: "last_name", value: "Квартира, этаж" },
            { id: "first_name", name: "ФИО", key: "first_name", value: "ФИО" },
            { id: "phone", name: "Телефон", key: "phone", value: "Телефон" },
            { id: "description", name: "Описание", key: "description", value: "Описание" },
            
            
            { id: "source", name: "Источник", key: "source", value: "Источник" },
            { id: "status", name: "Статус", key: "status", value: "Статус" },
            { id: "lastEventStatus", name: "Финальная договоренность", key: "lastEventStatus", value: "Финальная договоренность" },
            { id: "actions", name: "Действия", key: "actions", value: "" },
            { id: "overflow", name: "Меню", key: "overflow", value: "Меню" },
          ]
        : [
          { id: "object", name: "Объект", key: "object", value: "Объект" },
            { id: "first_name", name: "ФИО", key: "first_name", value: "ФИО" },
            { id: "last_name", name: "Квартира, этаж", key: "last_name", value: "Квартира, этаж" },
            { id: "phone", name: "Телефон", key: "phone", value: "Телефон" },
            { id: "description", name: "Описание", key: "description", value: "Описание" },
            
            
            { id: "source", name: "Источник", key: "source", value: "Источник" },
            { id: "status", name: "Статус", key: "status", value: "Статус" },

            { id: "lastEventStatus", name: "Финальная договоренность", key: "lastEventStatus", value: "Финальная договоренность" },


            { id: "actions", name: "Действия", key: "actions", value: "Действия" },
            { id: "overflow", name: "Меню", key: "overflow", value: "Меню" },
          ];

      // Если selectedRowIds пуст, используем все заголовки
      if (selectedRowIds.length === 0) {
        selectedRowIds = allHeaders.map((header) => header.id);
      }
    }
  }

  // Обновление headers на основе selectedRowIds
  $: {
    if (allHeaders && selectedRowIds) {
      headers = allHeaders.filter((header) => selectedRowIds.includes(header.id));
    }
  }

  // Обработчик обновления выбранных колонок
  function handleColumnUpdate(event) {
    selectedRowIds = event.detail.selectedRowIds;
  }

  // Остальные функции
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

  function handleSearch(event) {
    searchTerm = event.target.value;
  }

  $: console.log("selectedRowTabIds", selectedRowTabIds);


  let lastHighlightedRowId = null;


  function applyStylesWithDelay(delay) {
    setTimeout(() => {
        const tdElements = document.querySelectorAll('.events-section tr td');
        const iconElements = document.querySelectorAll('.events-section .overflow-cell button .bx--overflow-menu__icon');

        tdElements.forEach(td => {
            if (td instanceof HTMLElement) {
                td.style.backgroundColor = '#393939';
                td.style.color = 'white';
            }
        });

        iconElements.forEach(icon => {
            if (icon instanceof HTMLElement) {
              icon.style.fill = 'white !important';
            }
        });

        console.log('Стили применены к элементам td и иконкам svg',iconElements);
    }, delay);
}


  function highlightRow(rowId) {

    const toggleHighlight = (row, color) => {
        row.querySelectorAll('td').forEach(td => td.style.backgroundColor = color);
    };

    if (lastHighlightedRowId) {
        const lastRow = document.querySelector(`tr[data-row="${lastHighlightedRowId}"]`);
        if (lastRow) toggleHighlight(lastRow, '');
    }

    if (lastHighlightedRowId === rowId) {
        lastHighlightedRowId = null;
        return;
    }

    const currentRow = document.querySelector(`tr[data-row="${rowId}"]`);
    if (currentRow) {
        toggleHighlight(currentRow, '#bbcae5');
        lastHighlightedRowId = rowId;
    } else {
        console.log('Элемент <tr> с указанным data-row не найден.');
    }
}


</script>


  <ColumnSelector
    {showColumnSelector}
    {allHeaders}
    {selectedRowIds}
    on:update={handleColumnUpdate}
  />


{#if expandedClient}
  <ClientEventManager clientId={expandedClient} />
{/if}

<div class="divider"></div>

<div class="clients-table">

<DataTable
 bind:selectedRowIds = {selectedRowTabIds}
  
  sortable
  {headers}
  rows={filteredClients}
  stickyHeader
>
  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === "actions"}
      <Button
        kind={row.Touches === 0 ? 'danger-tertiary' : 'secondary'}
        size="small"
        tooltipPosition="left"
        tooltipAlignment="end"
        iconDescription={expandedClient === row.id
          ? "Скрыть события"
          : "Показать события"}
        icon={expandedClient === row.id ? Close : Events}
        on:click={() => {
           console.log("Row ID:", row.id);
           highlightRow(row.id);
           applyStylesWithDelay(0);
          expandedClient = expandedClient === row.id ? null : row.id;
        }}
      >
        {row.Touches}
      </Button>
    {:else if cell.key === "status"}
      <Tag type={getTagType(cell.value)}>{cell.value}</Tag>
    {:else if cell.key === "overflow"}
      <div class="overflow-cell">
        <OverflowMenu flipped>
          <OverflowMenuItem text="Редактировать">
            <Link on:click={() => dispatch("edit", row)}>
              Редактировать
            </Link>
          </OverflowMenuItem>
        </OverflowMenu>
      </div>
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>

  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch
        persistent
        placeholder="Поиск по всем полям..."
        bind:value={searchTerm}
        on:input={handleSearch}
      />
    </ToolbarContent>
  </Toolbar>
</DataTable>

</div>

<style>
 tr .bx--data-table--selected td {
    background-color: yellow !important;
}

  .button-container {
    margin: 1rem 0;
  }

  .divider {
    height: 5vh;
  }
  
  .bx--data-table td, .bx--data-table tbody tr:hover td {
    background: unset!important;
  }

  
</style>
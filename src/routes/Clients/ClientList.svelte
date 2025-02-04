<script>
  import { DataTable, Button, 
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
  } from 'carbon-components-svelte';

  
  import { createEventDispatcher } from 'svelte';

  import { clientStore } from '../Stores/clientStore';
  import { eventStore } from '../Stores/eventStore';
  import { managerStore } from '../Stores/managerStore';


  import ClientEventManager from '../Events/ClientEventManager.svelte';
  import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';
  import { adminStore } from '../Stores/adminStore';
  import { onMount } from 'svelte';
  import { tableSettingsStore } from '../Stores/tableSettingsStore';
  

  import Events from 'carbon-icons-svelte/lib/Events.svelte';
  import Eyedropper from 'carbon-icons-svelte/lib/Eyedropper.svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  
  let clients = [];
  
  // Подписываемся на изменения store
  $: isAdmin = $adminStore.isAdmin;
  $: clients = $clientStore.clients;
  $: events = $eventStore.events;
  $: managers = $managerStore.managers;


// Добавляем состояние для фильтрации
let searchTerm = "";
let filteredClients = clients;
let processedClients = [];



// $: {
// console.log('все менеджеры',managers);
// }



// Предобработка данных для добавления поля Manager
$: {
    processedClients = clients.map(client => {
        const manager = managers.find(manager => manager.id === client.manager_id);
        const managerName = manager 
            ? `${manager.manager_first_name} ${manager.manager_last_name}` 
            : 'Нет менеджера';

        const touchesCount = events.filter(event => event.client_id === client.id).length;

        // Находим последнее событие для клиента
        const lastEvent = events
            .filter(event => event.client_id === client.id && event.created_at) // Фильтруем только события с created_at
            .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]; // Сортируем по created_at

        const lastEventStatus = lastEvent?.status || 'Нет событий'; // Получаем статус последнего события или устанавливаем 'Нет событий'

        return {
            ...client,
            Manager: managerName, // Поле с именем менеджера
            Touches: touchesCount, // Поле с количеством событий
            lastEventStatus: lastEventStatus, // Поле со статусом последнего события
        };
    });
}



//   // Реактивное выражение для фильтрации клиентов
// Реактивное выражение для фильтрации клиентов
$: {
    filteredClients = processedClients.filter(client => {
        const searchFields = [
            client.Manager, // Теперь поле Manager уже доступно
            client.first_name,
            client.last_name,
            client.object,
            client.phone,
            client.email,
            client.status,
            client.source,
            client.lastEventStatus,
            isAdmin ? client.Manager : '', // Включаем поле Manager только для админа
        ].filter(Boolean); // Удаляем пустые значения
        return searchFields
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });
}


  let expandedClient = null;
  const dispatch = createEventDispatcher();
 
  let showColumnSelector = false;
  
  // Инициализируем переменные
  let allHeaders = [];
  let selectedRowIds = [];
  let headers = [];
  


      // Подписываемся на store
      $: showColumnSelector = $tableSettingsStore.showColumnSelector;



      function getManagerName(client) {
    const manager = managers.find(m => m.id === client.manager_id);
    return manager ? `${manager.manager_first_name} ${manager.manager_last_name}` : 'Нет менеджера';
}



  // Загружаем сохраненные настройки при монтировании компонента
  onMount(() => {
    const savedColumns = localStorage.getItem('selectedColumns');
    if (savedColumns) {
      selectedRowIds = JSON.parse(savedColumns);
    }
  });



// { key: 'first_name', value: 'Имя' },
  // Определяем заголовки после того, как adminStore будет доступен
  $: {
    if ($adminStore) {
      allHeaders = $adminStore.isAdmin 
        ? [
            { id: 'Manager', name: 'Менеджер', key: 'Manager', value: 'Менеджер' },
            { id: 'last_name', name: 'Фамилия', key: 'last_name', value: 'Фамилия' },
            { id: 'object', name: 'Объект', key: 'object', value: 'Объект' },
            { id: 'phone', name: 'Телефон', key: 'phone', value: 'Телефон' },
            { id: 'source', name: 'Источник', key: 'source', value: 'Источник' },
            { id: 'status', name: 'Статус', key: 'status', value: 'Статус' },
            { id: 'Touches', name: 'Касаний', key: 'Touches', value: 'Touches', width: "40px" },
            { id: 'lastEventStatus', name: 'Текущий статус', key: 'lastEventStatus', value: 'Текущий статус' },
            { id: 'actions', name: 'Иконки', key: 'actions', value: 'Действия' }
        ]
        : [
            { id: 'first_name', name: 'Имя', key: 'first_name', value: 'Имя' },
            { id: 'last_name', name: 'Фамилия', key: 'last_name', value: 'Фамилия' },
            { id: 'object', name: 'Объект', key: 'object', value: 'Объект' },
            { id: 'phone', name: 'Телефон', key: 'phone', value: 'Телефон' },
            { id: 'source', name: 'Источник', key: 'source', value: 'Источник' },
            { id: 'status', name: 'Статус', key: 'status', value: 'Статус' },
            { id: 'actions', name: 'Иконки', key: 'actions', value: 'Действия' }
        ];

      // Инициализируем выбранные колонки, если они еще не инициализированы
      if (selectedRowIds.length === 0) {
        selectedRowIds = allHeaders.map(header => header.id);
      }
    }
  }

  // Обновляем headers когда меняются allHeaders или selectedRowIds
  $: {
    if (allHeaders && selectedRowIds) {
      headers = allHeaders.filter(header => selectedRowIds.includes(header.id));
    }
  }

  function getTagType(status) {
      switch (status) {
          case 'Новый': return 'green';
          case 'В работе': return 'blue';
          case 'Завершен': return 'red';
          default: return 'gray';
      }
  }

  function handleSelection(event) {
    // Проверяем структуру события
    console.log('Selection event:', event.detail);

    // Обновляем selectedRowIds на основе выбранных строк
    if (event.detail) {
        // Если это выбор одной строки
        if (event.detail.selected !== undefined) {
            // Получаем id из строки данных
            const rowId = event.detail.row.id; // Изменено здесь
            console.log('Row ID:', rowId); // Для отладки

            if (event.detail.selected) {
                // Добавляем ID если строка выбрана
                if (!selectedRowIds.includes(rowId)) {
                    selectedRowIds = [...selectedRowIds, rowId];
                }
            } else {
                // Удаляем ID если строка снята с выбора
                selectedRowIds = selectedRowIds.filter(id => id !== rowId);
            }
        }
        // Если это batch selection (выбор всех строк)
        else if (event.detail.indeterminate !== undefined) {
            if (event.detail.selected) {
                // Выбираем все строки
                selectedRowIds = allHeaders.map(header => header.id);
            } else {
                // Снимаем выбор со всех строк
                selectedRowIds = [];
            }
        }
    }

    // Обеспечиваем, что хотя бы одна колонка всегда выбрана
    if (selectedRowIds.length === 0) {
        selectedRowIds = ['actions'];
    }

    // Сохраняем выбранные колонки в localStorage
    localStorage.setItem('selectedColumns', JSON.stringify(selectedRowIds));

    // Для отладки
    console.log('Updated selectedRowIds:', selectedRowIds);
}

  function toggleColumnSelector() {
      showColumnSelector = !showColumnSelector;
  }


  // Функция для обработки изменений в поисковой строке
  function handleSearch(event) {
    searchTerm = event.target.value;
  }

</script>



{#if showColumnSelector}
  <div class="column-selector">
    <DataTable
      headers={[{ key: 'name', value: 'Название колонки' }]}
      rows={allHeaders}
      selectedRowIds={selectedRowIds}
      selectable
      batchSelection
      on:click:row--select={handleSelection}
      on:click:header--select={handleSelection}
    >
      <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === 'name'}
          {row.name}
        {/if}
      </svelte:fragment>
    </DataTable>
  </div>
{/if}



{#if expandedClient}
    
      
        <ClientEventManager clientId={expandedClient} />
    
{/if}

<div class="divider">

</div>


<DataTable 

sortable
{headers} 

rows={filteredClients}

stickyHeader>
  <svelte:fragment slot="cell" let:row let:cell>
      {#if cell.key === 'actions'}
      <Button
      kind="ghost"
      size="small"
      tooltipPosition="left"
      tooltipAlignment="end"
      iconDescription={expandedClient === row.id ? 'Скрыть события' : 'Показать события'}
      icon={expandedClient === row.id ? Close : Events}
      on:click={() => expandedClient = expandedClient === row.id ? null : row.id}
    />
          <button on:click={() => dispatch('edit', row)}>
              <Edit16 />
          </button>
      {:else if cell.key === 'status'}
          <Tag type={getTagType(cell.value)}>{cell.value}</Tag>   
      <!-- {:else if cell.key === 'Manager'} 
          {getManagerName(row)} -->

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





<style>
  .button-container {
    margin: 1rem 0;
  }

  .column-selector {
    margin-top: 1rem;
  }

  

  .divider {
    height:5vh;
  }
</style>